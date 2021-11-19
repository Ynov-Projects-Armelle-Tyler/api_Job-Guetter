import mongoose from 'mongoose';

import { Applyment, Jobber } from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  NotFound,
  Unauthorized,
} from '@job-guetter/api-core/utils/errors';

export const create = async (req, res) => {
  const applymentInfo = assert(req.body.applyment,
    BadRequest('invalid_request')
  );

  const jobber = await Jobber.findOne({ _id: req.decoded.id });

  if (jobber) {
    const applyment = await Applyment.from({ jobber, applymentInfo });

    await applyment.save();

    res.json({ created: true });
  }
};

export const get = async (req, res) => {
  const applymentId = assert(req.params.id,
    BadRequest('wrong_applyment_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const applyment = assert(
    await Applyment.findOne({ _id: applymentId }).populate('Announcement'),
    NotFound('applyment_not_found')
  );

  const user = req.decoded.id;

  if (Applyment.jobber === user || Applyment.announcement.recruiter === user) {
    res.json({ applyment });
  } else {
    throw Unauthorized('access_denied');
  }
};

export const getAll = async (req, res) => {
  const applyments = await Applyment.find({ jobber: req.decoded.id });

  res.json({ applyments });
};

export const remove = async (req, res) => {
  const applymentId = assert(req.params.id,
    BadRequest('wrong_applyment_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const applyment = assert(
    await Applyment.findOne({
      _id: applymentId,
      jobber: req.decoded.id,
    }),
    NotFound('applyment_not_found')
  );

  if (applyment) {
    await Applyment.deleteOne({ _id: applymentId });

    res.json({ deleted: true });
  }
};
