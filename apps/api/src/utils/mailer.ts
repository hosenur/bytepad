import { env } from '@/config';
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.forwardemail.net',
    port: 465,
    secure: true,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});


export default transporter;
