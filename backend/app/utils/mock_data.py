# ============================================================
# CycloneShield AI — Mock Data for Backend (mirrors frontend)
# ============================================================

from datetime import datetime, timedelta

MOCK_CYCLONE = {
    "id": "CYC-2024-001",
    "name": "Cyclone Biparjoy-II",
    "category": 4,
    "wind_speed": 185,
    "pressure": 942,
    "lat": 19.2,
    "lng": 67.8,
    "trajectory": [
        {"lat": 17.5, "lng": 66.2}, {"lat": 18.0, "lng": 66.8},
        {"lat": 18.8, "lng": 67.4}, {"lat": 19.2, "lng": 67.8},
        {"lat": 20.1, "lng": 68.5}, {"lat": 21.0, "lng": 69.2},
        {"lat": 22.2, "lng": 70.1}, {"lat": 23.0, "lng": 70.8},
    ],
    "predicted_landfall": "Jamnagar",
    "landfall_time": (datetime.now() + timedelta(hours=36)).isoformat(),
    "intensity": "Very Severe Cyclonic Storm",
    "storm_surge": 4.5,
    "rainfall_estimate": 380,
    "confidence": 87,
    "last_updated": datetime.now().isoformat(),
    "is_active": True,
}

GUJARAT_DISTRICTS = [
    {"id": "kutch", "name": "Kutch", "lat": 23.7, "lng": 69.8, "population": 2090000, "coastlineKm": 407, "riskLevel": "HIGH", "riskScore": 78, "evacuated": 45000, "boatsAtSea": 234, "sheltersTotal": 89, "sheltersActive": 67, "shelterCapacity": 45000, "shelterOccupancy": 32000},
    {"id": "jamnagar", "name": "Jamnagar", "lat": 22.47, "lng": 70.06, "population": 2160000, "coastlineKm": 320, "riskLevel": "CRITICAL", "riskScore": 94, "evacuated": 78000, "boatsAtSea": 412, "sheltersTotal": 112, "sheltersActive": 98, "shelterCapacity": 62000, "shelterOccupancy": 58000},
    {"id": "dwarka", "name": "Devbhumi Dwarka", "lat": 22.24, "lng": 68.97, "population": 760000, "coastlineKm": 243, "riskLevel": "CRITICAL", "riskScore": 91, "evacuated": 32000, "boatsAtSea": 178, "sheltersTotal": 45, "sheltersActive": 41, "shelterCapacity": 28000, "shelterOccupancy": 25000},
    {"id": "porbandar", "name": "Porbandar", "lat": 21.64, "lng": 69.61, "population": 590000, "coastlineKm": 185, "riskLevel": "HIGH", "riskScore": 82, "evacuated": 21000, "boatsAtSea": 291, "sheltersTotal": 38, "sheltersActive": 34, "shelterCapacity": 22000, "shelterOccupancy": 17000},
    {"id": "junagadh", "name": "Junagadh", "lat": 21.52, "lng": 70.46, "population": 2450000, "coastlineKm": 98, "riskLevel": "MEDIUM", "riskScore": 61, "evacuated": 8500, "boatsAtSea": 89, "sheltersTotal": 56, "sheltersActive": 28, "shelterCapacity": 35000, "shelterOccupancy": 12000},
    {"id": "gir_somnath", "name": "Gir Somnath", "lat": 20.97, "lng": 70.38, "population": 1250000, "coastlineKm": 155, "riskLevel": "HIGH", "riskScore": 76, "evacuated": 15000, "boatsAtSea": 145, "sheltersTotal": 42, "sheltersActive": 38, "shelterCapacity": 26000, "shelterOccupancy": 18000},
    {"id": "amreli", "name": "Amreli", "lat": 21.6, "lng": 71.22, "population": 1510000, "coastlineKm": 122, "riskLevel": "MEDIUM", "riskScore": 54, "evacuated": 5200, "boatsAtSea": 67, "sheltersTotal": 34, "sheltersActive": 18, "shelterCapacity": 20000, "shelterOccupancy": 8000},
    {"id": "bhavnagar", "name": "Bhavnagar", "lat": 21.76, "lng": 72.15, "population": 2880000, "coastlineKm": 202, "riskLevel": "MEDIUM", "riskScore": 59, "evacuated": 12000, "boatsAtSea": 198, "sheltersTotal": 72, "sheltersActive": 45, "shelterCapacity": 48000, "shelterOccupancy": 22000},
    {"id": "surat", "name": "Surat", "lat": 21.17, "lng": 72.83, "population": 6060000, "coastlineKm": 89, "riskLevel": "LOW", "riskScore": 38, "evacuated": 3200, "boatsAtSea": 45, "sheltersTotal": 145, "sheltersActive": 30, "shelterCapacity": 95000, "shelterOccupancy": 14000},
    {"id": "valsad", "name": "Valsad", "lat": 20.61, "lng": 72.93, "population": 1700000, "coastlineKm": 78, "riskLevel": "LOW", "riskScore": 32, "evacuated": 1800, "boatsAtSea": 23, "sheltersTotal": 48, "sheltersActive": 14, "shelterCapacity": 30000, "shelterOccupancy": 5500},
]

