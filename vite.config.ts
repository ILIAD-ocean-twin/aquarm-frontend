import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/basic-all': {
        target: 'http://10.218.116.24'
      },
      '/trajectory': {
        target: 'http://10.218.116.24'
      },
      '/windrose': {
        target: 'http://10.218.116.24'
      },
    },
  },
  build: {
    target: 'esnext',
  }
});


/*
kommunegrenser kommer fra bård

Endpoint for historisk lusedata finnes
 - Vetle lager chart
 - Viaualisering av jarls matriser

Ø
  Tabs
  Sammenlignet med snitt for produksjonsområde
B
  Copernicus data

J
  Correlation matrix (lice)
  Connectivity matrix
*/