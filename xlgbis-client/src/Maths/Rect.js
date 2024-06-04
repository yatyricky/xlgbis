export default class Rect {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    set(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    contains(p) {
        return this.x <= p.x && p.x <= this.x + this.w
            && this.y <= p.y && p.y <= this.y + this.h
    }

    ToString() {
        return `(${this.x},${this.y},${this.w},${this.h})`
    }
}
