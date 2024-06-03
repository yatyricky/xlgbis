export default class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y)
    }

    subSelf(other) {
        this.x -= other.x
        this.y -= other.y
    }

    set(x, y) {
        this.x = x
        this.y = y
        return this
    }

    setTo(o) {
        this.x = o.x
        this.y = o.y
        return this
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
}
