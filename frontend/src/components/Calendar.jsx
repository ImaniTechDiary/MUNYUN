import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // import axios for API calls
import { getAuthHeaders } from '../lib/authFetch';
import { API_BASE_URL } from '../lib/api';





const localizer = momentLocalizer(moment);

const MyCalendar = forwardRef(({ showCreateButton = true }, ref) => {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title:'',
    start:'',
    end:'',
  })

  // Fetch events from backend when component mounts
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${API_BASE_URL}/api/events`, { headers });
      const formattedEvents = res.data.data.map(event => ({
        ...event,
        start: new Date(event.start), // Ensure it's a Date object
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  fetchEvents();
}, []);



  // OPEN AND CLOSE MODAL
  const handleShow = () => setShowModal(true)
  const handleClose = () => {
    setShowModal(false)
    setNewEvent({title:'', start:'', end:''}) // Resets form
  };

  useImperativeHandle(ref, () => ({
    open: () => setShowModal(true),
    close: () => handleClose(),
  }));



  // HANDLE FORM INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target
    setNewEvent({ ...newEvent, [name]: value })
  };



  // ADD AN EVENT TO MONGODB 
  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill out all fields before adding event.')
      return
    }
    const event = {
      title: newEvent.title,
      start: new Date(newEvent.start), 
      end: new Date(newEvent.end),
    }

    try {
      const headers = await getAuthHeaders();
      const res = await axios.post(`${API_BASE_URL}/api/events`, event, { headers })
      setEvents([...events, res.data.data]) // Update state with new event
    } catch (error) {
      console.error('Error adding event:', error)
    }
    handleClose(); // Close the modal after adding event
  };


  // fxn to style events
  const eventStyleGetter = () => ({
     style: {
      backgroundColor: '#f7d6e7',
      color: 'purple',
      borderRadius: '5px',
      border: 'solid 1px purple',
      padding: '5px'
    },
  });

  return (
    <div className='container mt-4'>
      <style type='text/css'>
       {`
        .createEventBtn {
          background-color: #ffc0cb;
          border: none;
          color: #813e8e;
          font-size: 20px;
          opacity: .7;

          font-family: "Emilys Candy", serif;
          font-weight: 900;
          font-style: bold;
        }
       
       `}
      </style>
      <div className="calenderMainCont">
        {showCreateButton && (
          <Button className='createEventBtn div2 shadow munyun-btn' variant='primary' onClick={handleShow}>
            Create Event
          </Button>
        )}

    <Calendar className='calendarCont div4'
    localizer={localizer} 
    events={events} 
    startAccessor="start" 
    endAccessor="end" 
    // selectable
    // onSelectSlot={handleSelectSlot} 
    eventPropGetter={eventStyleGetter}
    style={{ height: 500, margin: '20px' }} 
    />

    </div>
      

    {/* Modal for creating events */}
    <Modal show={showModal} onHide={handleClose} contentClassName="munyun-modal-content">
      <Modal.Header closeButton>
        <Modal.Title className="munyun-modal-title">Create New Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Event Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleChange}
              placeholder="Enter event title"
              className="munyun-input"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleChange}
              className="munyun-input"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              value={newEvent.end}
              onChange={handleChange}
              className="munyun-input"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button className="munyun-btn munyun-btn--ghost" variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="munyun-btn" variant="primary" onClick={handleAddEvent}>
          Add Event
        </Button>
      </Modal.Footer>
    </Modal>

    </div>
  )
})

  

export default MyCalendar;
