const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  date: String,
  description: String,
  amount: Number,
  type: { type: String, enum: ['credit', 'debit'] },
  category: String,
});

const profileSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    dob: String,
    pan: { type: String, uppercase: true, trim: true },
    aadhaar: String,
    fatherName: String,
    address: {
      flatNo: String,
      premisesName: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    bank: {
      bankName: String,
      accountHolderName: String,
      accountNo: String,
      ifsc: String,
      accountType: { type: String, enum: ['Savings', 'Current'], default: 'Savings' },
      isLinked: { type: Boolean, default: false },
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    notifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    autoSync: { type: Boolean, default: true },
    lowBalanceAlert: { type: Boolean, default: true },
    theme: { type: String, default: 'dark' },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    language: { type: String, default: 'English' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  annualIncome: { type: Number, default: 0 },
  investments80C: { type: Number, default: 0 },
  transactions: [transactionSchema],
  createdAt: { type: Date, default: Date.now },

  profile: {
    type: profileSchema,
    default: () => ({
      fullName: '',
      email: '',
      phone: '',
      dob: '',
      pan: '',
      aadhaar: '',
      fatherName: '',
      address: {
        flatNo: '',
        premisesName: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
      },
      bank: {
        bankName: '',
        accountHolderName: '',
        accountNo: '',
        ifsc: '',
        accountType: 'Savings',
        isLinked: false,
      },
      emergencyContact: {
        name: '',
        phone: '',
        relation: '',
      },
    }),
  },

  settings: {
    type: settingsSchema,
    default: () => ({
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      autoSync: true,
      lowBalanceAlert: true,
      theme: 'dark',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      language: 'English',
    }),
  },

  itrProfile: {
    pan: { type: String, uppercase: true, trim: true },
    dob: String,
    fatherName: String,
    address: {
      flatNo: String,
      premisesName: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    bankAccount: {
      accountNo: String,
      ifsc: String,
      accountType: { type: String, enum: ['Savings', 'Current'], default: 'Savings' },
    },
    assessmentYear: { type: String, default: '2026-27' },
  },
});

module.exports = mongoose.model('User', userSchema);