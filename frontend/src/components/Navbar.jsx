import { Container, Flex, Text, Button, HStack, useColorMode } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

import { PlusSquareIcon } from '@chakra-ui/icons'
import { IoMoon } from 'react-icons/io5'
import { LuSun } from 'react-icons/lu'
// import { useExpenseTracking } from '../tracking/expense'

import homeLogo from '../images/Munyun-logo.png'
import PinkFlower from '../images/3d-Pink-Flower.png'



function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode() 
  const { user, signIn, signOut } = useAuth()

  return (
    <div className='navbar'>
      <Container maxW={'2560px'} px={4}>
        <Flex
          
          alignItems={'center'}
          justifyContent={'space-between'}
          flexDir={{
            base: 'column',
            sm: 'row',
          }}
        >
          <Text
            fontSize={{ base: '22', sm: '28'}}
            fontWeight={'bold'}
            textTransform={'uppercase'}
            textAlign={'center'}
            bgGradient={'linear(to-r, pink.700, green.300)'}
            bgClip={'text'}
          >
            <Link to={'/'}><img src={homeLogo} className='homeLogo' /></Link>

          </Text>


          <HStack className='mainFlowerDiv'>
            <div className="flowerCont">
              <img src={PinkFlower} className='flower'/>
              <Link to={'/expenses/create'} className="link">Create an Expense</Link>
            </div>
            <div className="flowerCont">
              <img src={PinkFlower} className='flower'/>
              <Link to={'/expenses/view-expenses'} className="link">View Expenses</Link>
            </div>
            <div className="flowerCont">
              <img src={PinkFlower} className='flower'/>
              <Link to={'/expenses/categorize'} className="link">Categorize Expenses</Link>
            </div>
            <div className="flowerCont">
              <img src={PinkFlower} className='flower'/>
              <Link to={'/budget'} className="link">Budget</Link>
            </div>
            <div className="flowerCont">
              <img src={PinkFlower} className='flower'/>
              <Link to={'/events'} className="link">View Events</Link>
            </div>
            
          </HStack>

          <HStack className="authControls">
            {user ? (
              <Button className="authBtn" size="sm" onClick={signOut}>
                Sign out
              </Button>
            ) : (
              <Button className="authBtn" size="sm" onClick={signIn}>
                Sign in
              </Button>
            )}
          </HStack>

        </Flex>
        

      </Container>
    </div>
  )
}

export default Navbar
