import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box, useColorModeValue } from '@chakra-ui/react'
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
  const isLoginRoute = location.pathname === '/login'
  if (!loading && !user && !demoMode && !isLoginRoute) {
    return <Navigate to="/login" replace />
  }
  return (
    <Box className='appCont' height={'100vh'} bg={useColorModeValue('gray.100', 'gray.900')}>
      {/* <Navbar /> */}
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/expenses/view-expenses' element={<ExpensePage />} />
        <Route path='/expenses/categorize' element={<CategorizeExpenses />}/>
        <Route path='/expenses/create' element={<CreatePage onExpenseCreate={addNewCategory}/>} />
        <Route path='/events' element={<EventsPage />} />
        <Route path='/budget' element={<BudgetPage />} />
      </Routes>
      
  </Box>
  )
}

export default App
