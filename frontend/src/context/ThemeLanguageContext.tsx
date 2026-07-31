import React, { createContext, useContext, useState, useEffect } from 'react'

export type ThemeMode = 'dark' | 'light'
export type LanguageCode = 'en' | 'hi' | 'gu'

interface ThemeLanguageContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    cycloneTracker: 'Live Cyclone Tracker',
    fishermenAlerts: 'Fishermen Alerts',
    aiPrediction: 'AI Prediction',
    evacuationPlanner: 'Evacuation Planner',
    reliefCoordination: 'Relief Coordination',
    damageAssessment: 'Damage Assessment',
    analytics: 'Analytics',
    agentConsole: 'Agent Console',
    reports: 'Reports',
    settings: 'Settings',
    searchPlaceholder: 'Search districts, boats, reports...',
    emergencyStatus: 'CYCLONE ALERT ACTIVE',
    currentCyclones: 'Current Cyclones',
    riskLevel: 'Risk Level',
    activeAlerts: 'Active Alerts',
    peopleEvacuated: 'People Evacuated',
    boatsAtSea: 'Boats at Sea',
    sheltersAvailable: 'Shelters Available',
    rescueTeams: 'Rescue Teams',
    weatherSummary: 'Weather Telemetry Summary',
    districtHeatmap: 'Gujarat Coastal District Heatmap',
    cycloneIdentification: 'Cyclone Identification System',
    identifyCyclone: 'Identify Active Cyclone',
    selectLanguage: 'Language',
    selectTheme: 'Theme Mode',
    darkMode: 'Dark Glassmorphism',
    lightMode: 'Normal Light Mode',
    saveChanges: 'Save Changes',
    saved: 'Saved!',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    cycloneTracker: 'लाइव चक्रवात ट्रैकर',
    fishermenAlerts: 'मछुआरा सुरक्षा अलर्ट',
    aiPrediction: 'एआई चक्रवात पूर्वानुमान',
    evacuationPlanner: 'निकासी एवं आश्रय योजना',
    reliefCoordination: 'राहत एवं संसाधन समन्वय',
    damageAssessment: 'क्षति मूल्यांकन',
    analytics: 'विश्लेषण एवं रुझान',
    agentConsole: 'एआई एजेंट कंसोल',
    reports: 'आपदा रिपोर्ट',
    settings: 'सेटिंग्स',
    searchPlaceholder: 'जिले, नावें, रिपोर्ट खोजें...',
    emergencyStatus: 'चक्रवात आपातकालीन अलर्ट सक्रिय',
    currentCyclones: 'सक्रिय चक्रवात',
    riskLevel: 'जोखिम स्तर',
    activeAlerts: 'सक्रिय अलर्ट',
    peopleEvacuated: 'निकाले गए लोग',
    boatsAtSea: 'समुद्र में नावें',
    sheltersAvailable: 'उपलब्ध आश्रय स्थल',
    rescueTeams: 'बचाव दल',
    weatherSummary: 'लाइव मौसम विवरण',
    districtHeatmap: 'गुजरात तटीय जिला जोखिम मानचित्र',
    cycloneIdentification: 'चक्रवात पहचान प्रणाली',
    identifyCyclone: 'सक्रिय चक्रवात की पहचान करें',
    selectLanguage: 'भाषा चुनें',
    selectTheme: 'थीम मोड',
    darkMode: 'डार्क ग्लासमोर्फिज्म',
    lightMode: 'सामान्य लाइट मोड',
    saveChanges: 'परिवर्तन सहेजें',
    saved: 'सहेजा गया!',
  },
  gu: {
    dashboard: 'ડેશબોર્ડ',
    cycloneTracker: 'લાઇવ વાવાઝોડું ટ્રેકર',
    fishermenAlerts: 'માછીમાર સુરક્ષા એલર્ટ',
    aiPrediction: 'AI વાવાઝોડું પૂર્વાનુમાન',
    evacuationPlanner: 'સ્થળાંતર અને આશ્રય યોજના',
    reliefCoordination: 'રાહત અને સંસાધન સંકલન',
    damageAssessment: 'નુકસાન મૂલ્યાંકન',
    analytics: 'વિશ્લેષણ અને વલણો',
    agentConsole: 'AI એજન્ટ કન્સોલ',
    reports: 'હોનારત રિપોર્ટ',
    settings: 'સેટિંગ્સ',
    searchPlaceholder: 'જીલ્લાઓ, બોટ, રિપોર્ટ શોધો...',
    emergencyStatus: 'વાવાઝોડું ઇમરજન્સી એલર્ટ એક્ટિવ',
    currentCyclones: 'સક્રિય વાવાઝોડું',
    riskLevel: 'જોખમ સ્તર',
    activeAlerts: 'સક્રિય એલર્ટ',
    peopleEvacuated: 'સ્થળાંતરિત લોકો',
    boatsAtSea: 'દરિયામાં બોટ',
    sheltersAvailable: 'પ્રાપ્ય આશ્રયસ્થાનો',
    rescueTeams: 'બચાવ ટુકડીઓ',
    weatherSummary: 'લાઇવ હવામાન વિગતો',
    districtHeatmap: 'ગુજરાત દરિયાકાંઠાના જિલ્લા જોખમ નકશો',
    cycloneIdentification: 'વાવાઝોડું ઓળખ સિસ્ટમ',
    identifyCyclone: 'સક્રિય વાવાઝોડું ઓળખો',
    selectLanguage: 'ભાષા પસંદ કરો',
    selectTheme: 'થીમ મોડ',
    darkMode: 'ડાર્ક ગ્લાસમોર્ફિઝમ',
    lightMode: 'સામાન્ય લાઈટ મોડ',
    saveChanges: 'સાચવો',
    saved: 'સાચવેલ!',
  },
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined)

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('cycloneshield_theme') as ThemeMode) || 'dark'
  })

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('cycloneshield_lang') as LanguageCode) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('cycloneshield_theme', theme)
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('cycloneshield_lang', language)
  }, [language])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang)
  }

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en?.[key] || key
  }

  return (
    <ThemeLanguageContext.Provider value={{ theme, setTheme, toggleTheme, language, setLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  )
}

export const useThemeLanguage = (): ThemeLanguageContextType => {
  const context = useContext(ThemeLanguageContext)
  if (!context) {
    throw new Error('useThemeLanguage must be used within a ThemeLanguageProvider')
  }
  return context
}
