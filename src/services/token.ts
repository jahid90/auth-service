import jsonwebtoken from 'jsonwebtoken';

const { JWT_SECRET = 'dev' } = process.env;

const generateToken = (payload: any): string => {
    return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

const validateToken = (token: string) => {
    return jsonwebtoken.verify(token, JWT_SECRET);
}

export default {
    generate: generateToken,
    validate: validateToken
}
