import mongoose from 'mongoose';

const Recruiter = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },

  status: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

});

Recruiter.statics.from = function (opts = {}) {
  return new this(opts);
};

export default mongoose.model('Recruiter', Recruiter);
