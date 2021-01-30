import mongoose from 'mongoose';

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
}

const schema = new mongoose.Schema({
    id: 'string',
    username: 'string',
    email: 'string',
    password: 'string',
    createdAt: 'string'
});

const User = mongoose.model('User', schema);

export default User;
