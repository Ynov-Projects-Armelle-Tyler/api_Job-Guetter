import mongoose from 'mongoose';

const JobAnnouncement = new mongoose.Schema({

  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },

  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
  },

  name: {
    type: String,
    default: '',
  },

  activity_field: {
    type: String,
    default: '',
  },

  contract_type: {
    type: String,
    default: '',
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

JobAnnouncement.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('JobAnnouncement', JobAnnouncement);
