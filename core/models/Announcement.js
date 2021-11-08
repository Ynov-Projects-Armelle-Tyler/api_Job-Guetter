import mongoose from 'mongoose';

const Announcement = new mongoose.Schema({

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },

  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: false,
  },

  name: {
    type: String,
    required: true,
  },

  activity_field: {
    type: String,
    default: '',
  },

  contract_type: {
    type: String,
    enum: ['CDI', 'CDD', 'freelance'],
    required: true,
  },

  localisation: {
    type: String,
    default: '',
  },

  job_start: {
    type: Date,
    default: Date.now,
  },

  job_description: {
    type: String,
    default: '',
  },

  missions: [{
    type: String,
    default: '',
  }],

  profile: {
    type: String,
    default: '',
  },

  salary: {
    type: String,
    default: '',
  },

  seen: {
    type: Number,
    default: 0,
  },

  deleted: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

}, {
  shardKey: {
    _id: 'hashed',
  },
  usePushEach: true,
});

Announcement.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('Announcement', Announcement);
