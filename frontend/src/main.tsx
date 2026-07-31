import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

import { ThemeLanguageProvider } from './context/ThemeLanguageContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 30000, // Refetch every 30s for live data
      staleTime: 10000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeLanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeLanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
