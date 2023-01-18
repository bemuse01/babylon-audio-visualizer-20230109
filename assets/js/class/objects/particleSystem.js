export default class{
    constructor({
        capacity,
        size = {minSize: 1, maxSize: 1},
        emitRate = 50,
        lifeTime = {minLifeTime: 1, maxLifeTime: 1},
        emitPower = {minEmitPower: 1, maxEmitPower: 1},
        updateSpeed = 0.005,
        texture,
        scene
    }){
        this.capacity = capacity
        this.size = size
        this.emitRate = emitRate
        this.lifeTime = lifeTime
        this.texture = texture
        this.emitPower = emitPower
        this.updateSpeed = updateSpeed
        this.scene = scene

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        this.ps = new BABYLON.ParticleSystem('particleSystem', this.capacity, this.scene)

        this.ps.particleTexture = this.texture

        this.ps.emitter = BABYLON.Vector3.Zero()

        this.ps.emitRate = this.emitRate
        
        this.ps.color1 = new BABYLON.Color4(1, 1, 1, 1.0)
        this.ps.color2 = new BABYLON.Color4(1, 1, 1, 1.0)
        this.ps.colorDead = new BABYLON.Color4(1, 1, 1, 0.0)

        this.ps.minSize = this.size.minSize
        this.ps.maxSize = this.size.maxSize

        this.ps.minLifeTime = this.lifeTime.minLifeTime
        this.ps.maxLifeTime = this.lifeTime.maxLifeTime

        this.ps.minEmitPower = this.emitPower.minEmitPower
        this.ps.maxEmitPower = this.emitPower.maxEmitPower
        this.ps.updateSpeed = this.updateSpeed

        console.log(this.ps)

        this.ps.start()
    }


    // set
    setEmitter(type, params){
        this.ps[type](...params)
    }
    setColor(){

    }


    // get
    get(){
        return this.ps
    }
}