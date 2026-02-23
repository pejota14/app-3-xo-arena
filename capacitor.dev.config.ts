import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pejota.xoarena.app',
  appName: 'XO Arena',
  webDir: 'dist/app-3-xo-arena/browser',
  server: {
    url: 'http://127.0.0.1:4200',
    cleartext: true
  }
};

export default config;
