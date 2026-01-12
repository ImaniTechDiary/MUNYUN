// import React from 'react'
import {useState, useEffect} from 'react'
import { Box } from '@chakra-ui/react'
import './styling/home.css'
import PinkFlower from '../images/3d-Pink-Flower.png'
// import '../index.css'

// COMPONENTS
import Navbar from '../components/Navbar'
import MyCalendar from '../components/Calendar'
import Reports from '../components/Reports'
import Quote from '../components/Quote'
import FinanceNews from '../components/FinanceNews'
function HomePage() {

  return (
    <div id='homeMainCont' className='homeMainCont'>
    
    {/* <div className='div1'> */}
      <div className="navbar">
        <Navbar />
      </div>
      <div className='calendar'>
        <MyCalendar 
        />
      </div>
      

      {/* <div className="QuoteMainDiv">  */}
        <div bg='#ffc0cb' shadow='md' className="quote">
          <Quote />
        </div>
        {/* </div> */}
        

        <div className="reports">
          <h2 className='expenseReportTitle'>Expense Report</h2>
          <Reports />
        </div>
        

      <div className="div5">
        <FinanceNews />
      </div>
    </div>
    // </div>

  )
}

export default HomePage
