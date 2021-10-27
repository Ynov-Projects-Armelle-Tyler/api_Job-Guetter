import mongoose from 'mongoose';

const User = new mongoose.Schema({

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },

  first_name: {
    type: String,
    default: '',
  },

  last_name: {
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

User.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('User', User);
