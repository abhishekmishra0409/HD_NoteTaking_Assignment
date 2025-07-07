const generateOTP = (): { otp: string; expires: Date } => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // OTP expires in 10 minutes

    return { otp, expires };
};

export { generateOTP };