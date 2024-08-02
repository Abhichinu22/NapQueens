import { Router, Request, Response } from 'express';
import Booking, { IBooking } from '../models/booking';
import Event from '../models/Event';

const router: Router = Router();

// Book tickets for an event
router.post('/', async (req: Request, res: Response) => {
  const { userId, eventId, quantity } = req.body;

  if (quantity > 15) {
    return res.status(400).json({ error: 'Cannot book more than 15 tickets per request' });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.totalTickets - event.bookedTickets < quantity) {
      return res.status(400).json({ error: 'Not enough tickets available' });
    }

    const booking: IBooking = new Booking({ userId, eventId, quantity });
    await booking.save();

    event.bookedTickets += quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

// Cancel a booking by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const event = await Event.findById(booking.eventId);
    if (event) {
      event.bookedTickets -= booking.quantity;
      await event.save();
    }

    res.status(200).json({ message: 'Booking cancelled' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

export default router;
