import mongoose from 'mongoose';

// Define the blueprint for a Hostel Room
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerMonth: { type: Number, required: true },
  isBooked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Room', roomSchema);