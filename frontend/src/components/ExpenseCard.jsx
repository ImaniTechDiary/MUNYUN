import React, { useState } from 'react'
import { Box, Image, Heading, Text, HStack, IconButton, useColorModeValue, useToast, ModalOverlay, ModalCloseButton, Input,
  Modal,  ModalContent, ModalHeader, ModalBody, VStack, ModalFooter, Button, useDisclosure
 } from '@chakra-ui/react'

import {  FaEdit as EditIcon } from 'react-icons/fa'; // imrport edit icon
import { MdDelete as DeleteIcon } from 'react-icons/md'; //Import DeleteIcon 
import { useExpenseTracking } from '../tracking/expense';

const ExpenseCard = ({expense, layout = 'grid'}) => {
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const bg = useColorModeValue('white', 'gray.800')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [updatedExpense, setUpdatedExpense] = useState(expense)
  const {deleteExpense, updateExpense } = useExpenseTracking()
  const toast = useToast()
 

  const handleDeleteExpense = async (eid) => {
    const {success, message} = await deleteExpense(eid)
    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true,
        duration: 3000
      })
    } else {
      toast({
      title: 'Success',
      description: message,
      status: 'success',
      isClosable: true,
      duration: 3000
    })
  }}

  const handleUpdateExpense = async (eid, updatedExpense) => {
    await updateExpense(eid, updatedExpense)
    onClose()
    if (!success) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true,
        duration: 3000       
      })
    } else {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        isClosable: true,
        duration: 3000       
      })
    }
  }

  const handleOpenModal = () => {
    setUpdatedExpense(expense)
    onOpen()
  } 


  // const handleModalClose = () => {
  //   onClose() //Ensure the modal close state is triggered
  //   setTimeout(() => {
  //     document.activeElement.blur() //Reset focus
  //   }, 0)
  // }

  return (
    <Box
        className={`expenseCard ${layout === 'list' ? 'expenseCard--list' : ''}`}
        shadow='lg'
        rounded='lg'
        overflow='hidden'
        transition='all 0.3s'
        _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
        bg='#f7d6e7'
        border='solid 5px #f071b3'
    >
        {expense.image ? (
          <Image className='expenseCard__image' src={expense.image} alt={expense.name} h={48} w='full' objectFit='cover'/>
        ) : (
          <div className="expenseCard__noImage">
            {expense.category || 'Uncategorized'}
          </div>
        )}

        <Box p={4} className='expenseCard__content'>
        <Heading as='h3' size='md' mb={2} className='expenseCard__title'>
          {expense.name}
        </Heading> 

        <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4} className='expenseCard__price'>
          ${expense.price}
        </Text>

          <HStack spacing={2} className='expenseCard__actions'>
            <IconButton aria-hidden="false" icon={<EditIcon />} colorScheme='blue' 
            onClick={onOpen} //handle fxn that opens and closes specified modal
            /> 
            <IconButton icon={<DeleteIcon />} colorScheme='red' 
            onClick={() => handleDeleteExpense(expense._id)} />
          </HStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>


          <ModalContent className='munyun-modal-content'>
            <ModalHeader className='munyun-modal-title'>Update Expense</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input className='munyun-input' placeholder='Expense Name' name='name' value={updatedExpense.name}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, name: e.target.value})}
                />
                <Input className='munyun-input' placeholder='Expense Price' name='price' type='number' value={updatedExpense.price}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, price: e.target.value})}
                />
                <Input className='munyun-input' placeholder='Image URL' name='image' value={updatedExpense.image}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, image: e.target.value})}
                />
                <Input className='munyun-input' placeholder='Expense Category' name='category' value={updatedExpense.category}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, category: e.target.value})}
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button className='munyun-btn' colorScheme='blue' mr={3} 
              onClick={() => handleUpdateExpense(expense._id, updatedExpense)}>
                Update
              </Button>
              <Button className='munyun-btn munyun-btn--ghost' variant='ghost' onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>a
        </Modal>
    </Box>
  )
}

export default ExpenseCard
