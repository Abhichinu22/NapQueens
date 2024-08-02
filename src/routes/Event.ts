import { Router, Request, Response } from 'express';
import Event, { IEvent } from '../models/Event';

const router: Router = Router();

const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    res.status(400).json({ error: error.message });
  } else {
    console.error('Unknown error:', error);
    res.status(400).json({ error: 'An unknown error occurred' });
  }
};

// Create a new event
router.post('/', async (req: Request, res: Response) => {
  const { name, date, totalTickets } = req.body;
  try {
    const event: IEvent = new Event({ name, date, totalTickets });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    handleError(error, res);
  }
});

// Retrieve a list of events with available tickets
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    handleError(error, res);
  }
});

// Retrieve details of a specific event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
