import React, { useState, useRef, useEffect } from 'react'

const API_URL = 'http://localhost:8001'

const SAMPLE_QUESTIONS = [
  'What is the current cyclone status?',
  'Which fishermen are in danger right now?',
  'What is the safest evacuation route from Veraval?',
  'How many shelters are available in Jamnagar?',
  'Give me a risk summary for all coastal districts',
  'ઓખા વિસ્તારમાં ચક્રવાત ક્યારે આવશે?',
  'जामनगर में कितने लोग निकाले गए हैं?',
]

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: '🌀 Hello! I am **CycloneShield AI**, powered by **IBM Granite 3.1 8B Instruct** via watsonx.ai.\n\nI can help you with:\n• 🌀 Cyclone tracking & forecasts\n• 🚣 Fishermen safety & GPS tracking\n• 🏃 Evacuation routes & shelter info\n• 📦 Relief coordination\n• 🛰️ Damage assessment\n\nAsk me anything in **English**, **हिंदी** or **ગુજરાતી**!',
      timestamp: new Date().toLocaleTimeString(),
      model: 'ibm/granite-3-8b-instruct',
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [status, setStatus] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    fetch(`${API_URL}/api/status`)
      .then(r => r.json())
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', content: msg, timestamp: new Date().toLocaleTimeString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, language, session_id: 'main' }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: data.response || data.detail || 'Sorry, I could not get a response.',
        timestamp: new Date().toLocaleTimeString(),
        model: data.model,
        confidence: data.confidence,
      }])
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: '❌ Could not connect to the IBM Granite backend. Make sure `agent.py` is running.',
        timestamp: new Date().toLocaleTimeString(),
      }])
    }
    setLoading(false)
  }

  const formatContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>')
      .replace(/•/g, '&bull;')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#020817', color: '#e2e8f0', fontFamily: '-apple-system, "Segoe UI", sans-serif', fontSize: 14 }}>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{ width: 280, background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌀</div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>CycloneShield AI</div>
                <div style={{ fontSize: 11, color: '#06b6d4' }}>● IBM Granite Active</div>
              </div>
            </div>
            {status && (
              <div style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 8, padding: '8px 10px', fontSize: 11 }}>
                <div style={{ color: '#94a3b8' }}>Model</div>
                <div style={{ color: '#06b6d4', fontWeight: 600 }}>{status.model}</div>
                <div style={{ color: '#94a3b8', marginTop: 4 }}>Project ID</div>
                <div style={{ color: '#cbd5e1', fontSize: 10, wordBreak: 'break-all' }}>{status.project_id}</div>
              </div>
            )}
          </div>

          {/* Language */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Language</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['en','🇬🇧 EN'],['hi','🇮🇳 HI'],['gu','🟠 GU']].map(([code, label]) => (
                <button key={code} onClick={() => setLanguage(code)}
                  style={{ flex: 1, padding: '5px 0', borderRadius: 8, border: language === code ? '1px solid #06b6d4' : '1px solid rgba(255,255,255,0.1)', background: language === code ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)', color: language === code ? '#06b6d4' : '#94a3b8', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Questions */}
          <div style={{ padding: '12px 16px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>Quick Questions</div>
            {SAMPLE_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                style={{ width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 6, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', color: '#94a3b8', cursor: 'pointer', fontSize: 12, lineHeight: 1.4, transition: 'all 0.15s' }}
                onMouseOver={e => { e.target.style.background = 'rgba(6,182,212,0.08)'; e.target.style.color = '#e2e8f0'; e.target.style.borderColor = 'rgba(6,182,212,0.2)' }}
                onMouseOut={e => { e.target.style.background = 'rgba(255,255,255,0.02)'; e.target.style.color = '#94a3b8'; e.target.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                {q}
              </button>
            ))}
          </div>

          {/* Live Stats */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Live Status</div>
            {[
              { label: 'Active Cyclone', value: 'Biparjoy-II Cat.4', color: '#ef4444' },
              { label: 'Evacuated', value: '2,22,700', color: '#06b6d4' },
              { label: 'Boats at Sea', value: '1,482', color: '#3b82f6' },
              { label: 'Active Alerts', value: '6', color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: '#64748b', fontSize: 11 }}>{label}</span>
                <span style={{ color, fontWeight: 700, fontSize: 11 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ height: 54, background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(v => !v)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 18, padding: 4 }}>☰</button>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>CycloneShield AI</span>
            <span style={{ color: '#64748b', margin: '0 8px' }}>·</span>
            <span style={{ color: '#06b6d4', fontSize: 12 }}>IBM Granite 3.1 8B Instruct</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '4px 10px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#ef4444', fontSize: 11, fontWeight: 700 }}>CYCLONE ALERT</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 10 }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🌀</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                border: msg.role === 'user' ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{ fontSize: 11, color: '#06b6d4', fontWeight: 600, marginBottom: 6 }}>
                    Granite AI {msg.confidence ? `· ${msg.confidence}% confidence` : ''}
                  </div>
                )}
                <div style={{ lineHeight: 1.6, color: '#e2e8f0' }} dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                <div style={{ fontSize: 10, color: '#475569', marginTop: 6, textAlign: 'right' }}>{msg.timestamp}</div>
              </div>
              {msg.role === 'user' && (
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#06b6d4,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌀</div>
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span style={{ color: '#06b6d4', fontSize: 11, fontWeight: 600 }}>IBM Granite is thinking</span>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: `bounce 1s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 20px', background: 'rgba(15,23,42,0.8)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={language === 'en' ? 'Ask IBM Granite about cyclones, evacuation, fishermen...' : language === 'hi' ? 'IBM Granite से पूछें...' : 'IBM Granite ને પૂછો...'}
              rows={2}
              style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#e2e8f0', fontSize: 14, resize: 'none', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              style={{ padding: '10px 20px', borderRadius: 12, background: loading ? 'rgba(6,182,212,0.3)' : 'linear-gradient(135deg,#06b6d4,#3b82f6)', border: 'none', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', height: 44 }}>
              {loading ? '...' : 'Send ↑'}
            </button>
          </div>
          <div style={{ textAlign: 'center', marginTop: 8, color: '#334155', fontSize: 11 }}>
            Powered by IBM Granite 3.1 8B · watsonx.ai · Project: 039c6c15
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        ::-webkit-scrollbar { width: 5px }
        ::-webkit-scrollbar-track { background: transparent }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px }
        textarea:focus { border-color: rgba(6,182,212,0.5) !important; box-shadow: 0 0 0 2px rgba(6,182,212,0.1) }
      `}</style>
    </div>
  )
}

export default App
