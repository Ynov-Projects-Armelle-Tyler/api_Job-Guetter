import { genSalt, hash } from 'bcrypt';
import mongoose from 'mongoose';

const Account = new mongoose.Schema({

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ['jobber', 'recruiter', 'company'],
    required: true,
  },

  salt: {
    type: String,
    default: '',
  },

  access_token: {
    type: String,
  },

  refresh_token: {
    type: String,
  },

  refresh_token_salt: {
    type: String,
  },

}, {
  shardKey: {
    _id: 'hashed',
  },
});

Account.statics.TYPE_JOBBER = 'TYPE_JOBBER';
Account.statics.TYPE_RECRUITER = 'TYPE_RECRUITER';
Account.statics.TYPE_COMPANY = 'TYPE_COMPANY';

Account.statics.AVAILABLE_TYPES = [
  Account.statics.TYPE_JOBBER,
  Account.statics.TYPE_RECRUITER,
  Account.statics.TYPE_COMPANY,
];

Account.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.salt = await genSalt(10);
    this.password = await hash(this.password, this.salt);
  }

  next();
});

Account.statics.from = function (opts) {
  return new this(opts);
};

Account.methods.genSalt = async function () {
  return await genSalt(10);
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
