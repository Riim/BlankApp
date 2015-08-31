import { rt, d } from 'riftjs';

export default class User extends rt.BaseModel {
	@d.observable firstName = '';
	@d.observable lastName = '';

	@d.computed fullName = function() {
		return (this.firstName + ' ' + this.lastName).trim();
	};

	constructor(params) {
		super();

		if (params.data) {
			this.setData(params.data);
		}
	}
}
