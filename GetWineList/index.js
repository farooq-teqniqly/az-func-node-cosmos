const { v4: uuidv4 } = require('uuid');
const { CosmosClient } = require('@azure/cosmos');
require('dotenv').config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const client = new CosmosClient({ endpoint, key });
const database = client.database(process.env.COSMOS_DB);
const container = database.container(process.env.COSMOS_DB_CONTAINER);

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const name = req.query.region;

  const wine = {
    id: uuidv4(),
    name: 'D2',
    winery: 'DeLille',
    region: 'WA',
  };

  const cosmosRes = await container.items.create(wine);

  context.res = {
    body: cosmosRes.resource,
  };
};
