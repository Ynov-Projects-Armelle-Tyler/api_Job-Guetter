// import isEmail from '@job-guetter/api-core/utils/validate';
// import { Account } from '@job-guetter/api-core/models';
// import { assert } from '@job-guetter/api-core/utils/assert';
// import { BadRequest, Conflict } from '@job-guetter/api-core/utils/errors';
//
// export const register = async (req, res, next) => {
//   const email = assert(req.body.email, BadRequest('invalid_request'),
//    isEmail);
//   const password = assert(req.body.password, BadRequest('invalid_request'));
//   const type = assert(req.body.type, BadRequest('invalid_request'),
//     val => Account.AVAILABLE_TYPES.includes(val));
//
//   const exist = await Account.findOne({ email });
//
//   if (exist) {
//     throw Conflict('user_already_exists');
//   }
//
//   switch (type) {
//     case Account.TYPE_JOBBER:
//       try {
//         await createJobber(req, res);
//       } catch (e) {
//         next(e, req, res, next);
//       }
//
//       break;
//     case Account.TYPE_RECRUITER:
//       try {
//         await createRecruiter(req, res);
//       } catch (e) {
//         next(e, req, res, next);
//       }
//
//       break;
//     case Account.TYPE_COMPANY:
//       try {
//         await createCompany(req, res);
//       } catch (e) {
//         next(e, req, res, next);
//       }
//
//       break;
//     default:
//
//   }
//
//   const user = await Account.from({ email, password, type }).save();
//
//   res.json({ registered: true, user });
// };
//
// export const createJobber = async (req, res) => {
//   const jobber = assert(req.body.jobber, BadRequest('invalid_request'));
//
// };
//
// export const createRecruiter = async (req, res) => {
//   const recruiter = assert(req.body.recruiter,
//    BadRequest('invalid_request'));
//
// };
//
// export const createCompany = async (req, res) => {
//   const company = assert(req.body.company, BadRequest('invalid_request'));
//
// };
