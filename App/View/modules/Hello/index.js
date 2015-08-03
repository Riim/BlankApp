import { default as rt, cell } from 'riftjs';

class Hello extends rt.BaseView {
	_initAssets(params) {
		this.targetName = cell(params.targetName || '');
	}
}

rt.registerViewClass('Hello', Hello);
