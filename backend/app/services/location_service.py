"""
OpenStreetMap / Nominatim Location Service
Geocoding and reverse geocoding for zone management
"""
import httpx
from typing import Optional, Dict, Any, List, Tuple
from datetime import datetime
from app.core.config import settings
from app.models.schemas import LocationData
import logging
import math

logger = logging.getLogger(__name__)

NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"


class LocationService:
    """
    OpenStreetMap / Nominatim integration for geocoding and location services.
    Used for zone management and rider location tracking.
    """
    
    def __init__(self):
        self.client = httpx.AsyncClient(
            timeout=30.0,
            headers={
                "User-Agent": "Auxilia-Insurance/1.0 (contact@auxilia.io)"
            }
        )
    
    async def geocode(self, address: str, city: str = None, country: str = "India") -> Optional[LocationData]:
        """
        Convert address to coordinates.
        Returns lat, lon, and place details.
        """
        try:
            url = f"{NOMINATIM_BASE_URL}/search"
            
            query = address
            if city:
                query = f"{address}, {city}, {country}"
            
            params = {
                "q": query,
                "format": "json",
                "addressdetails": 1,
                "limit": 1,
                "countrycodes": "in"  # Limit to India
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            if not data:
                return None
            
            result = data[0]
            address_details = result.get("address", {})
            
            return LocationData(
                latitude=float(result["lat"]),
                longitude=float(result["lon"]),
                display_name=result.get("display_name", ""),
                place_type=result.get("type", ""),
                place_class=result.get("class", ""),
                city=address_details.get("city") or address_details.get("town") or address_details.get("village", ""),
                state=address_details.get("state", ""),
                country=address_details.get("country", ""),
                postcode=address_details.get("postcode", ""),
                suburb=address_details.get("suburb") or address_details.get("neighbourhood", ""),
                road=address_details.get("road", ""),
                osm_id=result.get("osm_id"),
                osm_type=result.get("osm_type"),
                importance=float(result.get("importance", 0)),
                timestamp=datetime.utcnow()
            )
        except httpx.HTTPError as e:
            logger.error(f"Nominatim API error: {e}")
            return None
        except Exception as e:
            logger.error(f"Geocoding error: {e}")
            return None
    
    async def reverse_geocode(self, lat: float, lon: float) -> Optional[LocationData]:
        """
        Convert coordinates to address.
        """
        try:
            url = f"{NOMINATIM_BASE_URL}/reverse"
            params = {
                "lat": lat,
                "lon": lon,
                "format": "json",
                "addressdetails": 1,
                "zoom": 18
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            result = response.json()
            
            address_details = result.get("address", {})
            
            return LocationData(
                latitude=lat,
                longitude=lon,
                display_name=result.get("display_name", ""),
                place_type=result.get("type", ""),
                place_class=result.get("class", ""),
                city=address_details.get("city") or address_details.get("town") or address_details.get("village", ""),
                state=address_details.get("state", ""),
                country=address_details.get("country", ""),
                postcode=address_details.get("postcode", ""),
                suburb=address_details.get("suburb") or address_details.get("neighbourhood", ""),
                road=address_details.get("road", ""),
                osm_id=result.get("osm_id"),
                osm_type=result.get("osm_type"),
                importance=0.0,
                timestamp=datetime.utcnow()
            )
        except Exception as e:
            logger.error(f"Reverse geocoding error: {e}")
            return None
    
    async def search_nearby(
        self, 
        lat: float, 
        lon: float, 
        radius_meters: int = 500,
        amenity_type: str = None
    ) -> List[Dict[str, Any]]:
        """
        Search for nearby places using Overpass API.
        amenity_type: restaurant, hospital, police, fuel, etc.
        """
        try:
            # Build Overpass query
            query = f"""
            [out:json][timeout:25];
            (
              node["amenity"{"='" + amenity_type + "'" if amenity_type else ""}](around:{radius_meters},{lat},{lon});
              way["amenity"{"='" + amenity_type + "'" if amenity_type else ""}](around:{radius_meters},{lat},{lon});
            );
            out body;
            >;
            out skel qt;
            """
            
            response = await self.client.post(
                OVERPASS_URL,
                data={"data": query}
            )
            response.raise_for_status()
            data = response.json()
            
            places = []
            for element in data.get("elements", []):
                if element.get("type") == "node" and "tags" in element:
                    tags = element.get("tags", {})
                    places.append({
                        "name": tags.get("name", "Unknown"),
                        "type": tags.get("amenity", ""),
                        "lat": element.get("lat"),
                        "lon": element.get("lon"),
                        "distance": self._calculate_distance(lat, lon, element.get("lat"), element.get("lon")),
                        "tags": tags
                    })
            
            # Sort by distance
            places.sort(key=lambda x: x.get("distance", float("inf")))
            return places
        except Exception as e:
            logger.error(f"Nearby search error: {e}")
            return []
    
    async def get_zone_boundary(
        self, 
        lat: float, 
        lon: float
    ) -> Optional[Dict[str, Any]]:
        """
        Get administrative boundary for a location.
        Used to define insurance zones.
        """
        try:
            url = f"{NOMINATIM_BASE_URL}/reverse"
            params = {
                "lat": lat,
                "lon": lon,
                "format": "json",
                "polygon_geojson": 1,
                "zoom": 14  # Suburb level
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            result = response.json()
            
            return {
                "name": result.get("display_name", ""),
                "geojson": result.get("geojson"),
                "boundingbox": result.get("boundingbox"),
                "place_id": result.get("place_id"),
                "osm_id": result.get("osm_id")
            }
        except Exception as e:
            logger.error(f"Zone boundary error: {e}")
            return None
    
    def _calculate_distance(
        self, 
        lat1: float, 
        lon1: float, 
        lat2: float, 
        lon2: float
    ) -> float:
        """
        Calculate distance between two points using Haversine formula.
        Returns distance in meters.
        """
        R = 6371000  # Earth's radius in meters
        
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)
        
        a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def is_within_zone(
        self, 
        lat: float, 
        lon: float, 
        zone_center: Tuple[float, float], 
        zone_radius_meters: float
    ) -> bool:
        """Check if a point is within a zone radius"""
        distance = self._calculate_distance(lat, lon, zone_center[0], zone_center[1])
        return distance <= zone_radius_meters
    
    async def batch_geocode(self, addresses: List[str]) -> List[Optional[LocationData]]:
        """
        Geocode multiple addresses.
        Note: Nominatim has rate limits, so we add small delays.
        """
        import asyncio
        
        results = []
        for address in addresses:
            result = await self.geocode(address)
            results.append(result)
            await asyncio.sleep(1)  # Respect rate limits
        
        return results
    
    async def close(self):
        await self.client.aclose()


location_service = LocationService()
