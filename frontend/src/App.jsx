import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { useAuth } from './context/AuthContext.jsx'

// PAGES
import HomePage from './pages/HomePage'
import CreatePage from './pages/CreatePage'
import ExpensePage from './pages/ExpensePage'
import CategorizeExpenses from './pages/CategorizeExpenses'
import EventsPage from './pages/EventsPage'
import BudgetPage from './pages/BudgetPage'
import LoginPage from './pages/LoginPage'

// STYLING
import '../src/pages/styling/main.css'
import '../src/pages/styling/forms.css'
 
// COMPONENTS
import Navbar from './components/Navbar'



function App(addNewCategory) {
  const { user, loading, demoMode } = useAuth()
  const location = useLocation()
  const isLoginRoute = location.pathname === '/login' || location.pathname === '/'
  if (!loading && !user && !demoMode && !isLoginRoute) {
    return <Navigate to="/login" replace />
  }
  return (
    <Box className='appCont' minH="100vh" bg="transparent">
      <video className="appBgVideo" autoPlay muted loop playsInline aria-hidden="true">
        <source src="/PinkAnimatedBG23.mp4" type="video/mp4" />
      </video>
      <div className="appContent">
        {/* <Navbar /> */}
        <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
          <Route path='/expenses/view-expenses' element={<ExpensePage />} />
          <Route path='/expenses/categorize' element={<CategorizeExpenses />}/>
          <Route path='/expenses/create' element={<CreatePage onExpenseCreate={addNewCategory}/>} />
          <Route path='/events' element={<EventsPage />} />
          <Route path='/budget' element={<BudgetPage />} />
        </Routes>
      </div>
  </Box>
  )
}

export default App
