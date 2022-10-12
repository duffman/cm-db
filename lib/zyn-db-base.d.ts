/**
 * Zynaptic ZynLogger
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2022-03-05
 *
 * Copyright (c) 2022 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 *
 * Simple Logging Utility that wraps the console,
 * extend and use with custom app ZynLogger
 *
 */
import { Sqlite3Db } from "./integrations/sqlite3/sqlite3-db";
import { ISqlite3DbHandler } from "./integrations/sqlite3/sqlite3-db-handler";
import { SqliteDbType } from "./integrations/sqlite3/sqlite3-db.type";
export declare class ZynDbBase implements ISqlite3DbHandler {
    protected db: Sqlite3Db;
    protected dbFilename: string;
    protected dbFullFilename: string;
    constructor();
    /**
     * Locate database file and initialze
     * @param {string} dbFilename
     * @param {SqliteDbType} dbType
     * @param {string} dbPath
     * @returns {Promise<boolean>}
     */
    initDatabase(dbFilename: string, dbType?: SqliteDbType): Promise<boolean>;
    execute(query: string, ...values: unknown[]): Promise<any>;
}
//# sourceMappingURL=zyn-db-base.d.ts.map