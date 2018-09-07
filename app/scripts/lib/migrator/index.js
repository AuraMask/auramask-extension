const EventEmitter = require('events');

/**
 * @typedef {object} Migration
 * @property {number} version - The migration version
 * @property {Function} migrate - Returns a promise of the migrated data
 */

/**
 * @typedef {object} MigratorOptions
 * @property {Array<Migration>} [migrations] - The list of migrations to apply
 * @property {number} [defaultVersion] - The version to use in the initial state
 */

class Migrator extends EventEmitter {

  /**
   * @constructor
   * @param {MigratorOptions} opts
   */
  constructor(opts = {}) {
    super();
    const migrations = opts.migrations || [];
    // sort migrations by version
    this.migrations = migrations.sort((a, b) => a.version - b.version);
    // grab migration with highest version
    const lastMigration = this.migrations.slice(-1)[0];
    // use specified defaultVersion or highest migration version
    this.defaultVersion = opts.defaultVersion || (lastMigration && lastMigration.version) || 0;
  }

  // run all pending migrations on meta in place
  async migrateData(versionedData = this.generateInitialState()) {
    const pendingMigrations = this.migrations.filter(migration =>
      migration.version > versionedData.meta.version,
    );

    for (const i in pendingMigrations) {
      const migration = pendingMigrations[i];
      const migratedData = await migration.migrate(versionedData);
      migratedData.meta.version = migration.version;
      if (!migratedData.data) {
        this.emit('error', new Error('Migrator - migration returned empty data'));
        return versionedData;
      }
      versionedData = migratedData;
    }
    return versionedData;
  }

  /**
   * Returns the initial state for the migrator
   * @param {object} [data] - The data for the initial state
   * @returns {{meta: {version: (number|*)}, data: Object}}
   */
  generateInitialState(data) {
    return {
      meta: {
        version: this.defaultVersion,
      },
      data,
    };
  }

}

module.exports = Migrator;
