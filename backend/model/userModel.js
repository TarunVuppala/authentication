import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long'],
        },
        data: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Data',
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;