MOCK_FISHERMEN = [
    {"id": "F001", "name": "Ramesh Makwana", "phone": "+91-9824XXXXXX", "boatId": "GJ-JAM-1234", "district": "Jamnagar", "lat": 21.8, "lng": 69.1, "status": "AT_SEA", "crewCount": 8, "nearestHarbor": "Nawabander", "distanceToHarbor": 45, "estimatedReturn": "6h", "lastPing": "5 min ago", "riskScore": 91},
    {"id": "F002", "name": "Bhavesh Solanki", "phone": "+91-9825XXXXXX", "boatId": "GJ-POR-0891", "district": "Porbandar", "lat": 21.2, "lng": 68.9, "status": "RETURNING", "crewCount": 5, "nearestHarbor": "Porbandar", "distanceToHarbor": 18, "estimatedReturn": "2h", "lastPing": "2 min ago", "riskScore": 72},
    {"id": "F003", "name": "Suresh Vadher", "phone": "+91-9826XXXXXX", "boatId": "GJ-DWK-0456", "district": "Devbhumi Dwarka", "lat": 22.0, "lng": 68.4, "status": "EMERGENCY", "crewCount": 12, "nearestHarbor": "Okha", "distanceToHarbor": 62, "estimatedReturn": "EMERGENCY", "lastPing": "18 min ago", "riskScore": 98},
    {"id": "F004", "name": "Naresh Rathod", "phone": "+91-9827XXXXXX", "boatId": "GJ-KUT-2201", "district": "Kutch", "lat": 23.1, "lng": 68.7, "status": "AT_SEA", "crewCount": 6, "nearestHarbor": "Mandvi", "distanceToHarbor": 38, "estimatedReturn": "5h", "lastPing": "8 min ago", "riskScore": 85},
    {"id": "F005", "name": "Pravin Bharwad", "phone": "+91-9828XXXXXX", "boatId": "GJ-GIR-0712", "district": "Gir Somnath", "lat": 20.7, "lng": 70.1, "status": "IN_HARBOR", "crewCount": 4, "nearestHarbor": "Veraval", "distanceToHarbor": 0, "estimatedReturn": "Safe", "lastPing": "1 min ago", "riskScore": 12},
    {"id": "F006", "name": "Jayesh Patel", "phone": "+91-9829XXXXXX", "boatId": "GJ-JAM-3345", "district": "Jamnagar", "lat": 22.1, "lng": 69.8, "status": "AT_SEA", "crewCount": 9, "nearestHarbor": "Bedi Port", "distanceToHarbor": 55, "estimatedReturn": "8h", "lastPing": "3 min ago", "riskScore": 88},
    {"id": "F007", "name": "Dinesh Gohil", "phone": "+91-9830XXXXXX", "boatId": "GJ-AMR-0567", "district": "Amreli", "lat": 21.0, "lng": 71.5, "status": "RETURNING", "crewCount": 7, "nearestHarbor": "Jafrabad", "distanceToHarbor": 22, "estimatedReturn": "3h", "lastPing": "6 min ago", "riskScore": 65},
    {"id": "F008", "name": "Kiran Mer", "phone": "+91-9831XXXXXX", "boatId": "GJ-BHV-1123", "district": "Bhavnagar", "lat": 21.5, "lng": 72.4, "status": "MISSING", "crewCount": 5, "nearestHarbor": "Bhavnagar", "distanceToHarbor": 78, "estimatedReturn": "UNKNOWN", "lastPing": "2h ago", "riskScore": 97},
]

