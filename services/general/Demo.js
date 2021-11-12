/* eslint-disable max-len */
/*eslint-disable no-unused-vars*/
import {
  Account,
  Recruiter,
  Company,
  JobAnnouncement,
  JobApplyement,
  Jobber,
  User,
} from '@job-guetter/api-core/models';
import { Forbidden } from '@job-guetter/api-core/utils/errors';
import { load } from '@job-guetter/api-core/views';

export const send = async (req, res) => {

  if (!__DEV__) {
    throw Forbidden();
  }

  req.app.get('Sendgrid').send({
    from: {
      email: 'tyler.escolano@ynov.com',
      name: 'Job Guetter',
    },
    to: 'escolano.tyler@gmail.com',
    subject: 'Recruiter break his link',
    body: load('emails/demo', { company: 'Ynov' }),
  });

  res.json({ send: true });
};

export const feed = async (req, res) => {

  if (!__DEV__) {
    throw Forbidden();
  }

  // Jobbers
  const aj1 = await Account.from({ email: 'j1@gmail.com', password: 'mdp', type: 'TYPE_JOBBER' }).save();
  const aj2 = await Account.from({ email: 'j2@gmail.com', password: 'mdp', type: 'TYPE_JOBBER' }).save();
  const aj3 = await Account.from({ email: 'j3@gmail.com', password: 'mdp', type: 'TYPE_JOBBER' }).save();

  const uj1 = await User.from({ first_name: 'Jo', last_name: 'Di', account: aj1 }).save();
  const uj2 = await User.from({ first_name: 'Po', last_name: 'Lo', account: aj2 }).save();
  const uj3 = await User.from({ first_name: 'Sa', last_name: 'My', account: aj3 }).save();

  const j1 = await Jobber.from({ user: uj1, description: 'My f***** description', skills: ['Strong', 'Kind', 'Crazy as a loon'], web_site: 'https://shtick.be/', linkedin: 'https://www.linkedin.com/in/tyler-escolano-aa76a2193/', cv: 'https://www.modeles-de-cv.com/wp-content/uploads/2021/01/180-modele-cv-attractif.jpg' }).save();
  const j2 = await Jobber.from({ user: uj2, description: 'My f***** description', skills: ['Strong', 'Kind', 'Crazy as a loon'], web_site: 'https://shtick.be/', linkedin: 'https://www.linkedin.com/in/tyler-escolano-aa76a2193/', cv: 'https://www.modeles-de-cv.com/wp-content/uploads/2021/01/180-modele-cv-attractif.jpg' }).save();
  const j3 = await Jobber.from({ user: uj3, description: 'My f***** description', skills: ['Strong', 'Kind', 'Crazy as a loon'], web_site: 'https://shtick.be/', linkedin: 'https://www.linkedin.com/in/tyler-escolano-aa76a2193/', cv: 'https://www.modeles-de-cv.com/wp-content/uploads/2021/01/180-modele-cv-attractif.jpg' }).save();

  // Companies
  const ac1 = await Account.from({ email: 'c1@gmail.com', password: 'mdp', type: 'TYPE_COMPANY' }).save();
  const ac2 = await Account.from({ email: 'c2@gmail.com', password: 'mdp', type: 'TYPE_COMPANY' }).save();
  const ac3 = await Account.from({ email: 'c3@gmail.com', password: 'mdp', type: 'TYPE_COMPANY' }).save();

  const c1 = await Company.from({ account: ac1, siren: 530562115, name: 'Ynov', logo: 'https://ynov-toulouse.com/wp-content/uploads/2018/06/logo_ynov_campus_toulouse_rvb_blanc-400x252.png', cover: 'https://ynov-toulouse.com/wp-content/uploads/2018/06/logo_ynov_campus_toulouse_rvb_blanc-400x252.png', localisation: '89 Quai des Chartrons, 33300 Bordeaux',
    activity_area: 'education', year_birth: '2016-05-18T16:00:00Z', employees: 22, description: 'Yolo description', web_site: 'https://www.ynov.com/', social: { linkedin: 'https://www.linkedin.com/company/y-nov/?originalSubdomain= awaitfr' } }).save();
  const c2 = await Company.from({ account: ac2, siren: 530562115, name: 'Autre Ynov', logo: 'https://ynov-toulouse.com/wp-content/uploads/2018/06/logo_ynov_campus_toulouse_rvb_blanc-400x252.png', cover: 'https://ynov-toulouse.com/wp-content/uploads/2018/06/logo_ynov_campus_toulouse_rvb_blanc-400x252.png', localisation: '89 Quai des Chartrons, 33300 Bordeaux',
    activity_area: 'education', year_birth: '2016-05-18T16:00:00Z', employees: 22, description: 'Yolo description', web_site: 'https://www.ynov.com/', social: { linkedin: 'https://www.linkedin.com/company/y-nov/?originalSubdomain= awaitfr' } }).save();
  const c3 = await Company.from({ account: ac3, siren: 530562115, name: 'Encore Ynov', logo: 'https://ynov-toulouse.com/wp-content/uploads/2018/06/logo_ynov_campus_toulouse_rvb_blanc-400x252.png', cover: 'https://ynov-toulouse.com/wp-content/uploads/2018/06/logo_ynov_campus_toulouse_rvb_blanc-400x252.png', localisation: '89 Quai des Chartrons, 33300 Bordeaux',
    activity_area: 'education', year_birth: '2016-05-18T16:00:00Z', employees: 22, description: 'Yolo description', web_site: 'https://www.ynov.com/', social: { linkedin: 'https://www.linkedin.com/company/y-nov/?originalSubdomain= awaitfr' } }).save();

  // Recruiters
  const ar1 = await Account.from({ email: 'r1@gmail.com', password: 'mdp', type: 'TYPE_RECRUITER' }).save();
  const ar2 = await Account.from({ email: 'r2@gmail.com', password: 'mdp', type: 'TYPE_RECRUITER' }).save();
  const ar3 = await Account.from({ email: 'r3@gmail.com', password: 'mdp', type: 'TYPE_RECRUITER' }).save();

  const ur1 = await User.from({ first_name: 'Pa', last_name: 'Blo', account: ar1 }).save();
  const ur2 = await User.from({ first_name: 'Mich', last_name: 'Elle', account: ar2 }).save();
  const ur3 = await User.from({ first_name: 'Cor', last_name: 'Ona', account: ar3 }).save();

  const r1 = await Recruiter.from({ user: ur1, company: c1, status: true }).save();
  const r2 = await Recruiter.from({ user: ur2, company: c1, status: true }).save();
  const r3 = await Recruiter.from({ user: ur3, company: c1, status: false }).save();
  const r4 = await Recruiter.from({ user: ur3, company: c2, status: true }).save();
  const r5 = await Recruiter.from({ user: ur1, company: c3, status: false }).save();

  // JobAnnouncement
  const jAn1 = await JobAnnouncement.from({ company: c1, recruiter: r1, name: 'Some job', activity_field: 'tech', contract_type: 'CDI', localisation: '89 Quai des Chartrons, 33300 Bordeaux', job_start: '2021-05-18T16:00:00Z', job_description: 'Well as you want', missions: ['As', 'You', 'Want'], profile: 'SOSO',
    salary: 3800, seen: 12, deleted: false }).save();
  const jAn2 = await JobAnnouncement.from({ company: c2, recruiter: r3, name: 'Other Some job', activity_field: 'tech', contract_type: 'CDI', localisation: '89 Quai des Chartrons, 33300 Bordeaux', job_start: '2021-05-18T16:00:00Z', job_description: 'Well as you want', missions: ['As', 'You', 'Want'], profile: 'SOSO',
    salary: 3800, seen: 12, deleted: true }).save();
  const jAn3 = await JobAnnouncement.from({ company: c1, recruiter: r2, name: 'Again Some job', activity_field: 'tech', contract_type: 'CDI', localisation: '89 Quai des Chartrons, 33300 Bordeaux', job_start: '2021-05-18T16:00:00Z', job_description: 'Well as you want', missions: ['As', 'You', 'Want'], profile: 'SOSO',
    salary: 3800, seen: 12, deleted: false }).save();

  // JobApplyement
  const jAp1 = await JobApplyement.from({ jobber: j1, job_announcement: jAn1, cv: 'https://www.modeles-de-cv.com/wp-content/uploads/2020/01/120-modele-cv-francais.jpg', skills: 'Don\'t', description: 'Pleas stop desc' }).save();
  const jAp2 = await JobApplyement.from({ jobber: j2, job_announcement: jAn2, cv: 'https://www.modeles-de-cv.com/wp-content/uploads/2020/01/120-modele-cv-francais.jpg', skills: 'Don\'t', description: 'Pleas stop desc' }).save();
  const jAp3 = await JobApplyement.from({ jobber: j3, job_announcement: jAn2, cv: 'https://www.modeles-de-cv.com/wp-content/uploads/2020/01/120-modele-cv-francais.jpg', skills: 'Don\'t', description: 'Pleas stop desc' }).save();

  res.json({ created: true });
};
