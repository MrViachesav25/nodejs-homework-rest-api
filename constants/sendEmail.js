import nodemailer from 'nodemailer';
import 'dotenv/config';

const { META_ADDRESS, META_PASS } = process.env;

const nodemailerConfig = {
    to: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
        user: META_ADDRESS,
        pass: META_PASS,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = { ...data, from: META_ADDRESS };
    return transport.sendEmail(email);
}

export default sendEmail;