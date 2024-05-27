import * as jsonschema from "jsonschema"

const v = new jsonschema.Validator()

jsonschema.Validator.prototype.customFormats.NotNullString = function (input) {
    if (typeof input !== "string") {
        return false
    }
    return input.trim().length > 0;
};

jsonschema.Validator.prototype.customFormats.HashString32 = function (input) {
    if (typeof input !== "string") {
        return false
    }
    return input.length === 32;
};

export const Schema = {
    resp: {
        "type": "object",
        "properties": {
            "code": { "type": "number" },
            "ts": { "type": "number" },
            "data": { "type": "object" },
        },
        "required": ["code", "ts", "data"]
    },

    user_register: {
        req: {
            "type": "object",
            "properties": {
                "account": { "type": "NotNullString" },
                "name": { "type": "NotNullString" },
                "passhash": { "type": "HashString32" },
            },
            "required": ["account", "name", "passhash"]
        },
        res: {}
    },

    user_request_qywxbotkey: {
        req: {
            "type": "object",
            "properties": {
                "account": { "type": "NotNullString" },
            },
            "required": ["account"]
        },
        res: {}
    },

    user_login: {
        req: {
            "type": "object",
            "properties": {
                "account": { "type": "NotNullString" },
                "qywxbotkey": { "type": "NotNullString" },
            },
            "required": ["account", "qywxbotkey"]
        },
        res: {}
    },

    user_group_set_qywxbotkey: {
        req: {
            "type": "object",
            "properties": {
                "tuid": { "type": "number" },
                "qywxbotkey": { "type": "NotNullString" },
            },
            "required": ["tuid", "qywxbotkey"]
        },
        res: {}
    },

    user_group_set_profile: {
        req: {
            "type": "object",
            "properties": {
                "tuid": { "type": "number" },
                "name": { "type": "NotNullString" },
            },
            "required": ["tuid", "name"]
        },
        res: {}
    },
}

export function Validate(value, schema) {
    return v.validate(value, schema)
}
