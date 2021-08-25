import bcrypt from 'bcrypt';

const hash = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
};

const validate = async (password: string, saved: string): Promise<boolean> => {
    return await bcrypt.compare(password, saved)
}

export default {
    hash,
    validate
}
