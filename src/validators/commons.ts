import _ from 'lodash';

import { ValidationError } from './validation-error';

export interface Validator {
    apply: (prop: any)=> Promise<void>,
    message: (name: string) => string,
}

export const isNotMissing: Validator =  {
    apply: async (prop: any) => {
        await Promise.resolve();
        if (_.isNull(prop) || _.isUndefined(prop)) throw new ValidationError();
    },
    message: (name: string) => {
        return `${name} is missing or null`;
    }
};

export const isNotEmpty: Validator =  {
    apply: async (prop: any) => {
        await Promise.resolve();
        if (_.isEmpty(prop)) throw new ValidationError();
    },
    message: (name: string) => {
        return `${name} is empty`;
    }
};

export const isString: Validator =  {
    apply: async (prop: any) => {
        await Promise.resolve();
        if (!_.isString(prop)) throw new ValidationError();
    },
    message: (name: string) => {
        return `${name} is not a string`;
    }
};

export const isValidEmail: Validator =  {
    apply: async (prop: any) => {
        await Promise.resolve();
        const emailRegexp = new RegExp(/\S+@\S+\.\S+/);

        if (!emailRegexp.exec(prop as string)) throw new ValidationError();
    },
    message: (name: string) => {
        return `${name} is not valid`;
    }
};
