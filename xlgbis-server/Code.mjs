class CodeIncrement {
    constructor(scope) {
        this.scope = scope
    }

    Next() {
        return this.scope++
    }
}

const db = new CodeIncrement(1000)
const acc = new CodeIncrement(2000)
const permission = new CodeIncrement(3000)

const Code = {
    SUCCESS: 0,
    ERROR: 1,

    DB_GET_CONN_ERR: db.Next(),
    DB_CONN_ERR: db.Next(),
    DB_QUERY_ERR: db.Next(),
    DB_INSERT_USER_ERR: db.Next(),

    ACCOUNT_INVALID_INPUT: acc.Next(),
    ACCOUNT_ALREADY_EXISTS: acc.Next(),
    ACCOUNT_NOT_GRANTED: acc.Next(),
    ACCOUNT_NOT_EXISTS: acc.Next(),
    ACCOUNT_QYWXBOTKEY_FAILED: acc.Next(),
    ACCOUNT_QYEXBOTKEY_MISMATCH: acc.Next(),
    ACCOUNT_UNAUTHORIZED: acc.Next(),
    ACCOUNT_JWT_ERROR: acc.Next(),

    PERMISSION_NOT_EXISTS: permission.Next(),
    PERMISSION_DENIAL: permission.Next(),
    PERMISSION_UNSPECIFIED: permission.Next(),
    PERMISSION_REQ_MISSING_BOOK_ID: permission.Next(),
}

export default Code;
