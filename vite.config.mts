import react from '@vitejs/plugin-react';
// @ts-expect-error The package exposes an ESM default but publishes legacy `export =` typings.
import basicSsl from '@vitejs/plugin-basic-ssl';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

const normalizeBasePath = (publicUrl?: string): string => {
  const path = (publicUrl || 'ui').trim().replace(/^\/+|\/+$/g, '');
  return path ? `/${path}/` : '/';
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const selfcareCommonLib = resolve(
    process.cwd(),
    'node_modules/@pagopa/selfcare-common-frontend/lib'
  );

  return {
    base: normalizeBasePath(env.REACT_APP_PUBLIC_URL),
    plugins: [react(), ...(env.HTTPS === 'true' ? [basicSsl()] : [])],
    envPrefix: ['VITE_', 'REACT_APP_', 'SETTINGS_'],
    resolve: {
      alias: [
        {
          find: /^@mui\/base\/ButtonUnstyled$/,
          replacement: '@mui/base/useButton',
        },
        {
          find: /^@pagopa\/selfcare-common-frontend\/(?!index\.css$)(.+)$/,
          replacement: `${selfcareCommonLib}/$1`,
        },
      ],
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'build',
      target: 'esnext',
      sourcemap: env.REACT_APP_ENV !== 'prod',
    },
  };
});
