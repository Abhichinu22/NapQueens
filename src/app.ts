import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import eventRoutes from './routes/Event';
import bookingRoutes from './routes/booking';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/events', eventRoutes);
app.use('/bookings', bookingRoutes);

mongoose.connect('mongodb://localhost:27017/event-booking-system')
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database connection error', err);
  });

export default app;
