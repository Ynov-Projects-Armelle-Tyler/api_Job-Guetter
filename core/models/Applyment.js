import mongoose from 'mongoose';

const JobApplyment = new mongoose.Schema({

  jobber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobber',
  },

  job_announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobAnnouncement',
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

JobApplyment.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('JobApplyment', JobApplyment);
