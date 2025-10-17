  // useEffect(() => {
  //   if (isAmountSet) {
  //     const totalExpenses = Object.values(categories).flat().reduce((sum, expense) => sum + Number(expense.price || 0), 0);
  //     const newRemainingAmount = initialAmount - totalExpenses;
  //     setRemainingAmount(newRemainingAmount);
  //     localStorage.setItem('remainingAmount', newRemainingAmount);
  //   }
  // }, [expenses, initialAmount, isAmountSet, categories]);

  // const handleSetBudget = () => {
  //   if (isNaN(initialAmount) || initialAmount <= 0) {
  //     toast({ title: 'Invalid budget amount', description: 'Please enter a valid amount.', status: 'error', duration: 3000, isClosable: true });
  //     return;
  //   }
  //   setIsAmountSet(true);
  //   toast({ title: 'Budget Set', description: `Your initial budget of $${initialAmount} has been set.`, status: 'success', duration: 3000, isClosable: true });
  // };

  // const handleAddMoney = () => {
  //   if (isNaN(additionalAmount) || additionalAmount <= 0) {
  //     toast({ title: 'Invalid additional amount', description: 'Please enter a valid additional amount.', status: 'error', duration: 3000, isClosable: true });
  //     return;
  //   }
  //   const updatedInitialAmount = initialAmount + Number(additionalAmount);
  //   setInitialAmount(updatedInitialAmount);
  //   setAdditionalAmount('');
  //   toast({ title: 'Money Added', description: `Successfully added $${additionalAmount} to your budget.`, status: 'success', duration: 3000, isClosable: true });
  // };





    {/* {!isAmountSet ? (
              <>
                <Input placeholder="Enter Initial Budget Amount" value={initialAmount} onChange={(e) => setInitialAmount(Number(e.target.value))} type="number" />
                <Button colorScheme="orange" onClick={handleSetBudget}>Set Budget</Button>
              </>
            ) : (
              <Text>Budget Amount: ${initialAmount}</Text>
            )}
            {isAmountSet && (
              <>
                <Input placeholder="Add Money to Budget" value={additionalAmount} onChange={(e) => setAdditionalAmount(e.target.value)} type="number" />
                <Button colorScheme="blue" onClick={handleAddMoney}>Add Money</Button>
              </>
            )} */}