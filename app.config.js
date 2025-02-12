/**
 * @module app.config
 * @description App 配置
 */

import path from 'node:path';

const js = path.resolve('app/js');
const css = path.resolve('app/css');
const images = path.resolve('app/images');

/**
 * @type {import('./tools/interface').AppConfig}
 */
export default {
  ports: 8000,
  lang: 'zh-CN',
  name: 'React useVirtual',
  context: path.resolve('app'),
  outputPath: path.resolve('wwwroot/public'),
  publicPath: '/use-virtual-examples/public/',
  entry: path.resolve('app/js/pages/index.tsx'),
  entryHTML: path.resolve('wwwroot/index.html'),
  favicon: path.resolve('app/images/favicon.ico'),
  alias: { '/js': js, '/css': css, '/images': images },
  meta: { viewport: 'width=device-width,initial-scale=1.0' }
};
