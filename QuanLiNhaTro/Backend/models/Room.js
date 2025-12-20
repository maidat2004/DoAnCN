import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance'],
    default: 'available'
  },
  description: {
    type: String,
    default: ''
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  currentTenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  }]
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
