import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';

export const createDatabase = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
): Promise<void> => {
  const generator = orm.getSchemaGenerator();

  await generator.createSchema();
};

export const dropDatabase = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
): Promise<void> => {
  const generator = orm.getSchemaGenerator();

  await generator.dropSchema(false, true, true);
};

export const migrate = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
): Promise<void> => {
  const migrator = orm.getMigrator();
  await migrator.up();
};

export const devInit = async (
  orm: MikroORM<IDatabaseDriver<Connection>>,
): Promise<void> => {
  const generator = orm.getSchemaGenerator();

  try {
    await generator.createSchema();
  } catch {
    await generator.updateSchema();
  }
};
