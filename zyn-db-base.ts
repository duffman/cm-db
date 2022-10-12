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

import { ZynLogger }         from "../zynaptic-session/src/common/zyn-logger";
import { Sqlite3Db }         from "./sqlite3/sqlite3-db";
import { ISqlite3DbHandler } from "./sqlite3/sqlite3-db-handler";
import { SqliteDbType }      from "./sqlite3/sqlite3-db.type";
import { existsSync }        from "fs";
import { basename } from "path";

export class ZynDbBase implements ISqlite3DbHandler {
	protected db: Sqlite3Db;
	protected dbFilename: string;
	protected dbFullFilename: string;

	constructor() {
	}

	public async openDatabase(dbFilename: string, dbType?: SqliteDbType, dbPath?: string): Promise<boolean> {
		return null;
	}

	public async open(dbFilename: string, tryQuery?: boolean) {
		ZynLogger.info(">> openDatabase ::", dbFilename);

		try {
			if (existsSync(dbFilename)) {
				if (await this.initDatabase(dbFilename) && tryQuery) {
					const queryTestRes = await this.execute("SELECT 666 + 1");
					ZynLogger.logVerbose("QUERY TEST ::", queryTestRes);

				}
			}
		}
		catch (e) {
			ZynLogger.fatal(`Unable to open database "${ this.db }"`);
		}
	}

	/**
	 * Locate database file and initialze
	 * @param {string} dbFilename
	 * @param {SqliteDbType} dbType
	 * @param {string} dbPath
	 * @returns {Promise<boolean>}
	 */
	protected async initDatabase(
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
			ZynLogger.fatal("ZynDbBase :: initDatabase", e);
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
				if (!connectResult) throw new Error("");
			}
			else {
				throw new Error(`Unable to connect database "${ this.dbFilename }"`);
			}

			if (isSelect) {
				result = await this.db.select(query, values);
			}
			else {
				result = await this.db.modify(query, values);
			}
		}
		catch (e) {
			ZynLogger.error("ZynDbBase ::", e);
		}

		return result;
	}
}
