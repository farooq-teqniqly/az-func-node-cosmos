import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { WineService } from '../services/WineService';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('GetWine function processed a request.');

  const wineService = new WineService();
  const responseModels = await wineService.GetWines();

  context.res = {
    body: responseModels,
  };
};

export default httpTrigger;
