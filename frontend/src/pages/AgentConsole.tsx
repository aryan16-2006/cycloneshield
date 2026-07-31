import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from '@/utils/motion'
import {
  Bot, BrainCircuit, Send, RefreshCw, Activity, CheckCircle,
  AlertCircle, Loader, ChevronRight, Zap, Globe, MessageSquare,
} from 'lucide-react'
import { MOCK_AGENTS } from '../utils/mockData'
import type { AIAgent, AgentMessage } from '../types'

const agentColors: Record<string, string> = {
  CYCLONE_PREDICTION: 'border-red-500/30 bg-red-500/10',
  FISHERMEN_SAFETY: 'border-blue-500/30 bg-blue-500/10',
  EVACUATION: 'border-cyan-500/30 bg-cyan-500/10',
  RELIEF: 'border-emerald-500/30 bg-emerald-500/10',
  DAMAGE: 'border-purple-500/30 bg-purple-500/10',
  ASSISTANT: 'border-amber-500/30 bg-amber-500/10',
}

const agentIconColors: Record<string, string> = {
  CYCLONE_PREDICTION: 'text-red-400',
  FISHERMEN_SAFETY: 'text-blue-400',
  EVACUATION: 'text-cyan-400',
  RELIEF: 'text-emerald-400',
  DAMAGE: 'text-purple-400',
  ASSISTANT: 'text-amber-400',
}

const predefinedQueries = [
  { q: 'What is the safest evacuation route from Veraval?', lang: 'en' },
  { q: 'How many shelters are currently full?', lang: 'en' },
  { q: 'Which fishermen are still at sea with risk > 80%?', lang: 'en' },
  { q: 'ઓખા દ્રારા કઈ સ્થળ ખાલી કરવી?', lang: 'gu' },
  { q: 'जामनगर में बाढ़ का खतरा कितना है?', lang: 'hi' },
  { q: 'Generate a relief inventory summary for Jamnagar', lang: 'en' },
]

const mockResponses: Record<string, string> = {
  'route': "Based on current road conditions and cyclone trajectory analysis, the safest evacuation route from Veraval is:\n\n🛣️ **Route: Veraval → Talala → Dhari → Amreli**\n- Distance: 142 km | Est. time: 2h 45min\n- Road condition: CLEAR ✅\n- Traffic: Moderate\n\nAlternate: Veraval → Una → Rajula → Bhavnagar (181 km, avoid SH-24 near Una due to waterlogging)",
  'shelter': "Current shelter status across Gujarat coastal districts:\n\n🔴 **FULL (2):** Porbandar Central Shelter (2450/2500), Dwarka Panchayat Shelter (1950/2000)\n🟡 **PARTIAL (3):** GMDC Jamnagar (4800/5000), Somnath Coastal (1200/3500), Bhavnagar (2100/4000)\n🟢 **AVAILABLE (451):** Across remaining 8 districts\n\nTotal capacity: 3,82,000 | Occupied: 88,250 (23.1%)",
  'fishermen': "High-risk fishermen currently at sea (Risk Score > 80%):\n\n🚨 **EMERGENCY (1):**\n• Suresh Vadher | GJ-DWK-0456 | Risk: 98% | 12 crew | 62km from Okha\n\n⚠️ **CRITICAL (3):**\n• Ramesh Makwana | GJ-JAM-1234 | 91% | 45km from Nawabander\n• Naresh Rathod | GJ-KUT-2201 | 85% | 38km from Mandvi\n• Jayesh Patel | GJ-JAM-3345 | 88% | 55km from Bedi Port\n\n🆘 **MISSING (1):**\n• Kiran Mer | GJ-BHV-1123 | Last ping: 2 hours ago",
  'default': "I'm the IBM Granite AI Assistant for CycloneShield. I can help you with:\n\n• 🌀 Cyclone track & intensity forecasts\n• 🚣 Fishermen safety status\n• 🏃 Evacuation route planning\n• 🏥 Shelter availability\n• 📦 Relief inventory status\n• 🗺️ District risk analysis\n\nAsk me anything about the current disaster situation in Gujarat.",
}

function getResponse(query: string): string {
  const q = query.toLowerCase()
  if (q.includes('route') || q.includes('veraval') || q.includes('evacuation')) return mockResponses.route
  if (q.includes('shelter') || q.includes('full')) return mockResponses.shelter
  if (q.includes('fishermen') || q.includes('sea') || q.includes('risk')) return mockResponses.fishermen
  return mockResponses.default
}

import { useQuery } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

