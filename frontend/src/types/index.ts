// ============================================================
// CycloneShield AI — Core Type Definitions
// ============================================================

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE'
export type AlertType = 'CYCLONE' | 'FLOOD' | 'STORM_SURGE' | 'RAIN' | 'WIND' | 'EVACUATION'
export type CycloneCategory = 1 | 2 | 3 | 4 | 5
export type BoatStatus = 'AT_SEA' | 'RETURNING' | 'IN_HARBOR' | 'MISSING' | 'EMERGENCY'
export type ShelterStatus = 'AVAILABLE' | 'PARTIAL' | 'FULL' | 'DAMAGED'
export type TeamStatus = 'DEPLOYED' | 'STANDBY' | 'RETURNING' | 'UNAVAILABLE'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Cyclone {
  id: string
  name: string
  category: CycloneCategory
  windSpeed: number        // km/h
  pressure: number         // hPa
  position: Coordinates
  trajectory: Coordinates[]
  predictedLandfall: string  // district name
  landfallTime: string       // ISO date
  intensity: string
  stormSurge: number         // meters
  rainfallEstimate: number   // mm
  confidence: number         // 0-100
  lastUpdated: string
  isActive: boolean
}

export interface District {
  id: string
  name: string
  coordinates: Coordinates
  population: number
  coastlineKm: number
  riskLevel: RiskLevel
  riskScore: number
  evacuated: number
  boatsAtSea: number
  sheltersTotal: number
  sheltersActive: number
  shelterCapacity: number
  shelterOccupancy: number
  hospitalsCount: number
  rescueTeams: number
}

export interface Fisherman {
  id: string
  name: string
  phone: string
  boatId: string
  district: string
  position: Coordinates
  status: BoatStatus
  crewCount: number
  nearestHarbor: string
  distanceToHarbor: number  // km
  estimatedReturn: string
  lastPing: string
  riskScore: number
}

export interface Shelter {
  id: string
  name: string
  district: string
  position: Coordinates
  capacity: number
  occupied: number
  status: ShelterStatus
  facilities: string[]
  contactPhone: string
  inCharge: string
}

export interface Alert {
  id: string
  type: AlertType
  level: RiskLevel
  title: string
  message: string
  district: string
  affectedPopulation: number
  issuedAt: string
  expiresAt: string
  isActive: boolean
  source: string
}

export interface RescueTeam {
  id: string
  name: string
  district: string
  members: number
  vehicles: number
  status: TeamStatus
  position: Coordinates
  specialization: string[]
  lastDeployed: string
}

export interface WeatherData {
  district: string
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: string
  rainfall: number
  pressure: number
  seaState: string
  waveHeight: number
  visibility: number
  timestamp: string
}

export interface EvacuationRoute {
  id: string
  from: string
  to: string  // Shelter name
  distance: number
  estimatedTime: number  // minutes
  roadCondition: 'CLEAR' | 'PARTIAL' | 'BLOCKED'
  trafficLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  waypoints: Coordinates[]
  isRecommended: boolean
}

export interface ReliefInventory {
  id: string
  category: string
  item: string
  available: number
  required: number
  unit: string
  location: string
  lastUpdated: string
}

export interface DamageReport {
  id: string
  district: string
  reportDate: string
  housesDestroyed: number
  housesDamaged: number
  livesLost: number
  injured: number
  livestockLoss: number
  cropAreaAffected: number  // hectares
  infrastructureDamage: number  // INR crores
  totalEstimatedLoss: number
  status: 'PRELIMINARY' | 'UPDATED' | 'FINAL'
  verifiedBy: string
}

export interface AIAgent {
  id: string
  name: string
  type: 'CYCLONE_PREDICTION' | 'FISHERMEN_SAFETY' | 'EVACUATION' | 'RELIEF' | 'DAMAGE' | 'ASSISTANT'
  status: 'ACTIVE' | 'PROCESSING' | 'IDLE' | 'ERROR'
  lastRun: string
  confidence: number
  model: string
  tasksCompleted: number
  currentTask?: string
}

export interface AgentMessage {
  id: string
  agentId: string
  role: 'agent' | 'user' | 'system'
  content: string
  timestamp: string
  language: 'en' | 'hi' | 'gu'
  confidence?: number
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'DISTRICT_OFFICER' | 'DISASTER_RESPONSE' | 'VOLUNTEER' | 'CITIZEN' | 'FISHERMAN'
  district: string
  avatar?: string
}

export interface DashboardStats {
  activeCyclones: number
  riskLevel: RiskLevel
  activeAlerts: number
  peopleEvacuated: number
  boatsAtSea: number
  sheltersAvailable: number
  rescueTeams: number
  totalDistricts: number
  criticalDistricts: number
  lastUpdated: string
}
