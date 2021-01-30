import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema<UserDocument, UserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: false,
    },
    createdAt: {
        type: String,
        required: true,
    },
});

export interface IUser {
    username: string;
    email: string;
    password: string;
    token?: string;
    createdAt: string;
}

export interface UserDocument extends IUser, Document {}
export interface UserModel extends Model<UserDocument> {} // eslint-disable-line

export default mongoose.model('User', schema);
