import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: string;
  eventId: string;
  quantity: number;
  timestamp: Date;
}

const BookingSchema: Schema = new Schema({
  userId: { type: String, required: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