MOCK_SHELTERS = [
    {"id": "SH001", "name": "GMDC Cyclone Shelter", "district": "Jamnagar", "lat": 22.47, "lng": 70.06, "capacity": 5000, "occupied": 4800, "status": "PARTIAL", "facilities": ["Food", "Water", "Medical", "Electricity", "Sanitation"], "contactPhone": "0288-XXXXXX", "inCharge": "Collector Jamnagar"},
    {"id": "SH002", "name": "Kutch District Shelter A", "district": "Kutch", "lat": 23.0, "lng": 69.7, "capacity": 3000, "occupied": 1800, "status": "AVAILABLE", "facilities": ["Food", "Water", "Medical", "Electricity"], "contactPhone": "02832-XXXXXX", "inCharge": "Dy. Collector Bhuj"},
    {"id": "SH003", "name": "Porbandar Central Shelter", "district": "Porbandar", "lat": 21.64, "lng": 69.61, "capacity": 2500, "occupied": 2450, "status": "FULL", "facilities": ["Food", "Water", "Medical"], "contactPhone": "0286-XXXXXX", "inCharge": "Municipal Commissioner"},
    {"id": "SH004", "name": "Dwarka Panchayat Shelter", "district": "Devbhumi Dwarka", "lat": 22.24, "lng": 68.97, "capacity": 2000, "occupied": 1950, "status": "FULL", "facilities": ["Food", "Water", "Medical", "Electricity"], "contactPhone": "02892-XXXXXX", "inCharge": "Taluka Dev. Officer"},
    {"id": "SH005", "name": "Somnath Coastal Shelter", "district": "Gir Somnath", "lat": 20.97, "lng": 70.38, "capacity": 3500, "occupied": 1200, "status": "AVAILABLE", "facilities": ["Food", "Water", "Medical", "Sanitation"], "contactPhone": "0287-XXXXXX", "inCharge": "Dist. Panchayat CEO"},
    {"id": "SH006", "name": "Bhavnagar District Shelter", "district": "Bhavnagar", "lat": 21.76, "lng": 72.15, "capacity": 4000, "occupied": 2100, "status": "AVAILABLE", "facilities": ["Food", "Water", "Medical", "Electricity", "Sanitation"], "contactPhone": "0278-XXXXXX", "inCharge": "Collector Bhavnagar"},
]

MOCK_ALERTS = [
    {"id": "ALT001", "type": "CYCLONE", "level": "CRITICAL", "title": "Cyclone Biparjoy-II - Red Alert", "message": "Severe cyclone expected to make landfall near Jamnagar in 36 hours. Wind speed 185 km/h.", "district": "Jamnagar", "affectedPopulation": 420000, "issuedAt": datetime.now().isoformat(), "isActive": True, "source": "IMD"},
    {"id": "ALT002", "type": "STORM_SURGE", "level": "CRITICAL", "title": "Storm Surge Warning - 4.5m expected", "message": "Dangerous storm surge expected along Jamnagar and Devbhumi Dwarka coast.", "district": "Devbhumi Dwarka", "affectedPopulation": 185000, "issuedAt": datetime.now().isoformat(), "isActive": True, "source": "INCOIS"},
    {"id": "ALT003", "type": "CYCLONE", "level": "HIGH", "title": "Orange Alert - Kutch District", "message": "Cyclone approaching. Heavy rainfall and strong winds expected.", "district": "Kutch", "affectedPopulation": 280000, "issuedAt": datetime.now().isoformat(), "isActive": True, "source": "SDMA Gujarat"},
    {"id": "ALT004", "type": "EVACUATION", "level": "HIGH", "title": "Mandatory Evacuation - 5km Coastal Belt", "message": "All residents within 5km of coastline must evacuate immediately.", "district": "Jamnagar", "affectedPopulation": 156000, "issuedAt": datetime.now().isoformat(), "isActive": True, "source": "District Collectorate"},
    {"id": "ALT005", "type": "WIND", "level": "HIGH", "title": "Gale Force Winds Warning", "message": "Wind speeds 90-110 km/h expected. All fishing vessels must return to harbor.", "district": "Porbandar", "affectedPopulation": 45000, "issuedAt": datetime.now().isoformat(), "isActive": True, "source": "Fisheries Department"},
    {"id": "ALT006", "type": "FLOOD", "level": "MEDIUM", "title": "Flash Flood Watch - Amreli", "message": "Heavy rainfall expected (200-300mm in 24hrs). Flash flood risk in low-lying areas.", "district": "Amreli", "affectedPopulation": 78000, "issuedAt": datetime.now().isoformat(), "isActive": True, "source": "CWC"},
]

