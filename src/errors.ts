
export class DIError extends Error {
	name: string
	message: string
	constructor(message?:string) {
		super(message);
		this.message = message;
	}

	toString (): string {
		return `[${this.name}: ${this.message}]`
	}
}

export class DIAggregateError extends DIError {
	error:Error
	constructor(message:string, errors:Error) {
		super(message);
		this.error = errors;
	}
	
	toString (): string {
		if (this.error == null) {
			return `[${this.name}: ${this.message}]`;	
		} else {
			return String.prototype.toString.call(this.error);
		}
	}

}



export function createError(name:string, message:string, error?:Error): Error {
	let e;
	if (error) {
		e = new DIAggregateError(message, error);
	} else {
		e = new DIError(message);
	}
	e.name = name;
	return e;
}