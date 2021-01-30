import jsonwebtoken from 'jsonwebtoken';

import { jwt } from '../config/secrets';

const generateToken = (payload: any): string => {
    return jsonwebtoken.sign(payload, jwt.secret, { expiresIn: '1d' });
};

export default {
    generate: generateToken
}
