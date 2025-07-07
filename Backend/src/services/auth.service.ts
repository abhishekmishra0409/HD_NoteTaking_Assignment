import User from '../models/user.model';
import { generateToken } from '../utils/generateToken';
import { generateOTP } from '../utils/generateOTP';
import { OAuth2Client } from 'google-auth-library';
import { config } from 'dotenv';
import { IUser } from '../interfaces/user.interface';
import {sendOTPEmail} from "../utils/sendEmail";

config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
    // Register with email and password
    async register(name: string, email: string, password: string) {
        const userExists = await User.findOne({ email });

        if (userExists) {
            throw new Error('User already exists');
        }

        const { otp, expires } = generateOTP();

        const user = new User({
            name,
            email,
            password,
            otp,
            otpExpires: expires,
        });

        await user.save();

        // In a real app, you would send the OTP via email/SMS
        console.log(`OTP for ${email}: ${otp}`);
        try {
            await sendOTPEmail(email, otp);
        } catch (error) {
            // If email fails, you might want to handle this (e.g., delete the user or retry)
            await User.deleteOne({ _id: user._id });
            console.error('Failed to send OTP email:', error);
            throw new Error('Failed to send OTP email');
        }

        return user;
    }

    // Verify OTP
    async verifyOTP(email: string, otp: string) {
        const user = await User.findOne({ email }) as IUser;

        if (!user) {
            throw new Error('User not found');
        }

        if (user.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        if (user.otpExpires && new Date() > user.otpExpires) {
            await User.deleteOne({ _id: user._id });
            throw new Error('OTP expired. Please register again.');
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            token: generateToken(String(user._id)),
        };
    }

    // Login with email and password
    async login(email: string, password: string) {
        const user = await User.findOne({ email }) as IUser;

        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.password) {
            throw new Error('Please login using Google');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        if (!user.isVerified) {
            throw new Error('Please verify your account first');
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            token: generateToken(String(user._id)),
        };
    }

    // Google authentication
    async googleAuth(token: string) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error('Invalid Google token');
        }

        const { name, email, sub: googleId } = payload;

        let user = await User.findOne({ email }) as IUser;

        if (user) {
            if (!user.googleId) {
                // User exists but not with Google, update with Google ID
                user.googleId = googleId;
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Create new user with Google using new User() and save()
            user = new User({
                name,
                email,
                googleId,
                isVerified: true,
            });

            await user.save();
        }

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
            token: generateToken(String(user._id)),
        };
    }
}

export default new AuthService();