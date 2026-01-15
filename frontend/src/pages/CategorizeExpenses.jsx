import { useExpenseTracking } from '../tracking/expense';
import React, { useEffect, useState } from 'react';
import {
  Container,
  VStack,
  Text,
  Heading,
  Input,
  useToast,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Navbar from '../components/Navbar';

import './styling/categorize-page.css'
function CategorizedExpenses() {
  const { 
    fetchExpenses, 
    expenses,
    updateExpenseCategory,
} = useExpenseTracking();
  const [initialAmount, setInitialAmount] = useState(() => Number(localStorage.getItem('initialAmount')) || 0);
  const [remainingAmount, setRemainingAmount] = useState(() => Number(localStorage.getItem('remainingAmount')) || 0);
  const [isAmountSet, setIsAmountSet] = useState(() => JSON.parse(localStorage.getItem('isAmountSet')) || false);
  const [additionalAmount, setAdditionalAmount] = useState('');
  const [categories, setCategories] = useState({ uncategorized: expenses || [] });
  const toast = useToast();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const categorizedExpenses = expenses.reduce((acc, expense) => {
      const category = expense.category || 'uncategorized';
      acc[category] = acc[category] ? [...acc[category], expense] : [expense];
      return acc;
    }, { uncategorized: [] });
    setCategories(categorizedExpenses);
  }, [expenses]);


  const handleDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;

  const sourceCategory = source.droppableId;
  const destCategory = destination.droppableId;

  if (
    sourceCategory === destCategory &&
    source.index === destination.index
  ) {
    return;
  }

  const updatedCategories = { ...categories };

  const sourceItems = Array.from(updatedCategories[sourceCategory]);
  const [movedItem] = sourceItems.splice(source.index, 1);
  updatedCategories[sourceCategory] = sourceItems;

  const destItems = Array.from(updatedCategories[destCategory] || []);
  destItems.splice(destination.index, 0, {
    ...movedItem,
    category: destCategory,
  });

  updatedCategories[destCategory] = destItems;

  // Optimistic UI
  setCategories(updatedCategories);

  // Persist to backend + Zustand
  const resultUpdate = await updateExpenseCategory(
    movedItem._id,
    destCategory
  );

  if (!resultUpdate?.success) {
    console.error('Failed to update category');
    setCategories(categories); // rollback
  }
};

  // const handleDragEnd = (result) => {
  //   const { source, destination } = result;
  //   if (!destination) return;
  //   const sourceCategory = source.droppableId;
  //   const destCategory = destination.droppableId;
  //   if (sourceCategory === destCategory && source.index === destination.index) return;

  //   const updatedCategories = { ...categories };
  //   const sourceItems = Array.from(updatedCategories[sourceCategory]);
  //   const [movedItem] = sourceItems.splice(source.index, 1);
  //   updatedCategories[sourceCategory] = sourceItems;
  //   const destItems = Array.from(updatedCategories[destCategory] || []);
  //   destItems.splice(destination.index, 0, movedItem);
  //   updatedCategories[destCategory] = destItems;
  //   setCategories(updatedCategories);
  // };

  return (
    <div className='categorizePage'>
      <Navbar />
      <Container className='categoryContainer' >
        <Heading 
          className='categorizePageTitle'
          // mt={4}
        >
          Categorize Expenses
        </Heading>
        <VStack 
          // align='stretch'
          // mt={6}
          // spacing={{ base: 4, md: 6, xl: 8}}
          align="start" 
          // spacing={4} 
          mt={4}
        >
        

          <DragDropContext onDragEnd={handleDragEnd}>
            {Object.keys(categories).map((category, catIdx) => (
              <Box key={category} className='categoryBox' w="100%" bg={catIdx % 2 === 0 ? 'pink.200' : 'pink.200'} p={4} borderRadius="md" boxShadow="md">
                <Heading 
                  className='categoryHeading'
                  size="sm" 
                  mb={2}>{category.toUpperCase()}
                </Heading>
                <Droppable droppableId={category}>
                  {(provided) => (
                    <Table ref={provided.innerRef} {...provided.droppableProps} size="sm" variant="striped">
                      <Thead>
                        <Tr>
                          <Th className='subTitle'>Name</Th>
                          <Th className='subTitle'>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {categories[category].map((expense, index) => (
                          <Draggable key={expense._id} draggableId={expense._id} index={index}>
                            {(provided) => (
                              <Tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <Td className='expenseNameCell'>{expense.name}</Td>
                                <Td className='expensePriceCell'>${expense.price}</Td>
                              </Tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Tbody>
                    </Table>
                  )}
                </Droppable>
              </Box>
            ))}
          </DragDropContext>
        </VStack>
      </Container>
    </div>
  );
}

export default CategorizedExpenses;
