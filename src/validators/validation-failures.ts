export class ValidationFailures {

    failures: Array<string>;

    constructor() {
        this.failures = [];
    }

    add(failure: string) {
        this.failures.push(failure);
    }

    get() {
        return this.failures;
    }

    isEmpty() {
        return this.failures.length === 0;
    }

    merge(other: ValidationFailures) {
        this.failures = this.failures.concat(other.failures);
    }
}
