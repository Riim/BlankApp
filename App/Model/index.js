import { default as rt, d } from 'riftjs';
import User from './User';

export default class Model extends rt.BaseModel {
	@d.active viewer = new User({
		firstName: 'Matroskin',
		lastName: 'Cat'
	});
}
