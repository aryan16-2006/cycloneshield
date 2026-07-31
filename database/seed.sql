-- ============================================================
-- CycloneShield AI — Sample Seed Data
-- ============================================================

-- Seed Districts
INSERT INTO districts (id, name, lat, lng, population, coastline_km, risk_level, risk_score, evacuated, boats_at_sea, shelters_total, shelters_active, shelter_capacity, shelter_occupancy, hospitals_count, rescue_teams) VALUES
('kutch',       'Kutch',            23.7,  69.8,  2090000, 407, 'HIGH',     78, 45000, 234, 89,  67, 45000, 32000, 12, 8),
('jamnagar',    'Jamnagar',         22.47, 70.06, 2160000, 320, 'CRITICAL', 94, 78000, 412, 112, 98, 62000, 58000, 18, 12),
('dwarka',      'Devbhumi Dwarka',  22.24, 68.97, 760000,  243, 'CRITICAL', 91, 32000, 178, 45,  41, 28000, 25000, 6,  5),
('porbandar',   'Porbandar',        21.64, 69.61, 590000,  185, 'HIGH',     82, 21000, 291, 38,  34, 22000, 17000, 7,  4),
('junagadh',    'Junagadh',         21.52, 70.46, 2450000, 98,  'MEDIUM',   61, 8500,  89,  56,  28, 35000, 12000, 22, 6),
('gir_somnath', 'Gir Somnath',      20.97, 70.38, 1250000, 155, 'HIGH',     76, 15000, 145, 42,  38, 26000, 18000, 9,  4),
('amreli',      'Amreli',           21.6,  71.22, 1510000, 122, 'MEDIUM',   54, 5200,  67,  34,  18, 20000, 8000,  11, 3),
('bhavnagar',   'Bhavnagar',        21.76, 72.15, 2880000, 202, 'MEDIUM',   59, 12000, 198, 72,  45, 48000, 22000, 28, 7),
('surat',       'Surat',            21.17, 72.83, 6060000, 89,  'LOW',      38, 3200,  45,  145, 30, 95000, 14000, 65, 10),
('valsad',      'Valsad',           20.61, 72.93, 1700000, 78,  'LOW',      32, 1800,  23,  48,  14, 30000, 5500,  14, 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Cyclone
INSERT INTO cyclones (name, category, wind_speed, pressure, lat, lng, predicted_landfall, intensity, storm_surge, rainfall_estimate, confidence, is_active) VALUES
('Cyclone Biparjoy-II', 4, 185, 942, 19.2, 67.8, 'Jamnagar', 'Very Severe Cyclonic Storm', 4.5, 380, 87, true);

-- Seed Shelters
INSERT INTO shelters (name, district_id, lat, lng, capacity, occupied, status, facilities, contact_phone, in_charge) VALUES
('GMDC Cyclone Shelter',    'jamnagar',    22.47, 70.06, 5000, 4800, 'PARTIAL',   '["Food","Water","Medical","Electricity","Sanitation"]', '0288-2670000', 'Collector Jamnagar'),
('Kutch District Shelter A','kutch',       23.0,  69.7,  3000, 1800, 'AVAILABLE', '["Food","Water","Medical","Electricity"]',               '02832-254000', 'Dy. Collector Bhuj'),
('Porbandar Central Shelter','porbandar',  21.64, 69.61, 2500, 2450, 'FULL',      '["Food","Water","Medical"]',                             '0286-2220000', 'Municipal Commissioner'),
('Dwarka Panchayat Shelter','dwarka',     22.24, 68.97, 2000, 1950, 'FULL',      '["Food","Water","Medical","Electricity"]',               '02892-234000', 'Taluka Dev. Officer'),
('Somnath Coastal Shelter', 'gir_somnath',20.97, 70.38, 3500, 1200, 'AVAILABLE', '["Food","Water","Medical","Sanitation"]',                '0287-2231000', 'Dist. Panchayat CEO'),
('Bhavnagar District Shelter','bhavnagar',21.76, 72.15, 4000, 2100, 'AVAILABLE', '["Food","Water","Medical","Electricity","Sanitation"]',  '0278-2432000', 'Collector Bhavnagar');

-- Seed Relief Inventory
INSERT INTO relief_inventory (category, item, available, required, unit, location) VALUES
('Food',    'Food Packets (Ready to eat)',    48000,  85000,  'Packets', 'SDRF Warehouse, Gandhinagar'),
('Water',   'Drinking Water Bottles (1L)',    125000, 200000, 'Bottles', 'District HQ'),
('Medical', 'First Aid Kits',                2400,   3500,   'Kits',    'Medical Stores, Rajkot'),
('Medical', 'ORS Sachets',                   85000,  120000, 'Sachets', 'District Health Dept.'),
('Shelter', 'Tarpaulin Sheets',              8500,   15000,  'Sheets',  'Civil Supplies Depot'),
('Rescue',  'Life Jackets',                  3200,   5000,   'Pieces',  'Coast Guard Station'),
('Rescue',  'Inflatable Boats',              145,    220,    'Units',   'NDRF Base'),
('Power',   'Portable Generators',           289,    450,    'Units',   'GEB Warehouse');

-- Seed Admin User (password: admin123 - bcrypt hashed)
INSERT INTO users (name, email, hashed_password, role, district) VALUES
('Admin Officer', 'admin@sdma.gujarat.gov.in', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', 'Gujarat SDMA');

-- Seed Rescue Teams
INSERT INTO rescue_teams (name, district_id, members, vehicles, status, lat, lng, specialization) VALUES
('NDRF Battalion 6-A',       'jamnagar',   45, 8, 'DEPLOYED',  22.3,  70.1,  '["Water Rescue","Medical","Search & Rescue"]'),
('SDRF Gujarat Team Alpha',  'kutch',      32, 6, 'DEPLOYED',  23.2,  69.5,  '["Evacuation","Relief Distribution","Medical"]'),
('Coast Guard Unit Porbandar','porbandar', 28, 4, 'STANDBY',   21.64, 69.61, '["Sea Rescue","Boat Recovery","Navigation"]'),
('NDRF Battalion 6-B',       'dwarka',    40, 7, 'DEPLOYED',  22.1,  69.0,  '["Water Rescue","Urban Search","Medical"]'),
('Fire & Emergency Bhavnagar','bhavnagar', 24, 5, 'STANDBY',   21.76, 72.15, '["Fire Fighting","Rescue","First Aid"]');
