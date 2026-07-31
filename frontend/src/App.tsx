import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import LiveCycloneTracker from './pages/LiveCycloneTracker'
import FishermenAlerts from './pages/FishermenAlerts'
import AIPrediction from './pages/AIPrediction'
import EvacuationPlanner from './pages/EvacuationPlanner'
import ReliefCoordination from './pages/ReliefCoordination'
import DamageAssessment from './pages/DamageAssessment'
import Analytics from './pages/Analytics'
import AgentConsole from './pages/AgentConsole'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="cyclone-tracker" element={<LiveCycloneTracker />} />
        <Route path="fishermen" element={<FishermenAlerts />} />
        <Route path="ai-prediction" element={<AIPrediction />} />
        <Route path="evacuation" element={<EvacuationPlanner />} />
        <Route path="relief" element={<ReliefCoordination />} />
        <Route path="damage" element={<DamageAssessment />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="agents" element={<AgentConsole />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
