import path from 'path';

export default {
  client: {
    src: path.resolve(__dirname, '../client/'),
    dist: path.resolve(__dirname, '../client/.dist')
  },
  server: {
    src: path.resolve(__dirname, '../server/'),
    dist: path.resolve(__dirname, '../server/.dist')
  }
};
