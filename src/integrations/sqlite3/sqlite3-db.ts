/**
 * ZynapticDb - SQLite3 Wrapper Class
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-08-08
 *
 * Copyright (c) 2021 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { Database }     from "sqlite3";
import { SqliteDbType } from './sqlite3-db.type';
import { sqlite3, OPEN_CREATE, OPEN_READWRITE}      from "sqlite3";

export function zynLog(...data: any[]) {
	console.log(":: zLog ::", data);
}

export class Sqlite3Db {
	public openCreate = OPEN_CREATE;
	public openReadWrite = OPEN_READWRITE;

	public sqliteDb: sqlite3;
	public db: Database | any;


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
		zynLog(`Connecting to database ::`, this.filename);

		return new Promise((resolve, reject) => {
			this.db = new this.sqliteDb.Database(this.filename, (err: any) => {
				if (err) {
					zynLog("error", err.message);
					zynLog(`Connection to database "${ this.filename }" failed.`);

					reject(err);
				}
				else {
					zynLog(`Connected to "${ this.filename }" SQlite database.`);
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
			if (values.length) {
				this.db.run(query, values, function(err: any) {
					if (err) {
						reject(err);
					}
					else {
						zynLog("Sqlite3Db :: modify :: LAST ID ::", this.lastID);
						resolve(this.lastID);
					}
				});
			}
			else {
				this.db.run(query, function(err: any) {
					if (err) {
						reject(err);
					}
					else {
						zynLog("Sqlite3Db :: modify :: LAST ID ::", this.lastID);
						resolve(this.lastID);
					}
				});
			}
		});
	}

	public dbGet(query: string, values?: unknown[]): Promise<any> {
		return new Promise((resolve, reject) => {
			if (values) {
				this.db.all(query, values,  function (err: any, row: any) {
					if (err) {
						console.error(err.message);
						reject(err);
					}
					else {
						zynLog("Sqlite3Db :: dbGet ::", row);
						resolve(row);
					}
				});

			} else {
				this.db.all(query, function (err: any, row: any) {
					if (err) {
						console.error(err.message);
						reject(err);
					}
					else {
						zynLog("Sqlite3Db :: dbGet ::", row);
						resolve(row);
					}
				});
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

	public get(query: string, values?: unknown[]): Promise<any> {
		if (this.type === SqliteDbType.Sqlite) {
			console.log("IS LITE");
			return this.dbGet(query, values);
		}
		else if (this.type === SqliteDbType.Spatialite) {
			console.log("IS GEO");
			return this.spatialGet(query);
		}
	}
}
