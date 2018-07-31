import fs from 'fs';
import paths from '../config/paths';

const getRuntimeFileContent = (manifest) => {
  const fileName = manifest['runtime~main.js'].split(paths.publicPath)[1];
  return fs.readFileSync(`${paths.client.dist}${fileName}`, 'utf-8');
}

const Html = ({ manifest, body }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hello</title>
      <link href=${manifest['main.css']} rel="stylesheet">
    </head>
    <body>
      <div id="root">${body}</div>
      <script>${getRuntimeFileContent(manifest)}</script>
      <script src=${manifest['vendor.js']}></script>
      <script src=${manifest['main.js']}></script>
    </body>
  </html>
`;

export default Html;
