import User from '../models/user.model';
import {IUser} from "../interfaces/user.interface";

class UserService {
    // Get user profile
    async getUserProfile(userId: string) {
        const user = await User.findById(userId).select('-password -otp -otpExpires -googleId');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    // Update user profile
    async updateUserProfile(userId: string, name: string, email: string) {
        const user = await User.findById(userId) as IUser;

        if (!user) {
            throw new Error('User not found');
        }

        user.name = name || user.name;
        user.email = email || user.email;
        await user.save();

        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        };
    }
}

export default new UserService();