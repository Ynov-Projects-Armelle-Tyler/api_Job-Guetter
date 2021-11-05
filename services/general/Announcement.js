import mongoose from 'mongoose';

import {
  Recruiter,
  Announcement,
  Company,
} from '@job-guetter/api-core/models';
import { assert } from '@job-guetter/api-core/utils/assert';
import {
  BadRequest,
  NotFound,
  Unauthorized
} from '@job-guetter/api-core/utils/errors';

export const create = async (req, res) => {
  const announcementInfo = assert(req.body.announcement,
    BadRequest('invalid_request')
  );
  const recruiter = req.decoded.id;
  const company = await Company.findOne({ name: announcementInfo.company });

  const isCompanyRecruiter = await Recruiter.findOne({ recruiter, company });

  if (!isCompanyRecruiter) {
    Unauthorized('not_allowed');
  }

  const announcement = await Announcement.from({ announcementInfo });

  await announcement.save();

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
  const companies = await Announcement.find();
  res.json({ companies });
};

export const update = async (req, res) => {
  const announcementId = assert(req.params.id,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );
  const announcementInfo = assert(req.body.announcement,
    BadRequest('invalid_request')
  );

  const announcement = assert(
    await Announcement.findOne({
      _id: announcementId,
      recruiter: req.decoded._id
    }),
    NotFound('announcement_not_found')
  );

  Object.assign(announcement, announcementInfo);

  await announcement.save();

  res.json({ updated: true });
};

export const remove = async (req, res) => {
  const announcementId = assert(req.params.id,
    BadRequest('wrong_announcement_id'),
    val => mongoose.Types.ObjectId.isValid(val)
  );

  assert(
    await Announcement.findOneAndUpdate({ _id: announcementId, deleted: true }),
    NotFound('announcement_not_found')
  );

  res.json({ deleted: true });
};
