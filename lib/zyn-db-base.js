"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZynDbBase = void 0;
var sqlite3_db_1 = require("./integrations/sqlite3/sqlite3-db");
var sqlite3_db_2 = require("./integrations/sqlite3/sqlite3-db");
var sqlite3_db_type_1 = require("./integrations/sqlite3/sqlite3-db.type");
var fs_1 = require("fs");
var path_1 = require("path");
var ZynDbBase = /** @class */ (function () {
    function ZynDbBase() {
    }
    /**
     * Locate database file and initialze
     * @param {string} dbFilename
     * @param {SqliteDbType} dbType
     * @param {string} dbPath
     * @returns {Promise<boolean>}
     */
    ZynDbBase.prototype.initDatabase = function (dbFilename, dbType, createIfNotExist) {
        if (dbType === void 0) { dbType = sqlite3_db_type_1.SqliteDbType.Sqlite; }
        return __awaiter(this, void 0, void 0, function () {
            var result, userDB, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        this.dbFilename = (0, path_1.basename)(dbFilename);
                        this.dbFullFilename = dbFilename;
                        if (!(0, fs_1.existsSync)(dbFilename)) {
                            if (createIfNotExist) {
                                userDB = new this.sqlite.db(dbFilename, this.sqlite.openReadWrite | this.sqlite.openCreate, function (err) {
                                    if (!err) {
                                        _this.execute("CREATE TABLE \"web_sessions\" (\n"
                                            + "\t\"id\"\tINTEGER,\n"
                                            + "\t\"created\"\tINTEGER,\n"
                                            + "\t\"ttl\"\tINTEGER,\n"
                                            + "\t\"data\"\tTEXT,\n"
                                            + "\t\"last_access\"\tINTEGER,\n"
                                            + "\tPRIMARY KEY(\"id\" AUTOINCREMENT)\n"
                                            + ");");
                                    }
                                });
                            }
                            else
                                throw new Error("initDatabase :: database \"".concat(dbFilename, "\" does not exist."));
                        }
                        this.sqlite = new sqlite3_db_2.Sqlite3Db(dbType, this.dbFullFilename);
                        return [4 /*yield*/, this.sqlite.connect()];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        (0, sqlite3_db_1.zynLog)("fatal", "ZynDbBase :: initDatabase", e_1);
                        result = false;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, result];
                }
            });
        });
    };
    ZynDbBase.prototype.execute = function (query) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var result, isSelect, connectResult, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        isSelect = query.toLowerCase().trim().startsWith("select");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        connectResult = false;
                        if (!this.sqlite) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sqlite.connect()];
                    case 2:
                        connectResult = _a.sent();
                        if (!connectResult)
                            throw new Error("Unable to connect database \"".concat(this.dbFilename, "\""));
                        return [3 /*break*/, 4];
                    case 3: throw new Error("Internal Error: Database Object not assigned");
                    case 4:
                        if (!isSelect) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sqlite.get(query, values)];
                    case 5:
                        result = _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this.sqlite.modify(query, values)];
                    case 7:
                        result = _a.sent();
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_2 = _a.sent();
                        (0, sqlite3_db_1.zynLog)("error", "ZynDbBase ::", e_2);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, result];
                }
            });
        });
    };
    return ZynDbBase;
}());
exports.ZynDbBase = ZynDbBase;
//# sourceMappingURL=zyn-db-base.js.map