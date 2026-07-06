module.exports = {
  packagerConfig: {
    asar: false,
    name: 'identity-scanner',
    executableName: 'identity-scanner',
    appBundleId: 'com.identityscanner.app',
    ignore: [
      /^\/scripts($|\/)/,
      /^\/renderer($|\/)/,
      /^\/dist($|\/)/,
      /^\/build($|\/)/,
      /^\/out($|\/)/,
      /^\/\.git($|\/)/,
      /^\/preload\.js$/,
      /^\/electron-forge\.config\.js$/,
      /^\/install-and-run\.sh$/,
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          name: 'identity-scanner',
          bin: 'identity-scanner',
          productName: 'Identity Scanner',
          maintainer: 'Clément NOEL',
          homepage: 'https://localhost',
          description: "Scanner d'empreinte numérique et outil RGPD",
          categories: ['Utility', 'Network'],
          depends: ['libsecret-tools'],
        },
      },
    },
  ],
  plugins: [],
};
