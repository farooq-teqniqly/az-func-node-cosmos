import { WineService } from './WineService';
import container from '../utils/cosmosUtils';

const wineService = new WineService(container);

export { wineService };
