import { useState } from 'react'
import { motion } from '@/utils/motion'
import {
  Settings as SettingsIcon, Bell, Shield, Globe, Database,
  BrainCircuit, Smartphone, Mail, CheckCircle, Save, Sun, Moon,
} from 'lucide-react'
import { useThemeLanguage } from '../context/ThemeLanguageContext'

const sections = [
  {
    title: 'Notification Preferences', icon: Bell, color: 'text-amber-400',
    settings: [
      { label: 'SMS Alerts (Critical)', desc: 'Receive SMS for cyclone Category 3+', type: 'toggle', defaultVal: true },
      { label: 'Push Notifications', desc: 'Browser push notifications', type: 'toggle', defaultVal: true },
      { label: 'Email Digest', desc: 'Daily situation report via email', type: 'toggle', defaultVal: false },
      { label: 'WhatsApp Alerts (Mock)', desc: 'Forward alerts to WhatsApp', type: 'toggle', defaultVal: true },
    ],
  },
  {
    title: 'AI & Model Configuration', icon: BrainCircuit, color: 'text-purple-400',
    settings: [
      { label: 'IBM Granite Model', desc: 'Active LLM for summaries and chat', type: 'select', options: ['granite-8b-code-instruct', 'granite-34b-instruct', 'llama-3-3-70b-instruct'], defaultVal: 'granite-8b-code-instruct' },
      { label: 'Prediction Interval', desc: 'How often the AI re-runs forecasts', type: 'select', options: ['Every 15 min', 'Every 30 min', 'Every 1 hour'], defaultVal: 'Every 30 min' },
      { label: 'Enable RAG (Document Search)', desc: 'Use historical cyclone database for predictions', type: 'toggle', defaultVal: true },
      { label: 'Confidence Threshold Alert', desc: 'Alert when AI confidence drops below 70%', type: 'toggle', defaultVal: true },
    ],
  },
  {
    title: 'Security & Access', icon: Shield, color: 'text-cyan-400',
    settings: [
      { label: 'Two-Factor Authentication', desc: 'Require OTP for admin actions', type: 'toggle', defaultVal: true },
      { label: 'Session Timeout (minutes)', desc: 'Auto-logout after inactivity', type: 'number', defaultVal: '30' },
      { label: 'Audit Log Retention (days)', desc: 'How long to retain system logs', type: 'number', defaultVal: '90' },
      { label: 'IP Allowlist', desc: 'Restrict access to specified IPs', type: 'toggle', defaultVal: false },
    ],
  },
  {
    title: 'Data & Integrations', icon: Database, color: 'text-emerald-400',
    settings: [
      { label: 'Weather API Source', desc: 'Primary weather data provider', type: 'select', options: ['Open-Meteo Live API', 'IMD API', 'OpenWeather', 'Mixed'], defaultVal: 'Open-Meteo Live API' },
      { label: 'Auto-sync Interval', desc: 'Frequency of live data refresh', type: 'select', options: ['10 seconds', '30 seconds', '1 minute'], defaultVal: '30 seconds' },
      { label: 'Offline Mode (PWA)', desc: 'Cache data for offline access', type: 'toggle', defaultVal: true },
      { label: 'Export Format', desc: 'Default format for data exports', type: 'select', options: ['PDF', 'CSV', 'JSON', 'XLSX'], defaultVal: 'PDF' },
    ],
  },
]

export default function Settings() {
  const { theme, setTheme, language, setLanguage, t } = useThemeLanguage()
  const [saved, setSaved] = useState(false)
  const [toggles, setToggles] = useState<Record<string, boolean>>({})

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white light:text-slate-900">{t('settings')}</h1>
          <p className="text-sm text-slate-400 mt-0.5">System configuration · Language · Theme mode · AI models</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30'}`}
        >
          {saved ? <><CheckCircle className="w-4 h-4" />{t('saved')}</> : <><Save className="w-4 h-4" />{t('saveChanges')}</>}
        </button>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">A</div>
          <div className="flex-1">
            <p className="text-base font-bold text-white light:text-slate-900">Admin Officer</p>
            <p className="text-sm text-slate-400">admin@sdma.gujarat.gov.in</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">ADMIN</span>
              <span className="text-xs text-slate-500">Gujarat SDMA Control Room</span>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-slate-700 light:bg-slate-200 text-slate-300 light:text-slate-800 rounded-xl text-xs transition-colors">Edit Profile</button>
        </div>
      </motion.div>

      {/* Theme & Language Preferences Card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5 border-cyan-500/30">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10 light:border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-white light:text-slate-900">Appearance & Language Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Switch */}
          <div>
            <label className="text-sm font-medium text-white light:text-slate-900 block mb-1">{t('selectLanguage')}</label>
            <p className="text-xs text-slate-400 mb-3">Change global application UI language and AI chat parameters</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
                { code: 'gu', label: 'ગુજરાતી', flag: '🚩' },
              ].map(item => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code as any)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${language === item.code ? 'bg-cyan-500/20 border-cyan-500 text-white light:text-slate-900 font-semibold' : 'bg-slate-800/50 light:bg-slate-100 border-white/10 light:border-slate-200 text-slate-400 light:text-slate-700 hover:border-white/20'}`}
                >
                  <span className="text-lg mb-1">{item.flag}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode Switch */}
          <div>
            <label className="text-sm font-medium text-white light:text-slate-900 block mb-1">{t('selectTheme')}</label>
            <p className="text-xs text-slate-400 mb-3">Switch between Dark Glassmorphism and Normal Light Mode</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500 text-white font-semibold' : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-white/20'}`}
              >
                <Moon className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold">Dark Mode</p>
                  <p className="text-[10px] text-slate-400">Glassmorphism</p>
                </div>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${theme === 'light' ? 'bg-cyan-500/20 border-cyan-500 text-slate-900 font-semibold' : 'bg-slate-100 border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs font-bold">Light Mode</p>
                  <p className="text-[10px] text-slate-500">Normal Enterprise</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {sections.map(({ title, icon: Icon, color, settings }, si) => (
        <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
            <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
          </div>
          <div className="space-y-5">
            {settings.map((s) => {
              const key = `${title}-${s.label}`
              const toggled = key in toggles ? toggles[key] : (s.defaultVal as boolean)
              const opts = (s as any).options as string[] | undefined
              return (
                <div key={s.label} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">{s.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                  </div>
                  {s.type === 'toggle' && (
                    <button
                      onClick={() => setToggles(prev => ({ ...prev, [key]: !toggled }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${toggled ? 'bg-cyan-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${toggled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  )}
                  {s.type === 'select' && opts && (
                    <select className="px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50 flex-shrink-0">
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                  {s.type === 'number' && (
                    <input type="number" defaultValue={s.defaultVal as string}
                      className="w-24 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-sm text-slate-300 text-right focus:outline-none focus:border-cyan-500/50 flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
