import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AddWineRequest } from '../models/AddWineRequest.interface';
import { WineService } from '../services/WineService';

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

  const wineService = new WineService();
  const addWineResponse = await wineService.AddWine(addWineRequest);

  context.res = {
    status: 201,
    body: addWineResponse,
  };
};

export default httpTrigger;
