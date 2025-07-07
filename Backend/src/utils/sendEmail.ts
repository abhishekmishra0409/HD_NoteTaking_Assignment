import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASS!,
        },
    });

    const mailOptions = {
        from: `Note App <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
};
