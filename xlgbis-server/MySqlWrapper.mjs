import mysql from "mysql2";
import Code from "./Code.mjs";

export default class MySqlWrapper {
    #host
    #user
    #port
    #password
    #database
    /**
     * @type {mysql.PoolConnection}
     */
    #conn = null
    /**
     * @type {mysql.Pool}
     */
    #pool = null
    #tasks = []
    #querying = false

    /**
     * @type {MySqlWrapper}
     */
    static Inst;

    static Init(host, user, port, password, database) {
        MySqlWrapper.Inst = new MySqlWrapper(host, user, port, password, database)
    }

    constructor(host, user, port, password, database) {
        this.#host = host
        this.#user = user
        this.#port = port
        this.#password = password
        this.#database = database
        this.#pool = mysql.createPool({
            host: this.#host,
            user: this.#user,
            port: this.#port,
            password: this.#password,
            database: this.#database
        })
    }

    /**
     * 
     * @param {String} sql 
     * @returns {Promise<import("./Common.mjs").IResp>}
     */
    Query(sql) {
        return new Promise((resolve) => {
            const wrapper = (resp) => { resolve(resp) }
            if (this.#querying) {
                this.#tasks.push({ sql, wrapper })
                return
            }

            this.#querying = true
            this.#DoConnect(sql, wrapper)
        })
    }

    #DoConnect(sql, callback) {
        this.#pool.getConnection((err, conn) => {
            if (err) {
                callback({
                    code: Code.DB_GET_CONN_ERR,
                    ts: Date.now(),
                })
                this.#querying = false
                return
            }

            this.#conn = conn
            this.#conn.connect((err) => {
                if (err) {
                    callback({
                        code: Code.DB_CONN_ERR,
                        ts: Date.now(),
                    })
                    this.#conn.release()
                    this.#querying = false
                    return
                }

                this.#DoQuery(sql, callback)
            })
        })
    }

    #DoQuery(sql, callback) {
        console.log(`[MYSQL]: ${sql}`);
        this.#conn.query(sql, (err, result) => {
            if (err) {
                console.log(err);
                callback({
                    code: Code.DB_QUERY_ERR,
                    ts: Date.now(),
                })
                this.#conn.release()
                this.#querying = false
                return
            }

            callback({
                code: Code.SUCCESS,
                ts: Date.now(),
                data: result
            })
            this.#conn.release()

            if (this.#tasks.length > 0) {
                const next = this.#tasks.shift()
                this.#DoConnect(next.sql, next.callback)
            } else {
                this.#querying = false
            }
        })
    }
}
