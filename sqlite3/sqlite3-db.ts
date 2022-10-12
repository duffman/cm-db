/**
 * skynode-taxi
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-08-08
 *
 * Copyright (c) 2021 Netix AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { Database }     from "sqlite3";
import { ZynLogger }    from "../../zynaptic-session/src/common/zyn-logger";
import { SqliteDbType } from './sqlite3-db.type';
import { sqlite3 }      from "sqlite3";
import { spatialite } from "spa"
export class Sqlite3Db {
	public sqliteDb: sqlite3;
	public db: Database;


	constructor(private type: SqliteDbType, public filename: string) {
		switch (type) {
			case SqliteDbType.Sqlite:
				this.sqliteDb = require('sqlite3').verbose();
				break;

			case SqliteDbType.Spatialite:
				this.sqliteDb = require('spatialite');
				break;
		}
	}

	/**
	 * Connect to file based database
	 * @returns {Promise<boolean>}
	 */
	public connect(): Promise<boolean> {
		console.log(`Connecting to database ::`, this.filename);

		return new Promise((resolve, reject) => {
			this.db = new this.sqliteDb.Database(this.filename, (err: any) => {
				if (err) {
					console.error(err.message);
					console.log(`Connection to database "${ this.filename }" failed.`);

					reject(err);
				}
				else {
					console.log(`Connected to "${ this.filename }" SQlite database.`);

					resolve(true);
				}
			});
		});
	}

	public execute(query: string): Promise<number> {
		return new Promise((resolve, reject) => {
			this.db.run(query, function(err: any) {
				if (err) {
					reject(err);
				}
				else {
					resolve(this.lastID);
				}
			});
		});
	}

	public modify(query: string, values?: any[]): Promise<number> {
		return new Promise((resolve, reject) => {
			console.log("MOD 1 ::");
			if (values.length) {
				console.log("MOD 1 :: A ::", values);
				this.db.run(query, values, runCallback);
			}
			else {
				console.log("MOD 1 :: B");
				this.db.run(query, runCallback);
			}

			function runCallback(err: any) {
				if (err) {
					reject(err);
				}
				else {
					ZynLogger.logVerbose("Sqlite3Db :: modify :: LAST ID ::", this.lastID);
					resolve(this.lastID);
				}
			}
		});
	}

	public dbGet(query: string, values?: unknown[]): Promise<any> {
		return new Promise((resolve, reject) => {
			if (values) {
				this.db.all(query, values, getCallback);
			} else {
				this.db.all(query, getCallback);
			}

			function getCallback (err: any, row: any) {
				if (err) {
					console.error(err.message);
					reject(err);
				}
				else {
					ZynLogger.logVerbose("Sqlite3Db :: dbGet ::", row);
					resolve(row);
				}
			}
		});
	}

	public spatialGet(query: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.db.spatialite((err: any) => {
				this.db.get(query, (err: any, row: any) => {
					if (err) {
						console.error(err.message);
						reject(err);
					}
					else {
						console.log('Sqlite3Db :: get ::', row);
						resolve(row);
					}
				});
			});
		});
	}

	public get(query: string): Promise<any> {
		if (this.type === SqliteDbType.Sqlite) {
			return this.dbGet(query);
		}
		else if (this.type === SqliteDbType.Spatialite) {
			return this.spatialGet(query);
		}
	}
}
