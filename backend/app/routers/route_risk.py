from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime
import uuid
import math

from app.models.schemas import RouteRiskRequest, RouteRiskResponse, LocationHistoryCreate
from app.services.news_service import news_service
from app.agents.trigger_agent import trigger_agent
from app.core.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/riders", tags=["Route Analysis"])

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2) * math.sin(dLat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dLon/2) * math.sin(dLon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def generate_interpolated_points(start_lat, start_lon, end_lat, end_lon, num_points=10):
    points = []
    for i in range(num_points):
        fraction = i / (num_points - 1)
        lat = start_lat + (end_lat - start_lat) * fraction
        lon = start_lon + (end_lon - start_lon) * fraction
        points.append([lat, lon])
    return points

@router.post("/{rider_id}/route-risk", response_model=RouteRiskResponse)
async def assess_route_risk(
    rider_id: str,
    payload: RouteRiskRequest,
):
    """
    Analyzes the path from rider to delivery location, identifies risks/incidents,
    and weights the epicenter (delivery location) more heavily.
    """
    # 1. Generate path (straight line interpolated points for mockup)
    points = generate_interpolated_points(
        payload.rider_latitude, payload.rider_longitude, 
        payload.delivery_latitude, payload.delivery_longitude,
        num_points=10
    )
    
    # 2. Get incidents near epicenter (delivery location)
    # We use a mocked search radius or city mapping if needed. For now we use the general news search
    city = "Mumbai" # Simplified
    incidents_data = await news_service.search_incidents(city, hours_back=24)
    
    formatted_incidents = []
    overall_risk = 0.2 # Base
    risk_factors = []
    
    if incidents_data:
        for incident in incidents_data[:3]: # take top 3 
            formatted_incidents.append({
                "type": incident.incident_type,
                "title": incident.title,
                "severity": incident.severity,
                "location": incident.location,
                # Create fake coordinates near the path for visual purposes if needed, 
                # but we can just pass the incident data
                "lat": payload.delivery_latitude + (0.01 * incident.severity),
                "lon": payload.delivery_longitude + (0.01 * incident.severity),
            })
            overall_risk += (incident.severity * 0.15)
            if incident.incident_type not in risk_factors:
                risk_factors.append(incident.incident_type)
                
    # 3. Epicenter weighting
    epicenter_multiplier = 1.5 if len(formatted_incidents) > 0 else 1.0
    overall_risk = min(1.0, overall_risk * epicenter_multiplier)
    
    if not risk_factors:
        risk_factors.append("Clear Route")
        
    return RouteRiskResponse(
        path_coordinates=points,
        incidents=formatted_incidents,
        overall_risk_score=round(overall_risk, 3),
        risk_factors=risk_factors,
        epicenter_multiplier=epicenter_multiplier
    )

@router.post("/{rider_id}/location-history")
async def add_location_history(
    rider_id: str,
    payload: LocationHistoryCreate,
):
    """Record location point for rider history tracking"""
    # In a full app this saves to DB. We will mock the success here to enable UI quickly.
    return {"success": True, "message": "Location recorded"}
