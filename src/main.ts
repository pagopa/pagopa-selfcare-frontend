import {Buffer} from 'buffer';
import process from 'process';

/* eslint-disable functional/immutable-data */
globalThis.Buffer = Buffer;
globalThis.global = globalThis;
globalThis.process = process;
Object.assign(process.env, import.meta.env, {
  NODE_ENV: import.meta.env.DEV ? 'development' : 'production',
});
/* eslint-enable functional/immutable-data */

void import(/* @vite-ignore */ `${import.meta.env.BASE_URL}env-config.js`).then(() =>
  import('./bootstrap')
);
