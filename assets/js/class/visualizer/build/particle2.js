import Circle from '../../objects/circle.js'

export default class{
    constructor({
        engine,
        scene,
        camera,
        count,
        radius,
        color,
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.count = count
        this.radius = radius
        this.color = color

        this.size = 2.5
        this.tessellation = 3
        this.countStep = 4
        this.moveDist = 1.5
        this.circles = []
        this.opacityStep = [0, 0.25, 0.5, 1, 1, 0]
        this.twAnimLength = 3000
        this.twAnimDelay = {base: 0, rand: 3000}

        this.init()
    }


    // init
    init(){
        this.create()
        this.initTween()
    }


    // create
    create(){
        const {count, countStep, radius, size, tessellation, scene, engine} = this

        const len = ~~(count / countStep)
        const degree = 360 / len

        for(let i = 0; i < len; i++){
            const material = this.createMaterial()

            const circle = new Circle({
                geometryOpt: {
                    radius: size,
                    tessellation,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE
                },
                scene,
                engine
            })

            circle.setMaterial(material)

            const deg = degree * i * RADIAN
            const x = Math.cos(deg) * radius
            const y = Math.sin(deg) * radius

            circle.get().position.x = x
            circle.get().position.y = y
            circle.get().rotation.x = Math.random() * 360 * RADIAN
            circle.get().rotation.y = Math.random() * 360 * RADIAN
            circle.get().rotation.z = Math.random() * 360 * RADIAN

            circle.deg = deg

            this.circles.push(circle)
        }
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = this.color
        material.alpha = 0
        return material
    }
    

    initTween(){
        this.circles.forEach(circle => {
            this.createTween(circle)
        })
    }
    createTween(circle){
        const {radius, moveDist, opacityStep, twAnimLength, twAnimDelay, count, countStep} = this
        const start = {radius, opacity: 0}
        const end = {radius: radius * moveDist, opacity: opacityStep}
        const delay = Math.random() * twAnimDelay.rand + twAnimDelay.base

        const tw = new TWEEN
        .Tween(start)
        .to(end, twAnimLength)
        .delay(delay)
        .repeat(Infinity)
        .onStart(() => this.onStartTween(circle, count, countStep))
        .onComplete(() => this.onCompleteTween(circle))
        .onUpdate(() => this.onUpdateTween(circle, start))
        .start()
    }
    onStartTween(circle, count, countStep){
        const len = ~~(count / countStep)
        const degree = 360 / len
        const idx = ~~(Math.random() * len)

        circle.deg = idx * degree * RADIAN
    }
    onCompleteTween(circle){
        this.createTween(circle)
    }
    onUpdateTween(circle, {radius, opacity}){
        const material = circle.getMaterial()
        const deg = circle.deg
        const x = Math.cos(deg) * radius
        const y = Math.sin(deg) * radius

        circle.get().position.x = x
        circle.get().position.y = y
        // circle.get().rotation.x += 0.005
        // circle.get().rotation.y += 0.005
        // circle.get().rotation.z += 0.005

        material.alpha = opacity
    }
}