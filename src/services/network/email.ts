import nodemailer from "nodemailer";
import config from "../../config";
import {
  verificationEmailTemplate,
  urlStatusEmailTemplate,
} from "../../constants/eTemplates";
import defaultLogger from "../../core/logger";
let mailTransporter = nodemailer.createTransport({
  auth: {
    user: config.systemEmail,
    pass: config.systemEmailPassword,
  },
  service: "gmail",
});

export const sendVerificationEMail = async ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  const mailOptions = {
    from: config.systemEmail,
    to: email,
    subject: "Bost task email verification",
    html: verificationEmailTemplate(code),
  };

  mailTransporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return defaultLogger.error(
        `Verification email failed to be sent to email ${email}`
      );
    } else defaultLogger.info(`Verification email has been sent to ${email}`);
  });
};

export const sendURLStatusEmail = async ({
  email,
  status,
  url,
}: {
  email: string;
  status: string;
  url: string;
}) => {
  const mailOptions = {
    from: config.systemEmail,
    to: email,
    subject: `Your URL is ${status}`,
    html: urlStatusEmailTemplate(url, status),
  };

  mailTransporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return defaultLogger.error(
        `Status email failed to be sent to email ${email}`
      );
    } else defaultLogger.info(`Status email has been sent to ${email}`);
  });
};
