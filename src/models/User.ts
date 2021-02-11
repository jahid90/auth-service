import mongoose, { Document, Model } from 'mongoose';

const UserSchema = new mongoose.Schema<UserDocument, UserModel>({
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
export interface UserModel extends Model<UserDocument> {
    findOneByUsername(username: string): Promise<UserDocument | null>;
}

UserSchema.statics.findOneByUsername = async function (username: string) {
    return this.findOne({ username });
};

export default mongoose.model('User', UserSchema);
