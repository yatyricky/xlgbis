export default class System {
    static Inst = new System()

    constructor() {
        this.objects = []
    }

    AddObject(obj) {
        this.objects.push(obj)
    }

    Awake() {
        for (const elem of this.objects) {
            elem.Awake()
        }
    }

    Start() {
        for (const elem of this.objects) {
            elem.Start()
        }
    }
}
