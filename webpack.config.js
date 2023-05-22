/* Copyright (C) 2022-2023 Iowa State University of Science and Technology

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.  */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

function getDirectories(srcpath) {
  return fs
    .readdirSync(srcpath)
    .filter((item) => fs.statSync(path.join(srcpath, item)).isDirectory());
}

const bc = {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
	terserOptions: {
	  format: {
	    comments: false,
	  },
	  mangle: {
	    properties: {
	      regex: /^_/,
	      // t() is used in CKEditor for string translation.
	      reserved: ['t'],
	    },
	  },
	},
	test: /\.js(\?.*)?$/i,
	extractComments: false,
      }),
    ],
    moduleIds: 'deterministic',
  },
  entry: {
    path: path.resolve(
      __dirname,
      'src/index.js',
    ),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'anchor.js',
    library: ['CKEditor5', 'anchor'],
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  plugins: [
    new webpack.BannerPlugin('cspell:disable'),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve(__dirname, 'node_modules/ckeditor5/build/ckeditor5-dll.manifest.json')),
      scope: 'ckeditor5/src',
      name: 'CKEditor5.dll',
    }),
  ],
  module: {
    rules: [
      { test: /\.svg$/, type: 'asset/source' },
    ],
  },
};

const dev = {...bc, mode: 'development', optimization: {...bc.optimization, minimize: false}, devtool: false};

module.exports = (env, argv) => {
  // Files aren't minified in build with the development flag.
  if (argv.mode === 'development') {
    return dev;
  } else {
    return bc;
  }
}
