export class Recipient {
	_address: string;
	_percentage: number;

	constructor(address: string, percentage: number) {
		this._address = address;
		this._percentage = percentage;
	}

	get address(): string {
		return this._address;
	}

	set address(value: string) {
		this._address = value;
	}

	get percentage(): number {
		return this._percentage;
	}

	set percentage(value: number) {
		this._percentage = value;
	}
}
