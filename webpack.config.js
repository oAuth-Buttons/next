'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const TerserPlugin = require('terser-webpack-plugin');

require('dotenv').config();

const devEnv = (() => {
  const raw = {
    ...process.env,
    // Useful for determining whether we’re running in production mode.
    // Most importantly, it switches React into the correct mode.
    NODE_ENV: process.env.NODE_ENV || 'development',
  };
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
})();

module.exports = function(webpackEnv) {
  const env = {
    isDevelopment: webpackEnv === undefined || webpackEnv === 'development',
    isProduction: webpackEnv === 'production',
  };

  const paths = (() => {
    const base = fs.realpathSync(process.cwd());
    return {
      base,
      build: path.resolve(base, 'build/'),
      src: path.resolve(base, 'src/'),
    };
  })();

  console.log(paths.src);

  return {
    mode: env.isProduction ? 'production' : 'development',
    bail: env.isProduction,
    devtool: env.isDevelopment ? 'cheap-module-source-map' : false,
    entry: [path.resolve(paths.src, 'index.ts')],
    output: {
      path: paths.build,
      filename: 'oauth-buttons.js',
      // todo: 해석 필요함, cra에서 베낌
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: env.isProduction
        ? info =>
            path
              .relative(paths.src, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    optimization: {
      minimize: env.isProduction,
      // todo: 해석 필요함, cra에서 베낌
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              // we want terser to parse ecma 8 code. However, we don't want it
              // to apply any minfication steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending futher investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
          // Use multi-process parallel running to improve the build speed
          // Default number of concurrent runs: os.cpus().length - 1
          parallel: true,
          // Enable file caching
          cache: true,
          sourceMap: env.isDevelopment,
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: env.isDevelopment
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.ts'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },

        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        {
          test: /\.[tj]s$/,
          enforce: 'pre',
          use: [
            {
              loader: require.resolve('eslint-loader'),
            },
          ],
          include: paths.appSrc,
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // Process application JS with Babel.
            // The preset includes JSX, Flow, TypeScript, and some ESnext features.
            {
              test: /\.[tj]s$/,
              include: paths.src,
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: {
                    // This is a feature of `babel-loader` for webpack (not Babel itself).
                    // It enables caching results in ./node_modules/.cache/babel-loader/
                    // directory for faster rebuilds.
                    cacheDirectory: true,
                    cacheCompression: env.isProduction,
                    compact: env.isProduction,
                  },
                },
              ],
              // loader: require.resolve('babel-loader'),
            },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
              test: /\.css$/,
              use: [
                env.isDevelopment && require.resolve('style-loader'),
                env.isProduction && {
                  loader: MiniCssExtractPlugin.loader,
                },
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    sourceMap: false,
                  },
                },
                {
                  // Options for PostCSS as we reference these options twice
                  // Adds vendor prefixing based on your specified browser support in
                  // package.json
                  loader: require.resolve('postcss-loader'),
                  options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebook/create-react-app/issues/2677
                    ident: 'postcss',
                    plugins: () => [
                      require('postcss-flexbugs-fixes'),
                      require('postcss-preset-env')({
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      }),
                    ],
                  },
                },
              ].filter(Boolean),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              loader: require.resolve('file-loader'),
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs||ts)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin(devEnv.stringified),
      // This is necessary to emit hot updates (currently CSS only):
      env.isDevelopment && new webpack.HotModuleReplacementPlugin(),
      env.isProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
          devtoolModuleFilenameTemplate: isEnvProduction
            ? info =>
                path
                  .relative(paths.appSrc, info.absoluteResourcePath)
                  .replace(/\\/g, '/')
            : isEnvDevelopment &&
              (info =>
                path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
        }),
      // TypeScript type checking

      new ForkTsCheckerWebpackPlugin({
        async: env.isDevelopment,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        reportFiles: ['**', '!**/*.json', '!**/__tests__/**'],
        watch: paths.src,
        silent: true,
      }),
    ].filter(Boolean),
  };
};
