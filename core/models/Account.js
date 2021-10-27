import { randomBytes, createHmac } from 'crypto';

import mongoose from 'mongoose';

const Account = new mongoose.Schema({

  email: {
    type: String,
    default: '',
  },

  password: {
    type: String,
    default: '',
  },

  type: {
    type: String,
    default: '',
  },

  salt: {
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

Account.statics.TYPE_JOBBER = 'TYPE_JOBBER';
Account.statics.TYPE_RECRUITER = 'TYPE_RECRUITER';
Account.statics.TYPE_COMPANY = 'TYPE_COMPANY';

Account.statics.AVAILABLE_TYPES = {
  TYPE_JOBBER: Account.statics.TYPE_JOBBER,
  TYPE_RECRUITER: Account.statics.TYPE_RECRUITER,
  TYPE_COMPANY: Account.statics.TYPE_COMPANY,
};

Account.pre('save', function (next) {
  if (this.isModified('password')) {
    this.salt = randomBytes(16).toString('hex');
    this.password = createHmac('sha256', this.salt)
      .update(this.password)
      .digest('hex');
  }

  next();
});

Account.statics.from = function (opts) {
  return new this(opts);
};

Account.methods.toJSON = function () {
  const res = this.toObject({ getters: true, virtuals: true, minimize: false });
  delete res.password;
  delete res.salt;

  return res;
};

Account.methods.whoIsIt = function () {
  return Account.statics.AVAILABLE_TYPES[this.type];
};

export default mongoose.model('Account', Account);
