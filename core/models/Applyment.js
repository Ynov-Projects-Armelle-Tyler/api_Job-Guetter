import mongoose from 'mongoose';

const Applyment = new mongoose.Schema({

  jobber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobber',
  },

  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Announcement',
  },

  cv: {
    type: String,
    default: '',
  },

  skills: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

}, {
  shardKey: {
    _id: 'hashed',
  },
});

Applyment.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('Applyment', Applyment);
