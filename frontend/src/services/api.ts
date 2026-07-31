// ============================================================
// CycloneShield AI — Real REST API Client Service Layer
// Connects Frontend to FastAPI Backend (8000) & Granite Agent (8001)
// ============================================================

const API_BASE_URL = 'http://localhost:8000/api/v1'
const AGENT_BASE_URL = 'http://localhost:8001/api'

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export const apiService = {
  // Weather
  getWeather: () => fetchJson<{ weather: any[]; count: number }>(`${API_BASE_URL}/weather`),
  getDistrictWeather: (district: string) => fetchJson<any>(`${API_BASE_URL}/weather/${district}`),

  // Cyclones & AI Prediction
  getCyclones: () => fetchJson<{ cyclones: any[]; count: number }>(`${API_BASE_URL}/cyclone`),
  getCycloneById: (id: string) => fetchJson<any>(`${API_BASE_URL}/cyclone/${id}`),
  predictCyclone: (cycloneId = 'CYC-2024-001', runFullPipeline = true) =>
    fetchJson<any>(`${API_BASE_URL}/predict-cyclone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cyclone_id: cycloneId, run_full_pipeline: runFullPipeline }),
    }),

  // Fishermen Fleet GPS Tracking
  getFishermen: () => fetchJson<{ fishermen: any[]; total: number; emergency_count: number }>(`${API_BASE_URL}/fishermen`),

  // Alerts
  getAlerts: () => fetchJson<{ alerts: any[]; critical_count: number }>(`${API_BASE_URL}/alerts`),

  // Evacuation & Shelters
  getEvacuationRoutes: () => fetchJson<{ routes: any[] }>(`${API_BASE_URL}/evacuate`),
  getShelters: () => fetchJson<{ shelters: any[]; total_capacity: number; total_occupied: number }>(`${API_BASE_URL}/shelters`),

  // Relief & Rescue Teams
  getReliefInventory: () => fetchJson<{ inventory: any[]; rescue_teams: any[] }>(`${API_BASE_URL}/relief`),

  // Damage Assessment
  getDamageAssessment: () => fetchJson<{ damage_reports: any[] }>(`${API_BASE_URL}/damage`),

  // Analytics
  getAnalytics: () => fetchJson<{ analytics: any }>(`${API_BASE_URL}/analytics`),

  // AI Agent Console & Status
  getAgents: () => fetchJson<{ agents: any[] }>(`${API_BASE_URL}/agents`),
  getAgentStatus: () => fetchJson<any>(`${AGENT_BASE_URL}/status`),
  getChatHistory: () => fetchJson<{ history: any[]; total: number }>(`${AGENT_BASE_URL}/history`),

  // Disaster Reports
  getReports: () => fetchJson<{ reports: any[] }>(`${API_BASE_URL}/reports`),

  // IBM Watsonx AI Chat Assistant
  postChat: (message: string, language = 'en') =>
    fetchJson<{ response: string; model: string; confidence: number; language: string; timestamp: string }>(
      `${AGENT_BASE_URL}/chat`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language }),
      }
    ),
}
