import mongoose from 'mongoose';

export interface User {
    id: ID!;
    username: string!;
    email: string!;
    password: string!;
    createdAt: string!;
}

const schema = new mongoose.Schema({
    id: 'string',
    username: 'string',
    email: 'string',
    password: 'string',
    createdAt: 'string'
});

const User : User = mongoose.model('User', schema);

export default User;
