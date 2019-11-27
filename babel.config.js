module.exports = {
  parserOpts: {
    strictMode: true,
  },
  presets: [
    require('@babel/preset-env').default,
    require('@babel/preset-typescript').default,
  ],
};
