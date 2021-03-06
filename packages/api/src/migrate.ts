import type { Options } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import { checkForOldDatabase, migrateOldDatabase } from "./helpers/migrate-old-database";
import mikroOrmConfig, { migrationsTableName, ormLogger } from "./mikro-orm.config";

export const migrate = async (
  config: Options = mikroOrmConfig,
  skipLock = process.env.SKIP_MIGRATION_LOCK === "true"
) => {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork({ clear: true }) as EntityManager;
  const connection = em.getConnection();
  const migrator = orm.getMigrator();
  const oldDatabaseExists = await checkForOldDatabase(connection);
  if (oldDatabaseExists) {
    await migrateOldDatabase(em, migrator);
    return;
  }

  const migrations = await migrator.getPendingMigrations();
  if (!migrations[0]) {
    ormLogger.debug(`No pending migrations`);
    return;
  }

  ormLogger.log(`Migrating through ${migrations.length} migrations`);
  await em.transactional(async (em) => {
    if (!skipLock) await em.execute(`LOCK TABLE ${migrationsTableName} IN EXCLUSIVE MODE`);
    await migrator.up({ transaction: em.getTransactionContext() });
  });

  await orm.close();
};
