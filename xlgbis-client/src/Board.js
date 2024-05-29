class Watchable {
    #handlers = new Set()

    subscribe(handler) {
        this.#handlers.add(handler)
    }

    unsubscribe(handler) {
        this.#handlers.delete(handler)
    }

    _invokeHandlers(values) {
        for (const handler of this.#handlers) {
            handler(values)
        }
    }
}

class WatchableArray extends Watchable {
    #values = []
    #keyId = 0

    push(value) {
        if (typeof value === "object") {
            if (value.key === undefined) {
                value.key = (++this.#keyId).toString()
            }
        }
        this.#values.push(value)
        this._invokeHandlers(this.#values)
    }

    pop() {
        let val = this.#values.pop()
        this._invokeHandlers(this.#values)
        return val
    }

    remove(index) {
        let [val] = this.#values.splice(index, 1)
        this._invokeHandlers(this.#values)
        return val
    }

    removeItem(item) {
        this.#values = this.#values.filter(e => e !== item)
        this._invokeHandlers(this.#values)
        return this.#values
    }

    filterInPlace(filter) {
        this.#values = this.#values.filter(filter)
        this._invokeHandlers(this.#values)
        return this.#values
    }

    get(index) {
        if (index !== undefined) {
            return this.#values[index]
        } else {
            return this.#values
        }
    }

    findIndex(predicate) {
        return this.#values.findIndex(predicate)
    }

    filter(predicate) {
        return this.#values.filter(predicate)
    }

    set(index, elem) {
        this.#values[index] = elem
        this._invokeHandlers(this.#values)
    }

    foreach(action) {
        for (const elem of this.#values) {
            action(elem)
        }
        this._invokeHandlers(this.#values)
    }
}

class WatchableValue extends Watchable {
    #value

    set(value) {
        this.#value = value
        this._invokeHandlers(this.#value)
    }

    get() {
        return this.#value
    }
}

class Board {
    static toasts = new WatchableArray() // header: string, message: string, level: 0|1|2, key: auto<string>, expire: auto<number(ms)>
    static token = new WatchableValue();
    static panels = new WatchableArray(); // key, type, place, title
}

window.dbgBoard = Board

export default Board
