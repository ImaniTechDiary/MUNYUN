import React, { useEffect } from 'react'
import { Container, VStack, Text, SimpleGrid } from '@chakra-ui/react'
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
          Current Expenses
        </Text>

        <SimpleGrid
          columns={{
            base: 1,
            md: 2, 
            lg: 3
          }}
          spacing={10}
          w={'full'}
        >
          {expenses.map((expense) => (
            <ExpenseCard key={expense._id} expense={expense} />
          ))}
        </SimpleGrid>
          {/* if there are expenses in the array, then hide the no expense found text */}
          {expenses.length === 0 && (
            <Text fontSize='xl' textAlign={'center'} fontWeight={'bold'} color={'gray.500'}>
              No expenses found. {' '}
              <Link to={'/create'}>
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






