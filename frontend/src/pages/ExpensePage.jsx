import React, { useEffect } from 'react'
import { Container, VStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useExpenseTracking } from '../tracking/expense'

// components
import ExpenseCard from '../components/ExpenseCard'
import Navbar from '../components/Navbar'

// styling
import './styling/expense-page.css'



function ExpensePage() {

  // fetch expenses from the tracking folder
  const {fetchExpenses, expenses} = useExpenseTracking()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])
  console.log('expenses', expenses)





  return (
      <div className='expensePage'>
      <Navbar />
      <Container  maxW='container.xl' py={12}>
        <VStack spacing={8}>
        <Text
          className='pageTitle'
          fontSize={'50'}
          fontWeight={'bold'}
          bgGradient={'linear(to-r, cyan.400, blue-500'}
          bgClip={'text'}
          textAlign={'center'}
          color={'#f071b3'}
          textTransform='uppercase'
        >
          View All Expenses
        </Text>

        <VStack spacing={6} w={'full'} align={'stretch'}>
          {expenses.map((expense) => (
            <ExpenseCard key={expense._id} expense={expense} layout='list' />
          ))}
        </VStack>
          {/* if there are expenses in the array, then hide the no expense found text */}
          {expenses.length === 0 && (
            <Text fontSize='xl' textAlign={'center'} fontWeight={'bold'} color={'gray.500'}>
              No expenses found. {' '}
              <Link to={'/expenses/create'}>
                <Text as='span' color='blue.500' _hover={{ textDecoration: 'underling' }}>
                  Create an expense
                </Text>
              </Link>
            </Text>           
          )}
        </VStack>
      </Container>
      </div>
  )
}

export default ExpensePage



