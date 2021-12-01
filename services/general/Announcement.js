import mongoose from 'mongoose';

import {
  Recruiter,
  Announcement,
  Applyment,
} from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  NotFound,
  Unauthorized,
} from '@job-guetter/api-core/utils/errors';

export const create = async (req, res) => {
  const annInfos = assert(req.body.announcement, BadRequest('invalid_request'));
  const companyId = assert(req.body.companyId,
    BadRequest('wrong_company_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const recruiter = assert(
    await Recruiter.findOne({
      user: req.decoded.user_id,
      company: companyId,
    }),
    NotFound('recruiter_not_found')
  );

  if (!recruiter.status) {
    throw Unauthorized('recruiter_disable');
  }

  await Announcement.from({
    ...annInfos,
    recruiter,
    company: recruiter.company,
  }).save();

  res.json({ created: true });
};

export const get = async (req, res) => {
  const announcementId = assert(req.params.id,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const announcement = assert(
    await Announcement.findOne({ _id: announcementId }),
    NotFound('announcement_not_found')
  );

  res.json({ announcement });
};

export const getAll = async (req, res) => {
  const announcements = await Announcement.find();

  res.json({ announcements });
};

export const update = async (req, res) => {
  const announcementId = assert(req.params.id,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );
  const annInfos = assert(req.body.announcement, BadRequest('invalid_request'));

  const announcement = assert(
    await Announcement.findOne({ _id: announcementId }),
    NotFound('announcement_not_found')
  );

  const recruiter = assert(
    await Recruiter.findOne({
      user: req.decoded.user_id,
      company: announcement.company,
    }),
    NotFound('recruiter_not_found')
  );

  if (!recruiter.status) {
    throw Unauthorized('recruiter_disable');
  }

  Object.assign(announcement, annInfos);

  await announcement.save();

  res.json({ announcement });
};

export const archive = async (req, res) => {
  const announcementId = assert(req.params.id,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const ann = assert(
    await Announcement.findOne({
      _id: announcementId,
      deleted: false,
    }),
    NotFound('announcement_not_found')
  );

  ann.deleted = true;

  res.json({ deleted: true });
};

export const getAllApplyment = async (req, res) => {
  const announcementId = assert(req.params.id,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  const announcement = assert(
    await Announcement.findOne({ _id: announcementId }),
    NotFound('announcement_not_found')
  );

  const applyments = await Applyment.find({ announcement });

  res.json({ applyments });
};
