import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  contractNumber: {
    type: String,
    required: true,
    unique: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  deposit: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Number,
    default: 5
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated'],
    default: 'active'
  },
  terms: {
    type: String
  },
  specialConditions: {
    type: String
  },
  signedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
