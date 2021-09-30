export class Recipient {
	_address: string;
	_percent: number;

	constructor(account: string, percent: number) {
		this._address = account;
		this._percent = percent;
	}

	get account(): string {
		return this._address;
	}

	set account(value: string) {
		this._address = value;
	}

	get percent(): number {
		return this._percent;
	}

	set percent(value: number) {
		this._percent = value;
	}
}
