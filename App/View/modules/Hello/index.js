import rt from 'riftjs';

class Hello extends rt.BaseView {
	_initAssets(params) {
		this.targetName = rt.cell(params.targetName || '');
	}
}

rt.registerViewClass('Hello', Hello);
