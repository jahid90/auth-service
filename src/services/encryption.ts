import bcrypt from 'bcrypt';

const hash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

export default {
    hash
}