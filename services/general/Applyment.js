import mongoose from 'mongoose';

import {
  Recruiter,
  Applyment,
  Company,
} from '@job-guetter/api-core/models';
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
  const jobber = req.decoded.id;

  const applyment = await Applyment.from({ jobber, applymentInfo });

  await applyment.save();

  res.json({ created: true });
};

export const get = async (req, res) => {
  const applymentId = assert(req.params.id,
    BadRequest('wrong_applyment_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const applyment = assert(
    await Applyment.findOne({ _id: applymentId }),
    NotFound('applyment_not_found')
  );

  res.json({ applyment });
};

export const getAll = async (req, res) => {
  const companies = await Applyment.find();
  res.json({ companies });
};

export const update = async (req, res) => {
  const applymentId = assert(req.params.id,
    BadRequest('wrong_applyment_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );
  const applymentInfo = assert(req.body.applyment,
    BadRequest('invalid_request')
  );

  const applyment = assert(
    await Applyment.findOne({
      _id: applymentId,
      recruiter: req.decoded._id
    }),
    NotFound('applyment_not_found')
  );

  Object.assign(applyment, applymentInfo);

  await applyment.save();

  res.json({ updated: true });
};

export const remove = async (req, res) => {
  const applymentId = assert(req.params.id,
    BadRequest('wrong_applyment_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  assert(
    await Applyment.findOneAndUpdate({ _id: applymentId, deleted: true }),
    NotFound('applyment_not_found')
  );

  res.json({ deleted: true });
};
