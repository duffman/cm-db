"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sqlite3Db = exports.zynLog = void 0;
var sqlite3_db_type_1 = require("./sqlite3-db.type");
function zynLog() {
    var data = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        data[_i] = arguments[_i];
    }
    function al() {
    }
}
exports.zynLog = zynLog;
var Sqlite3Db = /** @class */ (function () {
    function Sqlite3Db(type, filename) {
        this.type = type;
        this.filename = filename;
        switch (type) {
            case sqlite3_db_type_1.SqliteDbType.Sqlite:
                this.sqliteDb = require('sqlite3').verbose();
                break;
            case sqlite3_db_type_1.SqliteDbType.Spatialite:
                this.sqliteDb = require('spatialite');
                break;
        }
    }
    /**
     * Connect to file based database
     * @returns {Promise<boolean>}
     */
    Sqlite3Db.prototype.connect = function () {
        var _this = this;
        zynLog("Connecting to database ::", this.filename);
        return new Promise(function (resolve, reject) {
            _this.db = new _this.sqliteDb.Database(_this.filename, function (err) {
                if (err) {
                    zynLog("error", err.message);
                    zynLog("Connection to database \"".concat(_this.filename, "\" failed."));
                    reject(err);
                }
                else {
                    zynLog("Connected to \"".concat(_this.filename, "\" SQlite database."));
                    resolve(true);
                }
            });
        });
    };
    Sqlite3Db.prototype.execute = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.run(query, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.lastID);
                }
            });
        });
    };
    Sqlite3Db.prototype.modify = function (query, values) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (values.length) {
                _this.db.run(query, values, runCallback.bind(_this));
            }
            else {
                _this.db.run(query, runCallback.bind(_this));
            }
            function runCallback(err) {
                if (err) {
                    reject(err);
                }
                else {
                    zynLog("Sqlite3Db :: modify :: LAST ID ::", this.lastID);
                    resolve(this.lastID);
                }
            }
        });
    };
    Sqlite3Db.prototype.dbGet = function (query, values) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (values) {
                _this.db.all(query, values, getCallback);
            }
            else {
                _this.db.all(query, getCallback);
            }
            function getCallback(err, row) {
                if (err) {
                    console.error(err.message);
                    reject(err);
                }
                else {
                    zynLog("Sqlite3Db :: dbGet ::", row);
                    resolve(row);
                }
            }
        });
    };
    Sqlite3Db.prototype.spatialGet = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.spatialite(function (err) {
                _this.db.get(query, function (err, row) {
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
    };
    Sqlite3Db.prototype.get = function (query, values) {
        if (this.type === sqlite3_db_type_1.SqliteDbType.Sqlite) {
            return this.dbGet(query, values);
        }
        else if (this.type === sqlite3_db_type_1.SqliteDbType.Spatialite) {
            return this.spatialGet(query);
        }
    };
    return Sqlite3Db;
}());
exports.Sqlite3Db = Sqlite3Db;
//# sourceMappingURL=sqlite3-db.js.map