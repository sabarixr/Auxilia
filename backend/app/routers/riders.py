"""
Riders API Router
Endpoints for rider management
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
from datetime import datetime
import uuid

from app.core.database import get_db
from app.models.database import Rider, Policy, Claim
from app.models.schemas import (
    RiderCreate, RiderUpdate, RiderResponse, 
    PersonaType, RiderStatus, APIResponse
)
from app.agents.risk_agent import risk_agent

router = APIRouter(prefix="/riders", tags=["Riders"])


@router.post("/", response_model=RiderResponse)
async def create_rider(
    rider: RiderCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new rider for insurance coverage."""
    # Check if phone already exists
    existing = await db.execute(
        select(Rider).where(Rider.phone == rider.phone)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    # Calculate initial risk score
    risk_assessment = await risk_agent.assess_rider_risk(
        rider_id="new",
        zone_id=rider.zone_id,
        persona=rider.persona,
        lat=rider.latitude,
        lon=rider.longitude,
        claim_history=[]
    )
    
    db_rider = Rider(
        id=str(uuid.uuid4()),
        name=rider.name,
        phone=rider.phone,
        email=rider.email,
        persona=rider.persona.value,
        zone_id=rider.zone_id,
        latitude=rider.latitude,
        longitude=rider.longitude,
        risk_score=risk_assessment.final_risk_score,
        status=RiderStatus.ACTIVE.value,
        created_at=datetime.utcnow()
    )
    
    db.add(db_rider)
    await db.commit()
    await db.refresh(db_rider)
    
    return db_rider


@router.get("/", response_model=List[RiderResponse])
async def list_riders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[RiderStatus] = None,
    zone_id: Optional[str] = None,
    persona: Optional[PersonaType] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all riders with optional filters."""
    query = select(Rider)
    
    if status:
        query = query.where(Rider.status == status.value)
    if zone_id:
        query = query.where(Rider.zone_id == zone_id)
    if persona:
        query = query.where(Rider.persona == persona.value)
    
    query = query.order_by(Rider.created_at.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{rider_id}", response_model=RiderResponse)
async def get_rider(
    rider_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get rider by ID."""
    result = await db.execute(
        select(Rider).where(Rider.id == rider_id)
    )
    rider = result.scalar_one_or_none()
    
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    
    return rider


@router.patch("/{rider_id}", response_model=RiderResponse)
async def update_rider(
    rider_id: str,
    update: RiderUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update rider information."""
    result = await db.execute(
        select(Rider).where(Rider.id == rider_id)
    )
    rider = result.scalar_one_or_none()
    
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    
    update_data = update.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            if hasattr(value, 'value'):
                setattr(rider, field, value.value)
            else:
                setattr(rider, field, value)
    
    # Recalculate risk if zone changed
    if update.zone_id:
        risk_assessment = await risk_agent.assess_rider_risk(
            rider_id=rider_id,
            zone_id=update.zone_id,
            persona=PersonaType(rider.persona),
            lat=rider.latitude,
            lon=rider.longitude
        )
        rider.risk_score = risk_assessment.final_risk_score
    
    await db.commit()
    await db.refresh(rider)
    
    return rider


@router.get("/{rider_id}/risk")
async def get_rider_risk(
    rider_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed risk assessment for a rider."""
    result = await db.execute(
        select(Rider).where(Rider.id == rider_id)
    )
    rider = result.scalar_one_or_none()
    
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    
    # Get claim history
    claims_result = await db.execute(
        select(Claim).where(Claim.rider_id == rider_id)
    )
    claims = claims_result.scalars().all()
    
    claim_history = [
        {
            "id": c.id,
            "status": c.status,
            "amount": c.amount,
            "created_at": c.created_at,
            "days_ago": (datetime.utcnow() - c.created_at).days
        }
        for c in claims
    ]
    
    assessment = await risk_agent.assess_rider_risk(
        rider_id=rider_id,
        zone_id=rider.zone_id,
        persona=PersonaType(rider.persona),
        lat=rider.latitude,
        lon=rider.longitude,
        claim_history=claim_history
    )
    
    return {
        "rider_id": rider_id,
        "rider_name": rider.name,
        "assessment": assessment.model_dump()
    }


@router.get("/{rider_id}/policies")
async def get_rider_policies(
    rider_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all policies for a rider."""
    result = await db.execute(
        select(Policy).where(Policy.rider_id == rider_id).order_by(Policy.created_at.desc())
    )
    policies = result.scalars().all()
    
    return {"rider_id": rider_id, "policies": policies}


@router.get("/{rider_id}/claims")
async def get_rider_claims(
    rider_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all claims for a rider."""
    result = await db.execute(
        select(Claim).where(Claim.rider_id == rider_id).order_by(Claim.created_at.desc())
    )
    claims = result.scalars().all()
    
    return {"rider_id": rider_id, "claims": claims}


@router.post("/{rider_id}/update-location")
async def update_rider_location(
    rider_id: str,
    latitude: float,
    longitude: float,
    db: AsyncSession = Depends(get_db)
):
    """Update rider's current GPS location."""
    result = await db.execute(
        select(Rider).where(Rider.id == rider_id)
    )
    rider = result.scalar_one_or_none()
    
    if not rider:
        raise HTTPException(status_code=404, detail="Rider not found")
    
    rider.latitude = latitude
    rider.longitude = longitude
    
    await db.commit()
    
    return {"success": True, "message": "Location updated"}


@router.get("/stats/overview")
async def get_rider_stats(
    db: AsyncSession = Depends(get_db)
):
    """Get overall rider statistics."""
    total = await db.execute(select(func.count(Rider.id)))
    active = await db.execute(
        select(func.count(Rider.id)).where(Rider.status == RiderStatus.ACTIVE.value)
    )
    avg_risk = await db.execute(select(func.avg(Rider.risk_score)))
    
    # Count by persona
    qcommerce = await db.execute(
        select(func.count(Rider.id)).where(Rider.persona == PersonaType.QCOMMERCE.value)
    )
    food_delivery = await db.execute(
        select(func.count(Rider.id)).where(Rider.persona == PersonaType.FOOD_DELIVERY.value)
    )
    
    return {
        "total_riders": total.scalar() or 0,
        "active_riders": active.scalar() or 0,
        "average_risk_score": round(avg_risk.scalar() or 0, 3),
        "by_persona": {
            "qcommerce": qcommerce.scalar() or 0,
            "food_delivery": food_delivery.scalar() or 0
        }
    }
