import 'core-js/es/array';
import 'es6-map/implement';
import 'whatwg-fetch';

declare const window: Window;

if (typeof Uint8ClampedArray === 'undefined') {
  (window as any).Uint8ClampedArray = () => [];
}

if (!window.location.origin) {
  const { protocol, hostname } = window.location;
  const port = window.location.port ? `:${window.location.port}` : '';
  (window.location as { origin: string })
    .origin = `${protocol}//${hostname}${port}`;
}

// Promise polyfill
if (typeof Promise === 'undefined') {
  // tslint:disable-next-line:no-var-requires
  require('promise/lib/rejection-tracking').enable();
  // tslint:disable-next-line:no-var-requires
  (window as any).Promise = require('promise/lib/es6-extensions.js');
}
