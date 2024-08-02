"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_1 = __importDefault(require("../models/booking"));
const Event_1 = __importDefault(require("../models/Event"));
const router = (0, express_1.Router)();
// Book tickets for an event
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, eventId, quantity } = req.body;
    if (quantity > 15) {
        return res.status(400).json({ error: 'Cannot book more than 15 tickets per request' });
    }
    try {
        const event = yield Event_1.default.findById(eventId);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        if (event.totalTickets - event.bookedTickets < quantity) {
            return res.status(400).json({ error: 'Not enough tickets available' });
        }
        const booking = new booking_1.default({ userId, eventId, quantity });
        yield booking.save();
        event.bookedTickets += quantity;
        yield event.save();
        res.status(201).json(booking);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
}));
// Cancel a booking by ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_1.default.findByIdAndDelete(req.params.id);
        if (!booking)
            return res.status(404).json({ error: 'Booking not found' });
        const event = yield Event_1.default.findById(booking.eventId);
        if (event) {
            event.bookedTickets -= booking.quantity;
            yield event.save();
        }
        res.status(200).json({ message: 'Booking cancelled' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
}));
exports.default = router;
