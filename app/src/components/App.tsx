import React from 'react'
import { Route, Routes } from 'react-router'

import { AuthLayout } from 'components/auth'
import { ItemsLayout } from 'components/items'
import { Navbar } from './Navbar'
import Sidebar from './Sidebar'

export default function App(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        <Navbar />
        <Routes>
          <Route path="/login" element={<AuthLayout />} />
          <Route path="/*" element={<ItemsLayout />} />
        </Routes>
      </main>
    </div>
  )
}