MOCK_WEATHER = [
    {"district": "Jamnagar", "temperature": 28, "humidity": 92, "windSpeed": 78, "windDirection": "NNW", "rainfall": 45, "pressure": 990, "seaState": "Very Rough", "waveHeight": 5.2, "visibility": 2},
    {"district": "Kutch", "temperature": 26, "humidity": 88, "windSpeed": 65, "windDirection": "NW", "rainfall": 28, "pressure": 995, "seaState": "Rough", "waveHeight": 3.8, "visibility": 4},
    {"district": "Porbandar", "temperature": 29, "humidity": 90, "windSpeed": 58, "windDirection": "NNW", "rainfall": 32, "pressure": 998, "seaState": "Rough", "waveHeight": 3.2, "visibility": 5},
    {"district": "Devbhumi Dwarka", "temperature": 27, "humidity": 94, "windSpeed": 85, "windDirection": "N", "rainfall": 67, "pressure": 985, "seaState": "Very Rough", "waveHeight": 5.8, "visibility": 1},
    {"district": "Gir Somnath", "temperature": 30, "humidity": 86, "windSpeed": 45, "windDirection": "NW", "rainfall": 18, "pressure": 1002, "seaState": "Moderate", "waveHeight": 2.1, "visibility": 8},
    {"district": "Amreli", "temperature": 31, "humidity": 82, "windSpeed": 38, "windDirection": "W", "rainfall": 12, "pressure": 1005, "seaState": "Slight", "waveHeight": 1.4, "visibility": 12},
]

MOCK_INVENTORY = [
    {"id": "INV001", "category": "Food", "item": "Food Packets (Ready to eat)", "available": 48000, "required": 85000, "unit": "Packets", "location": "SDRF Warehouse, Gandhinagar"},
    {"id": "INV002", "category": "Water", "item": "Drinking Water Bottles (1L)", "available": 125000, "required": 200000, "unit": "Bottles", "location": "District HQ"},
    {"id": "INV003", "category": "Medical", "item": "First Aid Kits", "available": 2400, "required": 3500, "unit": "Kits", "location": "Medical Stores, Rajkot"},
    {"id": "INV004", "category": "Medical", "item": "ORS Sachets", "available": 85000, "required": 120000, "unit": "Sachets", "location": "District Health Dept."},
    {"id": "INV005", "category": "Shelter", "item": "Tarpaulin Sheets", "available": 8500, "required": 15000, "unit": "Sheets", "location": "Civil Supplies Depot"},
    {"id": "INV006", "category": "Rescue", "item": "Life Jackets", "available": 3200, "required": 5000, "unit": "Pieces", "location": "Coast Guard Station"},
    {"id": "INV007", "category": "Rescue", "item": "Inflatable Boats", "available": 145, "required": 220, "unit": "Units", "location": "NDRF Base"},
    {"id": "INV008", "category": "Power", "item": "Portable Generators", "available": 289, "required": 450, "unit": "Units", "location": "GEB Warehouse"},
]

MOCK_RESCUE_TEAMS = [
    {"id": "RT001", "name": "NDRF Battalion 6-A", "district": "Jamnagar", "members": 45, "vehicles": 8, "status": "DEPLOYED", "lat": 22.3, "lng": 70.1, "specialization": ["Water Rescue", "Medical", "Search & Rescue"]},
    {"id": "RT002", "name": "SDRF Gujarat Team Alpha", "district": "Kutch", "members": 32, "vehicles": 6, "status": "DEPLOYED", "lat": 23.2, "lng": 69.5, "specialization": ["Evacuation", "Relief Distribution", "Medical"]},
    {"id": "RT003", "name": "Coast Guard Unit Porbandar", "district": "Porbandar", "members": 28, "vehicles": 4, "status": "STANDBY", "lat": 21.64, "lng": 69.61, "specialization": ["Sea Rescue", "Boat Recovery", "Navigation"]},
    {"id": "RT004", "name": "NDRF Battalion 6-B", "district": "Devbhumi Dwarka", "members": 40, "vehicles": 7, "status": "DEPLOYED", "lat": 22.1, "lng": 69.0, "specialization": ["Water Rescue", "Urban Search", "Medical"]},
    {"id": "RT005", "name": "Fire & Emergency Bhavnagar", "district": "Bhavnagar", "members": 24, "vehicles": 5, "status": "STANDBY", "lat": 21.76, "lng": 72.15, "specialization": ["Fire Fighting", "Rescue", "First Aid"]},
]

