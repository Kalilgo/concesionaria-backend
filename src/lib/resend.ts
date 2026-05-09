import { Resend } from 'resend';
import { env } from '../config/env.js';

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    throw new Error(
      'Missing RESEND_API_KEY. Set it in the environment to send emails.'
    );
  }
  return new Resend(env.RESEND_API_KEY);
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  if (!env.RESEND_API_KEY) {
    console.log('Email would be sent:', { to, subject });
    return { success: true };
  }
  const resend = getResendClient();
  return resend.emails.send({
    from: 'Concesionaria <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
};
