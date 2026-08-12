import React from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Scoreboard from './components/Scoreboard'
import ActivityLog from './components/ActivityLog'
import SideColumn from './components/SideColumn'
import './App.css'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <Topbar />
        <Scoreboard />
        <div className="grid">
          <ActivityLog />
          <SideColumn />
        </div>
      </main>
    </div>
  )
}

export default App