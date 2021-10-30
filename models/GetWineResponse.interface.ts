import { Meta } from './Meta.interface';

export interface GetWineResponse {
  id: string;
  name: string;
  winery: string;
  region: string;
  meta: Meta | null;
}
