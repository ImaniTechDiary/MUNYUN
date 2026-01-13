import { Button, Container, useColorModeValue, VStack, Heading, Box, Input, useToast, Link , Select, Text} from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import { useExpenseTracking } from '../tracking/expense'

import { useNavigate } from 'react-router-dom'

import './styling/create-page.css'
// import './styling/main.css'

// COMPONENTS
import Navbar from '../components/Navbar'


// upload receipt
const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });


function CreatePage({onExpenseCreate} ) {
  const navigate = useNavigate()
  const [newExpense, setNewExpense] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
  })

  const [customCategory, setCustomCategory] = useState('')
  const [useCustomCategory, setUseCustomCategory] = useState(false)

  const categories = ['Rent', 'Utilities', 'Groceries', 'Transporation', 'Entertainment', ]

  const toast = useToast()
  const {createExpense}=useExpenseTracking()

  const handleAddExpense = async() => {
    const expenseToSave = {
      ...newExpense,
      category: useCustomCategory ? customCategory : newExpense.category,
    }

    // if no image added, remove image field so form will go submit
    if (!expenseToSave.image) {
      delete expenseToSave.image
    }

  //  const {success, message} = await createExpense(newExpense)
  const {success, message} = await createExpense(expenseToSave)

    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true 
      })
    } else {
      toast({
      title: 'Success',
      description: message,
      status: 'success',
      isClosable: true 
    })

    // add the new expense to the relevant category for Categorize Expense Page
    // onExpenseCreate(newExpense) // pass the newly created expense****
    // onExpenseCreate(expenseToSave)

      // reset form
    setNewExpense({name:'', price: '', image: '', category: ''})
    setCustomCategory('')
    setUseCustomCategory(false)

    // Navigate to categorize page
    navigate('/expenses/categorize')
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    console.log('Selecting category:', value)
    setNewExpense({ ...newExpense, category: value })

    if (value === 'Custom') {
      setUseCustomCategory(true)
    } else {
      setUseCustomCategory(false)
      setCustomCategory('')
    }
  }


  
  return (
    <div className='createPageCont'>
      <Navbar />
      <Container className='createExpenseCont' maxW={'container.sm'} autoComplete='off'>
      <VStack
        spacing={8}
      >
        {/* <Heading className='createPageHeading' as={'h1'} size={'2xl'} textAlign={'center'} mb={8}>
          Create New Expense
        </Heading> */}
        <Text 
        className='createPageTitle'
          // fontSize={'50'}
          fontWeight={'bold'}
          // bgGradient={'linear(to-r, cyan.400, blue-500'}
          // bgClip={'text'}
          textAlign={'center'}
          // color={'#f071b3'}
          textTransform='uppercase'
        >Create New Expense</Text>

        <Box className='createExpenseBox'
          w={'full'} 
          p={6} rounded={'lg'}
        >
          <VStack spacing={4}>
          <Input 
            className='expenseInput'
            placeholder='Expense Name'
            name='name'
            value={newExpense.name}
            onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
            autoComplete='off'
          />
          <Input 
            className='expenseInput'
            placeholder='Price'
            name='price'
            type='number'
            value={newExpense.price}
            onChange={(e) => setNewExpense({...newExpense, price: e.target.value})}
            autoComplete='off'
          />
          <Input
            className='expenseInput'
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                const base64Image = await convertToBase64(file);
                setNewExpense({ ...newExpense, image: base64Image });
              } else {
                setNewExpense({...newExpense, image: ''})
              }
            }}
            autoComplete='off'
          />
          
 
          <Select 
            className='expenseInput'
            placeholder='Select Expense Category'
            name={'category'}
            value={newExpense.category}
            // onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            onChange={handleCategoryChange}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
            
            <option value='Custom'>Custom</option>
          </Select>
          {useCustomCategory && (
            <Input 
              mt={2}
              placeholder='Enter Custom Category'
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
            />
          )}
      

            <Button className='addExpenseBtn' onClick={handleAddExpense} w='full'>
              <Link className='addExpenseLink'>Add Expense</Link>
            </Button>
          </VStack>

        </Box>
      </VStack>

      </Container>
    </div>
  )
}

export default CreatePage
