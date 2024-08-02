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
const Event_1 = __importDefault(require("../models/Event"));
const router = (0, express_1.Router)();
const handleError = (error, res) => {
    if (error instanceof Error) {
        console.error('Error:', error.message);
        res.status(400).json({ error: error.message });
    }
    else {
        console.error('Unknown error:', error);
        res.status(400).json({ error: 'An unknown error occurred' });
    }
};
// Create a new event
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, date, totalTickets } = req.body;
    try {
        const event = new Event_1.default({ name, date, totalTickets });
        yield event.save();
        res.status(201).json(event);
    }
    catch (error) {
        handleError(error, res);
    }
}));
// Retrieve a list of events with available tickets
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield Event_1.default.find();
        res.status(200).json(events);
    }
    catch (error) {
        handleError(error, res);
    }
}));
// Retrieve details of a specific event
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event_1.default.findById(req.params.id);
        if (!event)
            return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(event);
    }
    catch (error) {
        handleError(error, res);
    }
}));
exports.default = router;
