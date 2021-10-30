import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AddWineRequest } from '../models/AddWineRequest.interface';
import { v4 as uuid } from 'uuid';
import container from '../utils/cosmosUtils';

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
