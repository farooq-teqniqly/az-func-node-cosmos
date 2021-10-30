import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { wineService } from '../Startup';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('GetWine function processed a request.');

  const responseModels = await wineService.GetWines();

  context.res = {
    body: responseModels,
  };
};

export default httpTrigger;
