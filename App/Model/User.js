import { rt, d } from 'riftjs';

export default class User extends rt.BaseModel {
	@d.active firstName = '';
	@d.active lastName = '';

	@d.active fullName = function() {
		return (this.firstName + ' ' + this.lastName).trim();
	};

	constructor(params) {
		super();

		if (params.data) {
			this.setData(params.data);
		}
	}
}
