import React, { useEffect, useState } from 'react'
import {
  Container,
  VStack,
  Text,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { useExpenseTracking } from '../tracking/expense'
import { FaEdit as EditIcon } from 'react-icons/fa'
import { MdDelete as DeleteIcon } from 'react-icons/md'

// components
import ExpenseCard from '../components/ExpenseCard'
import Navbar from '../components/Navbar'

// styling
import './styling/expense-page.css'



function ExpensePage() {

  // fetch expenses from the tracking folder
  const {fetchExpenses, expenses, deleteExpense, updateExpense} = useExpenseTracking()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedExpense, setSelectedExpense] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])
  console.log('expenses', expenses)

  const handleEditOpen = (expense) => {
    setSelectedExpense(expense)
    onOpen()
  }

  const handleEditClose = () => {
    setSelectedExpense(null)
    onClose()
  }

  const handleUpdate = async () => {
    if (!selectedExpense) return
    await updateExpense(selectedExpense._id, selectedExpense)
    handleEditClose()
    toast({
      title: 'Updated',
      description: 'Expense updated successfully.',
      status: 'success',
      isClosable: true,
      duration: 3000
    })
  }

  const handleDelete = async (eid) => {
    const { success, message } = await deleteExpense(eid)
    toast({
      title: success ? 'Deleted' : 'Error',
      description: message || (success ? 'Expense deleted.' : 'Delete failed.'),
      status: success ? 'success' : 'error',
      isClosable: true,
      duration: 3000
    })
  }




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

        <div className="expensesTableWrap">
          <table className="expensesTable">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Price</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense._id}>
                  <td data-label="Expense">{expense.name}</td>
                  <td data-label="Category">{expense.category || 'Uncategorized'}</td>
                  <td data-label="Price">${expense.price}</td>
                  <td data-label="Date">{expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : '-'}</td>
                  <td data-label="Actions">
                    <HStack spacing={2} justify="flex-end">
                      <IconButton
                        aria-label="Edit expense"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="pink"
                        onClick={() => handleEditOpen(expense)}
                      />
                      <IconButton
                        aria-label="Delete expense"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDelete(expense._id)}
                      />
                    </HStack>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      <Modal isOpen={isOpen} onClose={handleEditClose}>
        <ModalOverlay />
        <ModalContent className="munyun-modal-content">
          <ModalHeader className="munyun-modal-title">Update Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                className="munyun-input"
                placeholder="Expense Name"
                value={selectedExpense?.name || ''}
                onChange={(e) => setSelectedExpense({ ...selectedExpense, name: e.target.value })}
              />
              <Input
                className="munyun-input"
                placeholder="Expense Price"
                type="number"
                value={selectedExpense?.price || ''}
                onChange={(e) => setSelectedExpense({ ...selectedExpense, price: e.target.value })}
              />
              <Input
                className="munyun-input"
                placeholder="Image URL"
                value={selectedExpense?.image || ''}
                onChange={(e) => setSelectedExpense({ ...selectedExpense, image: e.target.value })}
              />
              <Input
                className="munyun-input"
                placeholder="Expense Category"
                value={selectedExpense?.category || ''}
                onChange={(e) => setSelectedExpense({ ...selectedExpense, category: e.target.value })}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button className="munyun-btn" mr={3} onClick={handleUpdate}>
              Update
            </Button>
            <Button className="munyun-btn munyun-btn--ghost" onClick={handleEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
  )
}

export default ExpensePage
