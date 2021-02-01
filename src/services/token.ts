import jsonwebtoken from 'jsonwebtoken';

import { jwt } from '../config/secrets';

const generateToken = (payload: any): string => {
    return jsonwebtoken.sign(payload, jwt.secret, { expiresIn: '1d' });
};

const validateToken = (token: string) => {
    return jsonwebtoken.verify(token, jwt.secret);
}

export default {
    generate: generateToken,
    validate: validateToken
}
