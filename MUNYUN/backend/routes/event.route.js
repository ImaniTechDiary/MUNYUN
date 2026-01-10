import express from "express";
import { createEvent, deleteEvent, getEvents, updateEvent } from "../controllers/event.controller.js";

const eventRouter = express.Router();

eventRouter.get("/", getEvents);
eventRouter.post("/", createEvent);
eventRouter.put("/:id", updateEvent);
eventRouter.delete("/:id", deleteEvent);

export default eventRouter;
