import Particle from '../../objects/particle.js'

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
        this.tessellation = 3

        this.init()
    }


    // init
    init(){
        this.create()
    }


    // create
    create(){
        
    }
}