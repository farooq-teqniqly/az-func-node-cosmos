const { v4: uuidv4 } = require('uuid');
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const client = new CosmosClient({ endpoint, key });
const database = client.database(process.env.COSMOS_DB);
const container = database.container(process.env.COSMOS_DB_CONTAINER);

module.exports = async function (context, req) {
  context.log('AddWine processed a request.');
  const wine = req.body;

  if (!wine) {
    context.res = {
      status: 400,
      body: 'Specify the wine to add in the request body.',
    };

    return;
  }

  const name = req.query.name || (req.body && req.body.name);
  const responseMessage = name
    ? 'Hello, ' + name + '. This HTTP triggered function executed successfully.'
    : 'This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.';

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};
