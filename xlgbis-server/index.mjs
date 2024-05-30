import express from "express";
import Config from "./Config.mjs"
import MySqlWrapper from "./MySqlWrapper.mjs";
import User from "./User/User.mjs";
import Permission from "./User/Permission.mjs";
import Code from "./Code.mjs";
import jwt from "jsonwebtoken";
import Common from "./Common.mjs";
import Encryption from "./Encryption.mjs";

MySqlWrapper.Init(Config.db.host, Config.db.user, Config.db.port, Config.db.password, Config.db.database)

const app = express();

// middlewares
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(express.json())

// authorization
await Permission.Init()

app.use(function (req, res, next) {
    let locals = res.locals
    locals.permit = Permission.ByName.get(req.originalUrl)
    if (!locals.permit) {
        return Common.Respond(res, Code.PERMISSION_UNSPECIFIED)
    }

    if (locals.permit.checktoken === 1) {
        let token = req.headers.authorization
        if (!token) {
            return Common.Respond(res, Code.USER_UNAUTHORIZED)
        }
        try {
            let encPayload = jwt.verify(token.substring(7), Config.server.secret)
            let payload = Encryption.DecodeSimple(encPayload.data)
            if (!payload) {
                return Common.Respond(res, Code.USER_JWT_VALIDATION_ERROR)
            }
            locals.jwtPayload = payload
        } catch (error) {
            console.error(error);
            return Common.Respond(res, Code.USER_JWT_ERROR)
        }
    }
    next();
})

Common.ExpressUseAsync(app, async function (req, res, next) {
    let locals = res.locals
    if (locals.permit.checktoken === 1) {
        if (locals.permit.checkbook === 1) {
            let body = req.body
            if (!body || typeof body.bid !== "number") {
                return Common.Respond(res, Code.PERMISSION_REQ_MISSING_BOOK_ID)
            }
            if (!await User.UserHasPermission(locals.jwtPayload.uid, locals.permit.pid, body.bid)) {
                return Common.Respond(res, Code.PERMISSION_DENIAL)
            }
        } else {
            if (!await User.UserHasPermission(locals.jwtPayload.uid, locals.permit.pid)) {
                return Common.Respond(res, Code.PERMISSION_DENIAL)
            }
        }
    }
    

    next()
})

// start server
app.listen(Config.server.port, () => {
    console.info(`App listening on http://localhost:${Config.server.port}`);
});

// routes
User.Register(app)
