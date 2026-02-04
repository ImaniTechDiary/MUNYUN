import Event from '../models/event.model.js';
import mongoose from 'mongoose';


// GET ALL EVENTS
export const getEvents = async (req, res) => {
    try {
        const userId = req.user?.uid;
        const query = userId
            ? { userId }
            : { $or: [{ userId: { $exists: false } }, { userId: null }, { userId: 'demo' }] };
        const events = await Event.find(query)
        res.status(200).json({ success: true, data: events })
    }   catch (error){
        console.error('Error fetching events:', error.message)
        res.status(500).json({ success: false, message: 'Server error: '})
    }
};


// CREATE A NEW EVENT
export const createEvent = async (req, res) => {
    const {title, start, end} = req.body

    if (!title || !start || !end) {
        return res.status(400).json({ success: false, message: 'All fields are required'})
    }

    try {
        const userId = req.user?.uid || 'demo';
        const newEvent = new Event({ title, start, end, userId })
        await newEvent.save()
        res.status(201).json({ success: true, data: newEvent })
    }   catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
};


// UPDATE AN EVENT
export const updateEvent = async (req, res) => {
    const {id } = req.params
    const {title, start, end} = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid event ID' })
    }

    try {
        const userId = req.user?.uid;
        const query = userId
            ? { _id: id, userId }
            : { _id: id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: 'demo' }] };
        const updatedEvent = await Event.findOneAndUpdate(query, { title, start, end}, { new: true })
        res.status(200).json({ success: true, data: updatedEvent })
    }   catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}


// DELETE AN EVENT
export const deleteEvent = async (req, res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: 'Invalid event ID' })
    }

    try {
        const userId = req.user?.uid;
        const query = userId
            ? { _id: id, userId }
            : { _id: id, $or: [{ userId: { $exists: false } }, { userId: null }, { userId: 'demo' }] };
        await Event.findOneAndDelete(query)
        res.status(200).json({ success: true, message: 'Event deleted successfully'})
    }   catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}