MOCK_DAMAGE = [
    {"id": "DR001", "district": "Jamnagar", "reportDate": datetime.now().isoformat(), "housesDestroyed": 1240, "housesDamaged": 4560, "livesLost": 8, "injured": 127, "livestockLoss": 3400, "cropAreaAffected": 12400, "infrastructureDamage": 245, "totalEstimatedLoss": 890, "status": "PRELIMINARY", "verifiedBy": "District Collector"},
    {"id": "DR002", "district": "Devbhumi Dwarka", "reportDate": datetime.now().isoformat(), "housesDestroyed": 890, "housesDamaged": 2340, "livesLost": 5, "injured": 89, "livestockLoss": 1800, "cropAreaAffected": 7800, "infrastructureDamage": 178, "totalEstimatedLoss": 520, "status": "PRELIMINARY", "verifiedBy": "Taluka Officer"},
    {"id": "DR003", "district": "Kutch", "reportDate": datetime.now().isoformat(), "housesDestroyed": 560, "housesDamaged": 1890, "livesLost": 3, "injured": 45, "livestockLoss": 890, "cropAreaAffected": 5600, "infrastructureDamage": 98, "totalEstimatedLoss": 310, "status": "PRELIMINARY", "verifiedBy": "District Collectorate"},
]

MOCK_EVACUATION_ROUTES = [
    {"id": "ER001", "from": "Balachadi Beach Area", "to": "GMDC Cyclone Shelter", "distance": 28, "estimatedTime": 45, "roadCondition": "CLEAR", "trafficLevel": "HIGH", "waypoints": [{"lat": 22.48, "lng": 70.0}, {"lat": 22.5, "lng": 70.03}, {"lat": 22.47, "lng": 70.06}], "isRecommended": True},
    {"id": "ER002", "from": "Lakhota Lake Area", "to": "Rajkot Relief Camp", "distance": 42, "estimatedTime": 70, "roadCondition": "PARTIAL", "trafficLevel": "HIGH", "waypoints": [{"lat": 22.47, "lng": 70.0}, {"lat": 22.3, "lng": 70.5}, {"lat": 22.29, "lng": 70.78}], "isRecommended": False},
    {"id": "ER003", "from": "Okha Coastal Zone", "to": "Dwarka Panchayat Shelter", "distance": 15, "estimatedTime": 25, "roadCondition": "CLEAR", "trafficLevel": "MEDIUM", "waypoints": [{"lat": 22.46, "lng": 69.07}, {"lat": 22.35, "lng": 69.02}, {"lat": 22.24, "lng": 68.97}], "isRecommended": True},
]

CYCLONE_FREQUENCY_DATA = [
    {"year": "2018", "cyclones": 2}, {"year": "2019", "cyclones": 1},
    {"year": "2020", "cyclones": 3}, {"year": "2021", "cyclones": 2},
    {"year": "2022", "cyclones": 4}, {"year": "2023", "cyclones": 2}, {"year": "2024", "cyclones": 3},
]

WIND_SPEED_TREND = [
    {"time": "00:00", "speed": 120}, {"time": "03:00", "speed": 135},
    {"time": "06:00", "speed": 148}, {"time": "09:00", "speed": 162},
    {"time": "12:00", "speed": 175}, {"time": "15:00", "speed": 183},
    {"time": "18:00", "speed": 185}, {"time": "21:00", "speed": 180},
]

RAINFALL_DATA = [
    {"district": "Jamnagar", "rainfall": 380}, {"district": "Dwarka", "rainfall": 420},
    {"district": "Kutch", "rainfall": 290}, {"district": "Porbandar", "rainfall": 310},
    {"district": "Gir Somnath", "rainfall": 220}, {"district": "Amreli", "rainfall": 180},
    {"district": "Bhavnagar", "rainfall": 150}, {"district": "Surat", "rainfall": 95},
]

EVACUATION_PROGRESS = [
    {"district": "Jamnagar", "target": 78000, "actual": 58000},
    {"district": "Dwarka", "target": 32000, "actual": 25000},
    {"district": "Kutch", "target": 55000, "actual": 45000},
    {"district": "Porbandar", "target": 28000, "actual": 21000},
    {"district": "Gir Somnath", "target": 20000, "actual": 15000},
]
