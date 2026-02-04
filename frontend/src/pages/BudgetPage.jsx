import React, { useEffect, useMemo, useState } from 'react'
import { Container, VStack, Text, Box, SimpleGrid, Button, Input, Select } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import { API_BASE_URL } from '../lib/api'
import { authFetch } from '../lib/authFetch'
import './styling/budget-page.css'

const BUDGET_TYPES = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Daily', value: 'daily' },
]

function BudgetPage() {
  const [budgets, setBudgets] = useState([])
  const [status, setStatus] = useState('loading')
  const [form, setForm] = useState({
    type: 'monthly',
    amount: '',
    periodStart: '',
    note: ''
  })

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/budgets`)
        if (!res.ok) throw new Error('Failed to load budgets')
        const data = await res.json()
        setBudgets(data.data || [])
        setStatus('ready')
      } catch (error) {
        console.error(error)
        setStatus('error')
      }
    }
    fetchBudgets()
  }, [])

  const handleCreate = async () => {
    if (!form.amount || !form.periodStart) return
    try {
      const res = await authFetch(`${API_BASE_URL}/api/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: form.type,
          amount: Number(form.amount),
          periodStart: form.periodStart,
          note: form.note
        })
      })
      const data = await res.json()
      if (data?.data) {
        setBudgets((prev) => [data.data, ...prev])
        setForm({ type: 'monthly', amount: '', periodStart: '', note: '' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const upcomingMonths = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 0; i < 6; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      months.push(d)
    }
    return months
  }, [])

  const monthlyBudgets = budgets.filter((b) => b.type === 'monthly')

  return (
    <div className="budgetPage">
      <Navbar />
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8}>
          <Text className="categorizePageTitle">Budget Planner</Text>

          <Box className="budgetForm">
            <div className="budgetFormRow">
              <label className="budgetLabel">Type</label>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {BUDGET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </div>
            <div className="budgetFormRow">
              <label className="budgetLabel">Amount</label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="budgetFormRow">
              <label className="budgetLabel">Start Date</label>
              <Input
                type="date"
                value={form.periodStart}
                onChange={(e) => setForm({ ...form, periodStart: e.target.value })}
              />
            </div>
            <div className="budgetFormRow">
              <label className="budgetLabel">Note</label>
              <Input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Optional note"
              />
            </div>
            <Button className="munyun-btn" onClick={handleCreate}>Create Budget</Button>
          </Box>

          <Box className="budgetSection">
            <h3 className="budgetSectionTitle">Upcoming Months</h3>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
              {upcomingMonths.map((month) => {
                const label = month.toLocaleString('default', { month: 'long', year: 'numeric' })
                const entry = monthlyBudgets.find((b) => {
                  const d = new Date(b.periodStart)
                  return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()
                })
                return (
                  <Box key={label} className="budgetCard">
                    <div className="budgetCardTitle">{label}</div>
                    <div className="budgetCardValue">
                      {entry ? `$${entry.amount}` : 'No budget yet'}
                    </div>
                  </Box>
                )
              })}
            </SimpleGrid>
          </Box>

          <Box className="budgetSection">
            <h3 className="budgetSectionTitle">All Budgets</h3>
            {status === 'loading' && <p className="budgetEmpty">Loading...</p>}
            {status === 'error' && <p className="budgetEmpty">Budgets unavailable.</p>}
            {status === 'ready' && budgets.length === 0 && (
              <p className="budgetEmpty">No budgets yet.</p>
            )}
            {budgets.length > 0 && (
              <div className="budgetList">
                {budgets.map((b) => (
                  <div key={b._id} className="budgetRow">
                    <span className="budgetType">{b.type}</span>
                    <span className="budgetAmount">${b.amount}</span>
                    <span className="budgetDate">
                      {new Date(b.periodStart).toLocaleDateString()}
                    </span>
                    <span className="budgetNote">{b.note || '-'}</span>
                  </div>
                ))}
              </div>
            )}
          </Box>
        </VStack>
      </Container>
    </div>
  )
}

export default BudgetPage
