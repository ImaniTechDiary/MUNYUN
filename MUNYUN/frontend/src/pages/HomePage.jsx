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
    <div id='homeMainCont'>
    
    <div className='homePage'>
      <div className="div1">
        <Navbar />
      </div>
      <div className='div2'>
        <MyCalendar 
        />
      </div>
      

      {/* <div className="middle">  */}
        <div bg='#ffc0cb' shadow='md' className="div3">
          <Quote/>
        </div>
        {/* </div> */}
        

        <div className="div4">
          <h2 className='expenseReportTitle'>Expense Report</h2>
          <Reports />
        </div>
        

      <div className="div5">
        <FinanceNews />
      </div>
    </div>
    </div>

  )
}

export default HomePage
