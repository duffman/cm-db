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
	protected sqlite: Sqlite3Db;
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
		createIfNotExist?: boolean
	): Promise<boolean> {
		let result = false;

		try {
			this.dbFilename = basename(dbFilename);
			this.dbFullFilename = dbFilename;

			if (!existsSync(dbFilename)) {
				if (createIfNotExist) {
					const userDB = new this.sqlite.db(
						dbFilename,
						this.sqlite.openReadWrite | this.sqlite.openCreate,
						(err) => {
							if (!err) {
								this.execute(
									"CREATE TABLE \"web_sessions\" (\n"
									+ "\t\"id\"\tINTEGER,\n"
									+ "\t\"created\"\tINTEGER,\n"
									+ "\t\"ttl\"\tINTEGER,\n"
									+ "\t\"data\"\tTEXT,\n"
									+ "\t\"last_access\"\tINTEGER,\n"
									+ "\tPRIMARY KEY(\"id\" AUTOINCREMENT)\n"
									+ ");"
								);
							}
						});
				} else
				throw new Error(`initDatabase :: database "${ dbFilename}" does not exist.`);
			}

			this.sqlite = new Sqlite3Db(dbType, this.dbFullFilename);
			result      = await this.sqlite.connect();
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

			if (this.sqlite) {
				connectResult = await this.sqlite.connect();
				if (!connectResult) throw new Error(`Unable to connect database "${ this.dbFilename }"`);
			}
			else {
				throw new Error(`Internal Error: Database Object not assigned`);
			}

			if (isSelect) {
				console.log("isSelect ------------->");
				result = await this.sqlite.get(query, values);
			}
			else {
				result = await this.sqlite.modify(query, values);
			}
		}
		catch (e) {
			zynLog("error", "ZynDbBase ::", e);
		}

		return result;
	}
}
