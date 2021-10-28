import mongoose from 'mongoose';

const Company = new mongoose.Schema({

  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },

  siren: {
    type: Number,
  },

  name: {
    type: String,
    required: true,
  },

  logo: {
    type: String,
    required: false,
  },

  cover: {
    type: String,
    required: false,
  },

  localisation: {
    type: String,
    default: '',
  },

  activity_area: {
    type: String,
    enum: [
      'architecture and engineering',
      'arts, culture and entertainment',
      'business, management and administration',
      'communications',
      'community and social services',
      'education',
      'science and technology',
      'agriculture',
      'governement',
      'law and public policy',
      'health and medicine',
      'sales',
    ],
    required: true,
  },

  year_birth: {
    type: Date,
    required: false,
  },

  employees: {
    type: Number,
    default: 0,
  },

  video: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  web_site: {
    type: String,
    default: '',
  },

  social: {
    linkedin: String,
    facebook: String,
    instagram: String,
    twitter: String,
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

Company.statics.from = function (opts) {
  return new this(opts);
};

export default mongoose.model('Company', Company);
