import express from "express";
import Config from "./Config.mjs"
import MySqlWrapper from "./MySqlWrapper.mjs";
import User from "./User/User.mjs";
import Permission from "./User/Permission.mjs";
import Code from "./Code.mjs";
import jwt from "jsonwebtoken";
import Common from "./Common.mjs";

Config.Init()

MySqlWrapper.Init(Config.v.db.host, Config.v.db.user, Config.v.db.port, Config.v.db.password, Config.v.db.database)

const app = express();

// middlewares
app.use(express.json())

// authorization
await Permission.Init()

app.use(function (req, res, next) {
    console.log(req.headers);
    let locals = res.locals
    locals.permit = Permission.ByName.get(req.originalUrl)
    if (!locals.permit) {
        return Common.Respond(res, Code.PERMISSION_UNSPECIFIED)
    }

    if (locals.permit.checktoken === 1) {
        let token = req.headers.authorization
        if (!token) {
            return Common.Respond(res, Code.ACCOUNT_UNAUTHORIZED)
        }
        try {
            locals.jwtPayload = jwt.verify(token.substring(7), Config.v.server.secret)
        } catch (error) {
            console.log(error);
            return Common.Respond(res, Code.ACCOUNT_JWT_ERROR)
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
app.listen(Config.v.server.port, () => {
    console.log(`App listening on http://localhost:${Config.v.server.port}`);
});

// routes
User.Register(app)
