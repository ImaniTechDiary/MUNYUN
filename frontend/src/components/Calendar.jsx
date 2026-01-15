import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // import axios for API calls





const localizer = momentLocalizer(moment);

const MyCalendar = () => {
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
      const res = await axios.get("http://localhost:8000/api/events");
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
      const res = await axios.post('http://localhost:8000/api/events', event)
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
        <Button className='createEventBtn div2 shadow' variant='primary' onClick={handleShow}>
        Create Event
      </Button>

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
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Event</Modal.Title>
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
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              value={newEvent.end}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleAddEvent}>
          Add Event
        </Button>
      </Modal.Footer>
    </Modal>

    </div>
  )
}

  

export default MyCalendar;
