import { Validator } from './commons';
import { ValidationError } from './validation-error';
import User from '../models/User';

export const isUsernameNotAlreadyTaken: Validator =  {
    apply: async (prop: any) => {
        // If a user with the provided username exists in the db, the username is already taken
        const user = await User.findOneByUsername(prop as string);
        if (user) throw new ValidationError();
    },
    message: (name: string) => {
        return `${name} is already taken`;
    }
};
