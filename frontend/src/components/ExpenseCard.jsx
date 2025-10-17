import React, { useState } from 'react'
import { Box, Image, Heading, Text, HStack, IconButton, useColorModeValue, useToast, ModalOverlay, ModalCloseButton, Input,
  Modal,  ModalContent, ModalHeader, ModalBody, VStack, ModalFooter, Button, useDisclosure
 } from '@chakra-ui/react'

import {  FaEdit as EditIcon } from 'react-icons/fa'; // imrport edit icon
import { MdDelete as DeleteIcon } from 'react-icons/md'; //Import DeleteIcon 
import { useExpenseTracking } from '../tracking/expense';

const ExpenseCard = ({expense}) => {
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
        shadow='lg'
        rounded='lg'
        overflow='hidden'
        transition='all 0.3s'
        _hover={{ transform: 'translateY(-5px)', shadow: 'xl' }}
        bg='#f7d6e7'
        border='solid 5px #f071b3'
    >
        <Image  src={expense.image} alt={expense.name} h={48} w='full' objectFit='cover'/>

        <Box p={4}>
        <Heading as='h3' size='md' mb={2}>
          {expense.name}
        </Heading> 

        <Text fontWeight='bold' fontSize='xl' color={textColor} mb={4}>
          ${expense.price}
        </Text>

          <HStack spacing={2}>
            <IconButton aria-hidden="false" icon={<EditIcon />} colorScheme='blue' 
            onClick={onOpen} //handle fxn that opens and closes specified modal
            /> 
            <IconButton icon={<DeleteIcon />} colorScheme='red' 
            onClick={() => handleDeleteExpense(expense._id)} />
          </HStack>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay/>


          <ModalContent>
            <ModalHeader>Update Expense</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input placeholder='Expense Name' name='name' value={updatedExpense.name}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, name: e.target.value})}
                />
                <Input placeholder='Expense Price' name='price' type='number' value={updatedExpense.price}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, price: e.target.value})}
                />
                <Input placeholder='Image URL' name='image' value={updatedExpense.image}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, image: e.target.value})}
                />
                <Input placeholder='Expense Category' name='category' value={updatedExpense.category}
                  onChange={(e) => setUpdatedExpense({ ...updatedExpense, category: e.target.value})}
                />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} 
              onClick={() => handleUpdateExpense(expense._id, updatedExpense)}>
                Update
              </Button>
              <Button variant='ghost' onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>a
        </Modal>
    </Box>
  )
}

export default ExpenseCard
