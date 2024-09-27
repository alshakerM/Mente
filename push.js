var push = require('web-push');

const vapIdKeys = {
  publicKey:
    'BGkdHxLRoO9FtwJyP5EZax0v8OpCCDUrnWli5qLpQcg01BiwRfGnObhYk5v1cNIsH0-yfBoWjXf383gKJa8oTsU',
  privateKey: '8RquUzpBTSRe25xwnX9G6JrXBa7vCI9SQumHq7W1Ybs',
};

push.setVapidDetails(
  'mailto:text@code.co.uk',
  vapIdKeys.publicKey,
  vapIdKeys.privateKey
);

const sub = {};

push.sendNotification(sub, 'Test for Samara');
