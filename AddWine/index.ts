import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AddWineRequest } from '../models/AddWineRequest.interface';
import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

dotenv.config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const client = new CosmosClient({ endpoint, key });
const database = client.database(process.env.COSMOS_DB);
const container = database.container(process.env.COSMOS_DB_CONTAINER);

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('AddWine function processed a request.');
  const addWineRequest: AddWineRequest = req.body;

  if (!addWineRequest) {
    context.res = {
      status: 400,
      body: 'Empty request body.',
    };

    return;
  }

  const wine = {
    id: uuid(),
    ...addWineRequest,
  };

  const { resource } = await container.items.create(wine);

  context.res = {
    status: 201,
    body: resource,
  };
};

export default httpTrigger;
