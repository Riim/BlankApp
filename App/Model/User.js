import { default as rt, cell } from 'riftjs';

export default class User extends rt.BaseModel {
	firstName = cell('');
	lastName = cell('');

	fullName = cell(function() {
		return (this.firstName() + ' ' + this.lastName()).trim();
	});

	constructor(params) {
		super();

		if (params.data) {
			this.setData(params.data);
		}
	}
}
