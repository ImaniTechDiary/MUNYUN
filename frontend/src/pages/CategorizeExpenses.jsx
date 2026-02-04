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
  const [months, setMonths] = useState({});
  const [monthFilter, setMonthFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  useEffect(() => {
    const grouped = expenses.reduce((acc, expense) => {
      const date = expense.createdAt ? new Date(expense.createdAt) : null;
      const monthKey = date
        ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
        : 'Unknown Date';
      const category = expense.category || 'uncategorized';

      if (!acc[monthKey]) acc[monthKey] = {};
      acc[monthKey][category] = acc[monthKey][category]
        ? [...acc[monthKey][category], expense]
        : [expense];
      return acc;
    }, {});
    setMonths(grouped);
  }, [expenses]);

  const sortedMonths = Object.keys(months).sort((a, b) => {
    if (a === 'Unknown Date') return 1;
    if (b === 'Unknown Date') return -1;
    const aDate = new Date(a);
    const bDate = new Date(b);
    return bDate - aDate;
  });

  const allCategories = Object.keys(
    expenses.reduce((acc, expense) => {
      const category = expense.category || 'uncategorized';
      acc[category] = true;
      return acc;
    }, {})
  ).sort((a, b) => a.localeCompare(b));

  const filteredMonths = sortedMonths.filter((month) => {
    return monthFilter === 'All' ? true : month === monthFilter;
  });

  const expenseMatchesSearch = (expense) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      expense.name?.toLowerCase().includes(term) ||
      expense.category?.toLowerCase().includes(term)
    );
  };


  const handleDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;

  const [sourceMonth, sourceCategory] = source.droppableId.split('__');
  const [destMonth, destCategory] = destination.droppableId.split('__');

  if (
    sourceMonth === destMonth &&
    sourceCategory === destCategory &&
    source.index === destination.index
  ) {
    return;
  }

  // prevent dragging between months (date-based folders)
  if (sourceMonth !== destMonth) return;

  const updatedMonths = { ...months };

  const sourceItems = Array.from(updatedMonths[sourceMonth][sourceCategory] || []);
  const [movedItem] = sourceItems.splice(source.index, 1);
  updatedMonths[sourceMonth][sourceCategory] = sourceItems;

  const destItems = Array.from(updatedMonths[destMonth][destCategory] || []);
  destItems.splice(destination.index, 0, {
    ...movedItem,
    category: destCategory,
  });

  updatedMonths[destMonth][destCategory] = destItems;

  // Optimistic UI
  setMonths(updatedMonths);

  // Persist to backend + Zustand
  const resultUpdate = await updateExpenseCategory(
    movedItem._id,
    destCategory
  );

  if (!resultUpdate?.success) {
    console.error('Failed to update category');
    setMonths(months); // rollback
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
          <Box className="filterBar">
            <Box className="filterGroup">
              <label className="filterLabel">Month</label>
              <select
                className="filterSelect"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              >
                <option value="All">All</option>
                {sortedMonths.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </Box>
            <Box className="filterGroup">
              <label className="filterLabel">Category</label>
              <select
                className="filterSelect"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Box>
            <Box className="filterGroup filterSearch">
              <label className="filterLabel">Search</label>
              <input
                className="filterInput"
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          </Box>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="monthGrid">
            {filteredMonths.map((month) => (
              <details key={month} className='monthFolder' open>
                <summary className='monthSummary'>
                  <span className='monthTitle'>{month}</span>
                  <span className='monthToggleHint monthToggleHint--open' aria-hidden="true">Close Folder</span>
                  <span className='monthToggleHint monthToggleHint--closed' aria-hidden="true">Open Folder</span>
                </summary>
                <Box className='monthBox' w="100%" p={4} borderRadius="md" boxShadow="md">
                  <VStack align="stretch" spacing={4}>
                    {Object.keys(months[month])
                      .filter((category) => (categoryFilter === 'All' ? true : category === categoryFilter))
                      .map((category, catIdx) => (
                      <Box key={`${month}-${category}`} className='categoryBox' w="100%" bg={catIdx % 2 === 0 ? 'pink.200' : 'pink.200'} p={4} borderRadius="md" boxShadow="md">
                        <Heading 
                          className='categoryHeading'
                          size="sm" 
                          mb={2}
                        >
                          {category.toUpperCase()}
                          {category === 'uncategorized' && (
                            <span className='uncategorizedBadge'>Uncategorized</span>
                          )}
                        </Heading>
                        <Droppable droppableId={`${month}__${category}`}>
                          {(provided) => (
                            <Table ref={provided.innerRef} {...provided.droppableProps} size="sm" variant="striped">
                              <Thead>
                                <Tr>
                                  <Th className='subTitle'>Name</Th>
                                  <Th className='subTitle'>Price</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {months[month][category]
                                  .filter(expenseMatchesSearch)
                                  .map((expense, index) => (
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
                  </VStack>
                </Box>
              </details>
            ))}
            </div>
          </DragDropContext>
        </VStack>
      </Container>
    </div>
  );
}

export default CategorizedExpenses;
