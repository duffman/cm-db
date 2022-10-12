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

import { zynLog }            from "./integrations/sqlite3/sqlite3-db";
import { Sqlite3Db }         from "./integrations/sqlite3/sqlite3-db";
import { ISqlite3DbHandler } from "./integrations/sqlite3/sqlite3-db-handler";
import { SqliteDbType }      from "./integrations/sqlite3/sqlite3-db.type";
import { existsSync }        from "fs";
import { basename }          from "path";

export class ZynDbBase implements ISqlite3DbHandler {
	protected db: Sqlite3Db;
	protected dbFilename: string;
	protected dbFullFilename: string;

	constructor() {}

	/**
	 * Locate database file and initialze
	 * @param {string} dbFilename
	 * @param {SqliteDbType} dbType
	 * @param {string} dbPath
	 * @returns {Promise<boolean>}
	 */
	public async initDatabase(
		dbFilename: string,
		dbType         = SqliteDbType.Sqlite,
	): Promise<boolean> {
		let result = false;

		try {
			this.dbFilename = basename(dbFilename);
			this.dbFullFilename = dbFilename;

			if (!existsSync(dbFilename)) {
				throw new Error(`initDatabase :: database "${ dbFilename}" does not exist.`);
			}

			this.db = new Sqlite3Db(dbType, this.dbFullFilename);
			result = await this.db.connect();
		}
		catch (e) {
			zynLog("fatal", "ZynDbBase :: initDatabase", e);
			result = false;
		}

		return result;
	}

	public async execute(query: string, ...values: unknown[]): Promise<any> {
		let result: any = null;

		const isSelect = query.toLowerCase().trim().startsWith("select");

		try {
			let connectResult: boolean = false;

			if (this.db) {
				connectResult = await this.db.connect();
				if (!connectResult) throw new Error(`Unable to connect database "${ this.dbFilename }"`);
			}
			else {
				throw new Error(`Internal Error: Database Object not assigned`);
			}

			if (isSelect) {
				result = await this.db.get(query, values);
			}
			else {
				result = await this.db.modify(query, values);
			}
		}
		catch (e) {
			zynLog("error", "ZynDbBase ::", e);
		}

		return result;
	}
}
