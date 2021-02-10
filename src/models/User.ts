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
    roles: {
        type: Array,
        of: String,
        required: false,
        default: [],
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
    token: string;
    roles: Array<string>;
    createdAt: string;
}

export interface UserDocument extends IUser, Document {}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserModel extends Model<UserDocument> {}

export default mongoose.model('User', schema);
