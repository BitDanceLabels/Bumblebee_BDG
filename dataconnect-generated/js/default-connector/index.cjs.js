const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'PEC_WEB_CRM',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

