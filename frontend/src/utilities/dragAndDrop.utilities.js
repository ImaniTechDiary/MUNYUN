import { useCallback } from "react";

export const handleDragEnd = (result, expenses, setExpenses, handleCategoryChange) => {
    if (!result.destination) return;

    const {source, destination} = result
    const draggedExpense = expenses[source.index]
    const newCategory = destination.droppableId

    // update the category in the backend
    handleCategoryChange(draggedExpense._id, newCategory)
}