export default function AgentConsole() {
  const { language } = useThemeLanguage()
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(MOCK_AGENTS[5])
  const [messages, setMessages] = useState<AgentMessage[]>([
    { id: '1', agentId: 'AGT006', role: 'agent', content: mockResponses.default, timestamp: new Date().toISOString(), language: 'en', confidence: 95 },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'gu'>(language as any || 'en')
  const endRef = useRef<HTMLDivElement>(null)

  const { data: agentData } = useQuery({
    queryKey: ['agents'],
    queryFn: apiService.getAgents,
  })

  const liveAgents = agentData?.agents || MOCK_AGENTS

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    const userMsg: AgentMessage = { id: Date.now().toString(), agentId: selectedAgent.id, role: 'user', content: msg, timestamp: new Date().toISOString(), language: selectedLang }
    setMessages(prev => [...prev, userMsg])
    setThinking(true)
    
    try {
      const res = await apiService.postChat(msg, selectedLang)
      const agentMsg: AgentMessage = {
        id: (Date.now() + 1).toString(),
        agentId: selectedAgent.id,
        role: 'agent',
        content: res.response,
        timestamp: res.timestamp || new Date().toISOString(),
        language: selectedLang,
        confidence: res.confidence || 92
      }
      setMessages(prev => [...prev, agentMsg])
    } catch (err) {
      const fallbackMsg: AgentMessage = {
        id: (Date.now() + 1).toString(),
        agentId: selectedAgent.id,
        role: 'agent',
        content: getResponse(msg),
        timestamp: new Date().toISOString(),
        language: selectedLang,
        confidence: 88
      }
      setMessages(prev => [...prev, fallbackMsg])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Console</h1>
          <p className="text-sm text-slate-400 mt-0.5">IBM Granite AI · LangGraph · Multi-agent orchestration</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-emerald-400">5/6 Agents Active</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Agent List */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">AI Agents</p>
          {MOCK_AGENTS.map((agent, i) => (
            <motion.button
              key={agent.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${selectedAgent.id === agent.id ? `${agentColors[agent.type]} border-opacity-60` : 'bg-slate-800/40 border-white/10 hover:border-white/20'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${agentColors[agent.type]}`}>
                  <BrainCircuit className={`w-4 h-4 ${agentIconColors[agent.type]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white leading-tight">{agent.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{agent.model.split('+')[0].trim()}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${agent.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : agent.status === 'PROCESSING' ? 'bg-cyan-400 animate-ping' : agent.status === 'IDLE' ? 'bg-slate-500' : 'bg-red-400'}`} />
                    <span className="text-xs text-slate-400 capitalize">{agent.status.toLowerCase()}</span>
                    <span className="ml-auto text-xs text-cyan-400">{agent.confidence}%</span>
                  </div>
                </div>
              </div>
              {agent.currentTask && (
                <p className="text-xs text-slate-500 mt-2 leading-tight line-clamp-2 pl-11">{agent.currentTask}</p>
              )}
            </motion.button>
          ))}
        </div>

        {/* Chat Interface */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="xl:col-span-3 glass-card flex flex-col" style={{ height: 620 }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${agentColors[selectedAgent.type]}`}>
                <BrainCircuit className={`w-5 h-5 ${agentIconColors[selectedAgent.type]}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{selectedAgent.name}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedAgent.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  <p className="text-xs text-slate-400">{selectedAgent.model} · {selectedAgent.tasksCompleted.toLocaleString()} tasks</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              {(['en', 'hi', 'gu'] as const).map(lang => (
                <button key={lang} onClick={() => setSelectedLang(lang)}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${selectedLang === lang ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 bg-slate-800'}`}>
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'HI' : 'GU'}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role !== 'user' && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 mt-1 ${agentColors[selectedAgent.type]}`}>
                      <Bot className={`w-4 h-4 ${agentIconColors[selectedAgent.type]}`} />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-cyan-600/20 border border-cyan-500/30 text-white rounded-tr-sm' : 'bg-slate-800/80 border border-white/10 text-slate-200 rounded-tl-sm'}`}>
                    <div className="whitespace-pre-line">{msg.content}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                      {msg.confidence && <span className="text-xs text-cyan-500">{msg.confidence}% conf.</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {thinking && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${agentColors[selectedAgent.type]}`}>
                  <Loader className={`w-4 h-4 ${agentIconColors[selectedAgent.type]} animate-spin`} />
                </div>
                <div className="bg-slate-800/80 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick Queries */}
          <div className="px-5 py-3 border-t border-white/5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {predefinedQueries.map(({ q, lang }) => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="flex-shrink-0 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 rounded-xl transition-colors flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-cyan-400" />
                  {q.length > 40 ? q.slice(0, 40) + '…' : q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={selectedLang === 'en' ? 'Ask anything about the disaster situation…' : selectedLang === 'hi' ? 'आपदा के बारे में कुछ भी पूछें…' : 'આફત વિશે કંઈ પૂછો…'}
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || thinking}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
