import mongoose from 'mongoose';

import { Applyment, Jobber, Announcement } from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  NotFound,
  Unauthorized,
} from '@job-guetter/api-core/utils/errors';

export const create = async (req, res) => {
  const annId = assert(req.body.announcementId,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );
  const applymentInfo = assert(req.body.applyment,
    BadRequest('invalid_request')
  );

  const jobber = assert(
    await Jobber.findOne({ _id: req.decoded.user_id }),
    NotFound('applyment_not_found')
  );

  const announcement = assert(
    await Announcement.findOne({ _id: annId }),
    NotFound('announcement_not_found')
  );

  await Applyment.from({
    ...applymentInfo,
    announcement,
    jobber,
  });

  res.json({ created: true });
};

export const get = async (req, res) => {
  const applymentId = assert(req.params.id,
    BadRequest('wrong_applyment_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const applyment = assert(
    await Applyment.findOne({ _id: applymentId })
      .populate({
        path: 'announcement',
        populate: {
          path: 'recruiter',
          select: ['user'],
        },
      }),
    NotFound('applyment_not_found')
  );

  const type = req.decoded.type;
  const user = req.decoded.user_id.toString();
  const recruiter = applyment.announcement.recruiter.user.toString();

  if (
    type === 'TYPE_RECRUITER'
      ? recruiter !== user
      : applyment.jobber.toString() !== user
  ) {
    throw Unauthorized('access_denied');
  }

  res.json({ applyment });
};

export const getAll = async (req, res) => {
  const applyments = await Applyment.find({ jobber: req.decoded.user_id });

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
      jobber: req.decoded.user_id,
    }),
    NotFound('applyment_not_found')
  );

  await applyment.remove();

  res.json({ deleted: true });

};
