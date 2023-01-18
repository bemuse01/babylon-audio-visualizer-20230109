import ParticleSystem from '../../objects/particleSystem.js'
import Method from '../../../method/method.js'

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

        this.size = 5
        this.countStep = 2
        this.updateSpeed = 0.008
        this.texturePath = './assets/src/triangle.png'
        this.alphaStep = [0, 0.5, 1, 1, 1, 0]
        this.moveDistRatio = 1.9

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    async create(){
        const {count, countStep, size, scene, color, texturePath, alphaStep, updateSpeed} = this

        const len = ~~(count / countStep)
        const texture = await this.loadTexture()
        const color1 = new BABYLON.Color4(color.r, color.g, color.b, 1)
        const colorDead = new BABYLON.Color4(0, 0, 0, 0)
        const emitter = this.createEmitter()

        this.ps = new ParticleSystem({
            capacity: len,
            size: {minSize: size, maxSize: size},
            lifeTime: {minLifeTime: 2, maxLifeTime: 2},
            emitRate: ~~(len / 5),
            // emitPower: {minEmitPower: 1, maxEmitPower: 1},
            angularSpeed: {minAngularSpeed: 0.25, maxAngularSpeed: 0.5},
            initRotation: Math.PI / 2,
            updateSpeed,
            texture,
            scene,
        })

        // this.ps.setSEmitter('createCylinderEmitter', [radius, 0, 0, 0])
        this.ps.setCustomEmitter(emitter)

        this.ps.setColor(color1, color1, colorDead)

        this.ps.setRampGradients(alphaStep)
    }
    createEmitter(){
        const {radius, moveDistRatio} = this

        const emitter = new BABYLON.CustomParticleEmitter()

        let id = 0

        emitter.particlePositionGenerator = (idx, particle, out) => {
            const time = window.performance.now()
            const n = (SIMPLEX.noise2D(idx, time * 0.1) + 1) / 2
            const deg = n * 360 * RADIAN

            out.x = Math.cos(deg) * radius
            out.y = Math.sin(deg) * radius
            out.z = 0

            id += 0.1
        }

        emitter.particleDestinationGenerator = (idx, particle, out) => {
            const time = window.performance.now()
            const n = (SIMPLEX.noise2D(idx, time * 0.1) + 1) / 2
            const deg = n * 360 * RADIAN

            out.x = Math.cos(deg) * radius * moveDistRatio
            out.y = Math.sin(deg) * radius * moveDistRatio
            out.z = 0
        }

        return emitter
    }


    // load
    loadTexture(){
        return new Promise((resolve, reject) => {
            const texture = new BABYLON.Texture(this.texturePath, this.scene)

            texture.onLoadObservable.add(() => resolve(texture))
        })
    }
}