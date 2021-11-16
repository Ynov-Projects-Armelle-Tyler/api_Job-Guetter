import { resolve } from 'path';
import { readFileSync } from 'fs';

import mjml2html from 'mjml';

export const asHtml = mjml => {
  return mjml2html(
    readFileSync(resolve(`./core/views/${mjml}.mjml`), 'utf8')
  ).html;
};

export const load = (template, replace = {}) =>
  Object
    .entries(replace)
    .reduce((content, [k, v]) => {
      return content.replace(
        new RegExp(`{{\\s{0,}${k}\\s{0,}}}`, 'g'),
        v
      );
    }, asHtml(template) || '');
