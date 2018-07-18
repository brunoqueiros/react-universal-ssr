import React from 'react';
import fs from 'fs';
import path from 'path';
import { renderToString } from 'react-dom/server';
import template from './template';
import App from '../client/App';

let manifest = {};

function getManifestFile() {
  if (Object.keys(manifest).length === 0) {
    try {
      manifest = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../client/.dist/manifest.json'), 'utf8'));
    } catch(e) {
      console.log('Could not find manifest.json');
    }
  }

  return manifest;
}

function getMarkup(req) {
  const manifest = getManifestFile();

  const html = renderToString(
    <App />
  );

  return template({ manifest, body: html });
}

export default async (req, res) => {
  return getMarkup(req);
};
