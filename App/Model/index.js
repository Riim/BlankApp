import { default as rt, cell } from 'riftjs';
import User from './User';

export default class Model extends rt.BaseModel {
	viewer = cell(null);

	constructor() {
		super();

		this.viewer(new User({
			data: {
				firstName: 'Matroskin',
				lastName: 'Cat'
			}
		}));
	}
}
