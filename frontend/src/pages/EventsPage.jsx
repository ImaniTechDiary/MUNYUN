import React, { useEffect, useMemo, useState } from 'react'
import { Container, VStack, Text, SimpleGrid, Box } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import { API_BASE_URL } from '../lib/api'
import './styling/events-page.css'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events`)
        if (!res.ok) {
          throw new Error(`Events request failed: ${res.status}`)
        }
        const data = await res.json()
        const normalized = (data?.data || []).map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }))
        setEvents(normalized)
        setStatus('ready')
      } catch (error) {
        console.error('Error fetching events:', error)
        setStatus('error')
      }
    }

    fetchEvents()
  }, [])

  const { pastEvents, todayEvents, upcomingEvents } = useMemo(() => {
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

    const past = []
    const today = []
    const upcoming = []

    events.forEach((event) => {
      if (event.start < startOfToday) past.push(event)
      else if (event.start >= startOfToday && event.start <= endOfToday) today.push(event)
      else upcoming.push(event)
    })

    const byStart = (a, b) => a.start - b.start
    return {
      pastEvents: past.sort(byStart),
      todayEvents: today.sort(byStart),
      upcomingEvents: upcoming.sort(byStart),
    }
  }, [events])

  const renderList = (list, emptyText) => {
    if (status === 'loading') {
      return <p className="eventsEmpty">Loading events...</p>
    }
    if (status === 'error') {
      return <p className="eventsEmpty">Events currently unavailable.</p>
    }
    if (!list.length) {
      return <p className="eventsEmpty">{emptyText}</p>
    }

    return (
      <ul className="eventsList">
        {list.map((event) => (
          <li key={event._id} className="eventsItem">
            <div className="eventsTitle">{event.title}</div>
            <div className="eventsMeta">
              {event.start.toLocaleString()} — {event.end.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="eventsPage">
      <Navbar />
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8}>
          <Text className="eventsTitleMain">Events</Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
            <Box className="eventsColumn">
              <h3 className="eventsColumnTitle">Coming Up</h3>
              {renderList(upcomingEvents, 'No upcoming events.')}
            </Box>
            <Box className="eventsColumn">
              <h3 className="eventsColumnTitle">Today</h3>
              {renderList(todayEvents, 'No events today.')}
            </Box>
            <Box className="eventsColumn">
              <h3 className="eventsColumnTitle">Past</h3>
              {renderList(pastEvents, 'No past events.')}
            </Box>
          </SimpleGrid>
        </VStack>
      </Container>
    </div>
  )
}

export default EventsPage
