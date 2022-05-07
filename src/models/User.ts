import mongoose, { Document, Model } from 'mongoose';

const UserSchema: mongoose.Schema<UserDocument> = new mongoose.Schema(
    {
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
        tokenVersion: {
            type: Number,
            required: false,
            default: 0,
        },
        roles: {
            type: [String],
            required: false,
            default: [],
        },
        createdAt: {
            type: String,
            required: true,
        },
    },
    {
        toObject: {
            // sanitize for output
            transform: function (_doc, ret) {
                delete ret.__v;
                delete ret._id;
                delete ret.password;
                delete ret.token;
                delete ret.tokenVersion;
                delete ret.roles;
                delete ret.createdAt;
            },
        },
        toJSON: {
            // sanitize for output
            transform: function (_doc, ret) {
                delete ret.__v;
                delete ret._id;
                delete ret.password;
                delete ret.token;
                delete ret.tokenVersion;
                delete ret.roles;
                delete ret.createdAt;
            },
        },
    }
);

export interface IUser {
    username: string;
    email: string;
    password: string;
    token: string;
    tokenVersion: number;
    roles: Array<string>;
    createdAt: string;
}

export interface UserDocument extends IUser, Document {}
export interface UserModel extends Model<UserDocument> {
    findOneByUsername(username: string): Promise<UserDocument | null>;
}

UserSchema.statics.findOneByUsername = async function (username: string) {
    return this.findOne({ username }) as Promise<UserDocument | null>;
};

export default mongoose.model<UserDocument, UserModel>('User', UserSchema);
