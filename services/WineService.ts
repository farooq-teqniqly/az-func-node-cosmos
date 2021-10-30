import { v4 as uuid } from 'uuid';
import { AddWineResponse } from '../models/AddWineResponse.interface';
import { AddWineRequest } from '../models/AddWineRequest.interface';
import { GetWineResponse } from '../models/GetWineResponse.interface';
import { Meta } from '../models/Meta.interface';
import { Container } from '@azure/cosmos';

export class WineService {
  constructor(private container: Container) {
    this.container = container;
  }

  async AddWine(req: AddWineRequest): Promise<AddWineResponse> {
    const wine = {
      id: uuid(),
      ...req,
    };

    const { resource } = await this.container.items.create(wine);

    return {
      id: resource.id,
    };
  }

  async GetWines(): Promise<GetWineResponse[]> {
    const querySpec = `SELECT * FROM ${process.env.COSMOS_DB_CONTAINER}`;

    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();

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

    return responseModels;
  }
}
