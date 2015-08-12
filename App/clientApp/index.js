import rt from 'riftjs';
import App from '..';

rt.proxy.deserializeCache(window.__rt_proxyCacheDump__);

window._app = new App({
	viewBlock: document.querySelector('[rt-id]')
});
