import { rt, d } from 'riftjs';
import User from './User';

export default class Model extends rt.BaseModel {
	@d.observable viewer = new User({
		data: {
			firstName: 'Matroskin',
			lastName: 'Cat'
		}
	});
}
