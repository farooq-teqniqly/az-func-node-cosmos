import { CosmosClient } from '@azure/cosmos';
import * as dotenv from 'dotenv';

dotenv.config();

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

const client = new CosmosClient({ endpoint, key });
const database = client.database(process.env.COSMOS_DB);
const container = database.container(process.env.COSMOS_DB_CONTAINER);

export default container;
