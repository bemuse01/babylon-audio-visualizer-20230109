import ParticleSystem from '../../objects/particleSystem.js'

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

        this.size = 2
        this.countStep = 4
        this.updateSpeed = 0.01

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        const {count, countStep, size, scene, engine, color, radius, updateSpeed} = this

        const len = ~~(count / countStep)
        const texture = new BABYLON.Texture('./assets/src/triangle.png', scene)

        this.ps = new ParticleSystem({
            capacity: len,
            size: {minSize: size, maxSize: size},
            lifeTime: {minLifeTime: 2, maxLifeTime: 2},
            emitRate: len,
            // emitPower: {minEmitPower: 1, maxEmitPower: 1},
            updateSpeed,
            texture,
            scene,
        })

        this.ps.setEmitter('createCylinderEmitter', [radius, 0, 0, 0])
    }
}