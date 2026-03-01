import asyncio

from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/apartments", tags=["apartments"])

PROPERTIES = [
    {
        "id": "1", "title": "Modern Studio in Zurich",
        "city": "Zurich", "canton": "ZH", "rent": 1800, "rooms": 1,
        "type": "studio", "sqm": 35, "furnished": True,
        "petFriendly": False, "parking": False,
        "balcony": True, "elevator": True,
    },
    {
        "id": "2", "title": "2-Room Apartment in Geneva",
        "city": "Geneva", "canton": "GE", "rent": 2200, "rooms": 2,
        "type": "apartment", "sqm": 55, "furnished": False,
        "petFriendly": True, "parking": True,
        "balcony": True, "elevator": True,
    },
    {
        "id": "3", "title": "Family Home in Bern",
        "city": "Bern", "canton": "BE", "rent": 2800, "rooms": 4,
        "type": "house", "sqm": 120, "furnished": False,
        "petFriendly": True, "parking": True,
        "balcony": False, "elevator": False,
    },
    {
        "id": "4", "title": "Shared Room in Basel",
        "city": "Basel", "canton": "BS", "rent": 900, "rooms": 1,
        "type": "shared", "sqm": 18, "furnished": True,
        "petFriendly": False, "parking": False,
        "balcony": False, "elevator": True,
    },
    {
        "id": "5", "title": "Luxury Penthouse Lausanne",
        "city": "Lausanne", "canton": "VD", "rent": 4500, "rooms": 3,
        "type": "apartment", "sqm": 100, "furnished": True,
        "petFriendly": True, "parking": True,
        "balcony": True, "elevator": True,
    },
    {
        "id": "6", "title": "Cozy 1.5 Room Winterthur",
        "city": "Winterthur", "canton": "ZH", "rent": 1400, "rooms": 1.5,
        "type": "apartment", "sqm": 42, "furnished": False,
        "petFriendly": False, "parking": False,
        "balcony": True, "elevator": False,
    },
]


@router.get("")
async def get_apartments(
    city: str | None = None,
    min_rent: int | None = Query(None, alias="minRent"),
    max_rent: int | None = Query(None, alias="maxRent"),
    min_rooms: float | None = Query(None, alias="minRooms"),
    max_rooms: float | None = Query(None, alias="maxRooms"),
    type: str | None = None,
    furnished: bool | None = None,
    pet_friendly: bool | None = Query(None, alias="petFriendly"),
    parking: bool | None = None,
    balcony: bool | None = None,
    elevator: bool | None = None,
):
    await asyncio.sleep(0.3)

    results = PROPERTIES

    if city:
        results = [p for p in results if city.lower() in p["city"].lower()]
    if min_rent is not None:
        results = [p for p in results if p["rent"] >= min_rent]
    if max_rent is not None:
        results = [p for p in results if p["rent"] <= max_rent]
    if min_rooms is not None:
        results = [p for p in results if p["rooms"] >= min_rooms]
    if max_rooms is not None:
        results = [p for p in results if p["rooms"] <= max_rooms]
    if type:
        results = [p for p in results if p["type"] == type]
    if furnished is not None:
        results = [p for p in results if p["furnished"] == furnished]
    if pet_friendly is not None:
        results = [p for p in results if p["petFriendly"] == pet_friendly]
    if parking is not None:
        results = [p for p in results if p["parking"] == parking]
    if balcony is not None:
        results = [p for p in results if p["balcony"] == balcony]
    if elevator is not None:
        results = [p for p in results if p["elevator"] == elevator]

    return {"properties": results, "total": len(results)}
