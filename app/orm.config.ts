import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default {
    user: 'postgres',
    password: process.env.DB_PASSWORD || '63sd81za3x9c3z2',
    dbName: 'needle',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    entities: ['dist/models'],
    entitiesTs: ['app/models'],
    type: 'postgresql',
    metadataProvider: TsMorphMetadataProvider
} as Parameters<typeof MikroORM.init>[0];