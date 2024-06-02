export default class Rect {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} w 
     * @param {number} h 
     */
    constructor(x, y, w, h) {
        this.x = x || 0
        this.y = y || 0
        this.w = w || 0
        this.h = h || 0
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

    /**
     * 
     * @param {Point} p 
     * @returns 
     */
    contains(p) {
        return this.x <= p.x && p.x <= this.x + this.w
            && this.y <= p.y && p.y <= this.y + this.h
    }
}
