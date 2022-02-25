import { ValidationFailures } from '../validators/validation-failures';
import { Validator } from '../validators/commons';

interface ValidateProp {
    prop: any,
    name: string,
}

export default async function validate(subject: ValidateProp, validators: Array<Validator>)
        : Promise<(ValidationFailures | void)> {

    const promises = validators.map((validator) => {
        return new Promise((resolve, reject) => {
            validator.apply(subject.prop)
            .then(() => resolve(true))
            .catch(() => reject(validator.message(subject.name)));
        });
    });

    const failures = new ValidationFailures();
    try {
        await Promise.all(promises);
    } catch (err) {
        failures.add(err as string);
    }

    if (failures.isEmpty()) {
        return;
    }

    return failures;
}
