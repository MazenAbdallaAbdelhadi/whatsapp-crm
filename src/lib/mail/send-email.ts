// import "server-only";

// import { Resend } from "resend";
import nodemailer from "nodemailer";

// const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
    host: "gmail",
    auth: {
        type: "OAuth2",
        user: "mazen.abdallah.abdalhady@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
});

export const sendEmail = async ({
    to,
    subject,
    html,
    text,
}: {
    to: string
    subject: string
    html: string
    text: string
}) => {
    await transporter.sendMail({
        from: "mazen.abdallah.abdalhady@gmail.com",
        to,
        subject,
        html,
        text,
    });
};

