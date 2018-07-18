const Html = ({ manifest, body }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>hello</title>
      <link href=${manifest['main.css']} rel="stylesheet">
    </head>
    <body>
      <div id="root">${body}</div>
      <script src=${manifest['main.js']}></script>
    </body>
  </html>
`;

export default Html;
