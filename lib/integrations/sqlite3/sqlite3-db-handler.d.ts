/**
 * ZynapticDb - Data Handler Interface Type
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-08-08
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { SqliteDbType } from './sqlite3-db.type';
export interface ISqlite3DbHandler {
    initDatabase(dbFilename: string, dbType: SqliteDbType, createIfNotExist?: boolean): Promise<boolean>;
}
//# sourceMappingURL=sqlite3-db-handler.d.ts.map