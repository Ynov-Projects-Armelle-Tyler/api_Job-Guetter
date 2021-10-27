import mongoose from 'mongoose';

import { MONGODB_URI, TEST } from '../utils/env';

const MongoDB = async app => {
  mongoose.Promise = global.Promise;
  await mongoose.connect(TEST ? global.__MONGO_URI__ : MONGODB_URI, {

    // Mongoose 4
    useMongoClient: true,
    autoIndex: false,
  });

  /* istanbul ignore next: cannot test disconnect in dev/test mode */
  process.on('SIGTERM', () => mongoose.disconnect());

  /* istanbul ignore next: same same */
  // app.events.on('close', () => mongoose.disconnect());

  app.set('MongoDB', mongoose);
};

MongoDB.disconnect = async () => {
  await mongoose.disconnect();
};

export default MongoDB;
