-- ============================================================
-- CycloneShield AI — PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(200) NOT NULL,
    role VARCHAR(50) DEFAULT 'CITIZEN',
    district VARCHAR(50),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Districts
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    population INTEGER,
    coastline_km FLOAT,
    risk_level VARCHAR(20) DEFAULT 'SAFE',
    risk_score INTEGER DEFAULT 0,
    evacuated INTEGER DEFAULT 0,
    boats_at_sea INTEGER DEFAULT 0,
    shelters_total INTEGER DEFAULT 0,
    shelters_active INTEGER DEFAULT 0,
    shelter_capacity INTEGER DEFAULT 0,
    shelter_occupancy INTEGER DEFAULT 0,
    hospitals_count INTEGER DEFAULT 0,
    rescue_teams INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cyclones
CREATE TABLE IF NOT EXISTS cyclones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    category INTEGER CHECK (category BETWEEN 1 AND 5),
    wind_speed FLOAT,
    pressure FLOAT,
    lat FLOAT,
    lng FLOAT,
    trajectory JSONB,
    predicted_landfall VARCHAR(100),
    landfall_time TIMESTAMPTZ,
    intensity VARCHAR(100),
    storm_surge FLOAT,
    rainfall_estimate FLOAT,
    confidence INTEGER CHECK (confidence BETWEEN 0 AND 100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weather Observations
CREATE TABLE IF NOT EXISTS weather_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id VARCHAR(50) REFERENCES districts(id),
    temperature FLOAT,
    humidity FLOAT,
    wind_speed FLOAT,
    wind_direction VARCHAR(10),
    rainfall FLOAT,
    pressure FLOAT,
    sea_state VARCHAR(50),
    wave_height FLOAT,
    visibility FLOAT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_weather_district_time ON weather_observations(district_id, timestamp DESC);

-- Fishermen / Boats
CREATE TABLE IF NOT EXISTS fishermen (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    boat_id VARCHAR(30) UNIQUE,
    district_id VARCHAR(50) REFERENCES districts(id),
    lat FLOAT,
    lng FLOAT,
    status VARCHAR(20) DEFAULT 'IN_HARBOR',
    crew_count INTEGER DEFAULT 1,
    nearest_harbor VARCHAR(100),
    distance_to_harbor FLOAT,
    estimated_return VARCHAR(50),
    last_ping TIMESTAMPTZ,
    risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_fishermen_status ON fishermen(status);
CREATE INDEX idx_fishermen_risk ON fishermen(risk_score DESC);

-- Shelters
CREATE TABLE IF NOT EXISTS shelters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id),
    lat FLOAT,
    lng FLOAT,
    capacity INTEGER DEFAULT 0,
    occupied INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    facilities JSONB,
    contact_phone VARCHAR(20),
    in_charge VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50),
    level VARCHAR(20),
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id),
    affected_population INTEGER DEFAULT 0,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    source VARCHAR(100)
);
CREATE INDEX idx_alerts_active ON alerts(is_active, level);

-- Rescue Teams
CREATE TABLE IF NOT EXISTS rescue_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    district_id VARCHAR(50) REFERENCES districts(id),
    members INTEGER,
    vehicles INTEGER,
    status VARCHAR(30) DEFAULT 'STANDBY',
    lat FLOAT,
    lng FLOAT,
    specialization JSONB,
    last_deployed TIMESTAMPTZ
);

-- Relief Inventory
CREATE TABLE IF NOT EXISTS relief_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50),
    item VARCHAR(200),
    available INTEGER DEFAULT 0,
    required INTEGER DEFAULT 0,
    unit VARCHAR(30),
    location VARCHAR(200),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Damage Reports
CREATE TABLE IF NOT EXISTS damage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id VARCHAR(50) REFERENCES districts(id),
    report_date TIMESTAMPTZ DEFAULT NOW(),
    houses_destroyed INTEGER DEFAULT 0,
    houses_damaged INTEGER DEFAULT 0,
    lives_lost INTEGER DEFAULT 0,
    injured INTEGER DEFAULT 0,
    livestock_loss INTEGER DEFAULT 0,
    crop_area_affected FLOAT DEFAULT 0,
    infrastructure_damage FLOAT DEFAULT 0,
    total_estimated_loss FLOAT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'PRELIMINARY',
    verified_by VARCHAR(100),
    ai_analysis TEXT
);

-- Satellite Images
CREATE TABLE IF NOT EXISTS satellite_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    area VARCHAR(200),
    capture_date TIMESTAMPTZ,
    image_url VARCHAR(500),
    analysis_status VARCHAR(30) DEFAULT 'PENDING',
    damage_level VARCHAR(30),
    ai_analysis TEXT,
    confidence INTEGER,
    structures_analyzed INTEGER DEFAULT 0,
    structures_damaged INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Reports
CREATE TABLE IF NOT EXISTS ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cyclone_id UUID REFERENCES cyclones(id),
    report_type VARCHAR(50),
    summary TEXT,
    details JSONB,
    confidence INTEGER,
    model_used VARCHAR(100),
    language VARCHAR(5) DEFAULT 'en',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100),
    user_id UUID REFERENCES users(id),
    role VARCHAR(20),
    content TEXT NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    agent_type VARCHAR(50),
    confidence INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_chat_session ON chat_messages(session_id, created_at);

-- Evacuation Routes
CREATE TABLE IF NOT EXISTS evacuation_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_location VARCHAR(200),
    to_shelter_id UUID REFERENCES shelters(id),
    distance_km FLOAT,
    estimated_time_min INTEGER,
    road_condition VARCHAR(20) DEFAULT 'CLEAR',
    traffic_level VARCHAR(20) DEFAULT 'LOW',
    waypoints JSONB,
    is_recommended BOOLEAN DEFAULT FALSE,
    ai_reasoning TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100),
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_districts_updated_at
    BEFORE UPDATE ON districts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
