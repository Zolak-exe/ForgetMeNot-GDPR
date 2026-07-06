const { WebpackPlugin } = require('@electron-forge/plugin-webpack');
const { MainConfig, RendererConfig } = require('@electron-toolkit/utils');

module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {},
    },
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig: MainConfig,
      renderer: {
        config: RendererConfig,
        entryPoints: [
          {
            html: './public/index.html',
            js: './renderer.js',
            name: 'main_window',
            preload: {
              js: './preload.js',
            },
          },
        ],
      },
    }),
  ],
};