// import React from 'react'
import {useState, useEffect, useRef} from 'react'
import { Box } from '@chakra-ui/react'
import './styling/home.css'
import PinkFlower from '../images/3d-Pink-Flower.png'
// import '../index.css'
import { Link } from 'react-router-dom'

// COMPONENTS
import Navbar from '../components/Navbar'
import MyCalendar from '../components/Calendar'
import Reports from '../components/Reports'
import Quote from '../components/Quote'
import FinanceNews from '../components/FinanceNews'
function HomePage() {
  const calendarRef = useRef(null)

  return (
    <div id='homeMainCont' className='homeMainCont parent'>
      <div className="navbar div1">
        <Navbar />
      </div>


      <div className="div3"> 
        <div bg='#ffc0cb' shadow='md' className="quote">
          <Quote />
        </div>
      </div>

      <div className='createEventSlot'>
        <button className='createEventBtn div2 shadow munyun-btn' onClick={() => calendarRef.current?.open()}>
          Create Event
        </button>
        <Link to='/events' className='viewEventsBtn munyun-btn'>
          View Events
        </Link>
      </div>

      <div className='calendar'>
        <MyCalendar ref={calendarRef} showCreateButton={false} />
      </div>
    {/* </div> */}
        

        <div className="reports div5">
          <h2 className='expenseReportTitle'>Expense Report</h2>
          <Reports />
        </div>
        

      <div className="financeNews div6">
        <FinanceNews />
      </div>
    </div>
  )
}

export default HomePage
