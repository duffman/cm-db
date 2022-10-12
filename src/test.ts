/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2022-10-12 13:26
 */
import { ZynDbBase } from "./zyn-db-base";

export async function f() {
	let filename = "/Users/patrik/IKEA/ts-backend/data/sessions.db3";

	let base = new ZynDbBase();
	let result = await base.initDatabase("/Users/patrik/IKEA/ts-backend/data/sessions.db3")

	console.log("RESULT ::", result);

	let data = JSON.stringify({ kalle: "kula" });
	let insertQ = `INSERT INTO web_sessions (created,ttl,data) VALUES ('1665573824468','36000','${data}')`;

	let qRes = await base.execute(insertQ);

	console.log("Query Resut ::", qRes);






}

f();
