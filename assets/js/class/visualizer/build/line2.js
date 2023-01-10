export default class{
    constructor({
        engine,
        scene,
        camera,
        audio
    }){
        this.engine = engine
        this.scene = scene
        this.camera = camera
        this.audio = audio

        this.count = 120
        this.radius = 25
        this.color = BABYLON.Color3.FromHexString('#72ffe9')

        this.init()
    }


    // init
    init(){

    }


    // create
    create(){

    }
}