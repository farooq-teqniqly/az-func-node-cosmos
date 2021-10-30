import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { GetWineResponse } from '../models/GetWineResponse.interface';
import { Meta } from '../models/Meta.interface';
import container from '../utils/cosmosUtils';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('GetWine function processed a request.');

  const querySpec = `SELECT * FROM ${process.env.COSMOS_DB_CONTAINER}`;
  const { resources } = await container.items.query(querySpec).fetchAll();

  const responseModels: GetWineResponse[] = [];
  resources.forEach((r) => {
    var meta: Meta = {
      etag: JSON.parse(r._etag),
    };

    responseModels.push({
      id: r.id,
      name: r.name,
      winery: r.winery,
      region: r.region,
      meta,
    });
  });

  context.res = {
    body: responseModels,
  };
};

export default httpTrigger;
