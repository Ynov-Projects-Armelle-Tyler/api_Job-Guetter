import mongoose from 'mongoose';

const Jobber = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  cv: {
    type: String,
    default: '',
  },

  linkedin: {
    type: String,
    default: '',
  },

  web_site: {
    type: String,
    default: '',
  },

  skills: [{
    type: String,
    default: '',
  }],

  description: {
    type: String,
    default: '',
  },

}, {
  shardKey: {
    _id: 'hashed',
  },
  usePushEach: true,
});

Jobber.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('Jobber', Jobber);
