/**
 * SQLite3 Wrapper Class
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-08-08
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { Database } from "sqlite3";
import { SqliteDbType } from './sqlite3-db.type';
import { sqlite3 } from "sqlite3";
export declare function zynLog(...data: any[]): void;
export declare class Sqlite3Db {
    private type;
    filename: string;
    sqliteDb: sqlite3;
    db: Database | any;
    constructor(type: SqliteDbType, filename: string);
    /**
     * Connect to file based database
     * @returns {Promise<boolean>}
     */
    connect(): Promise<boolean>;
    execute(query: string): Promise<number>;
    modify(query: string, values?: any[]): Promise<number>;
    dbGet(query: string, values?: unknown[]): Promise<any>;
    spatialGet(query: string): Promise<any>;
    get(query: string, values?: unknown[]): Promise<any>;
}
//# sourceMappingURL=sqlite3-db.d.ts.map