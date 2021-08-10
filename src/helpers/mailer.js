'use strict';

const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');
import pug from 'pug';
import juice from 'juice';
import '../config/global';

// const env = global.config.common.env;
const smtpConfig = global.config.development.mail;

const transport = nodemailer.createTransport({
  host: smtpConfig.host,
  port: smtpConfig.port,
  secure: smtpConfig.port === 465,
  auth: {
    user: smtpConfig.username,
    pass: smtpConfig.password,
  },
});

export const sendMail = async (options = {}) => {
  let { from = smtpConfig.sender, to, subject, html } = options;

  //if to is an array, convert to comma-separated
  if (Array.isArray(to)) {
    to = to.join(', ');
  }

  //generate html from template
  if (!html) {
    html = generateHtml(options.template, options);
  }

  //convert html to text
  const text = htmlToText(html);

  const mailOptions = { from, to, subject, html, text };
  const sent = await transport.sendMail(mailOptions);

  // console.log(sent);
  if (sent.messageId) return true;
};

/**
 * Generate the html from a pug view template
 * @param {string} template - the pug template to generate from
 * @param {object} options - options to pass to the template
 */
const generateHtml = (template, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../../views/email/${template}.pug`,
    options
  );
  const result = juice(html, {
    removeStyleTags: true, //remove the original <style></style> tags
    preserveImportant: true, //preserve !important in values
  });
  return result;
};
