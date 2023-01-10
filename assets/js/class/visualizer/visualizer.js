import Method from '../../method/method.js'

import Line from './build/line.js'

export default class{
    constructor({app, audio}){
        this.engine = app.engine
        this.audio = audio

        this.scene = null
        this.camera = null
        this.cameraName = 'visualizerCamaera'
        this.cameraPos = new BABYLON.Vector3(0, 0, -100)
        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.vw = null
        this.vh = null
        this.rttSamples = 2 ** 3
        
        const color1 = BABYLON.Color3.FromHexString('#4dfff9')
        const color2 = BABYLON.Color3.FromHexString('#4d33ea')
        const scale = 0.85

        this.params = [
            {
                module: Line
            }
        ]
        this.comps = []

        this.init()
    }


    // init
    init(){
        this.create()
        this.render()

        window.addEventListener('resize', () => this.resize(), false)
    }


    // create
    create(){
        this.createRenderObject()
        this.createObject()
        this.createPostProcess()
    }
    createRenderObject(){
        this.scene = new BABYLON.Scene(this.engine)
        this.scene.autoClear = false
        // this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

        this.camera = new BABYLON.FreeCamera(this.cameraName, this.cameraPos, this.scene)
        this.camera.setTarget(BABYLON.Vector3.Zero())
        
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)

        // this.rtt = new BABYLON.RenderTargetTexture(Method.uuidv4(), {width: this.rw, height: this.rh}, this.scene)
        // this.rtt.samples = this.rttSamples
        // this.scene.customRenderTargets.push(this.rtt)
    }
    createObject(){
        for(const param of this.params){
            const instance = param.module

            this.comps.push(
                new instance({
                    scene: this.scene, 
                    engine: this.engine, 
                    audio: this.audio, 
                    camera: this.camera, 
                    // rtt: this.rtt,
                    ...param
                })
            )
        }
    }
    createPostProcess(){
        this.createGlow()
    }
    createGlow(){
        this.glow = new BABYLON.GlowLayer('glow', this.scene, 
            {
                // mainTextureRatio: 1,
                // mainTextureSamples: 2,
                // mainTextureFixedSize: 512,
                // blurKernelSize: 64,
            }
        )
        // this.glow.intensity = 0.6
        // this.glow2 = new BABYLON.GlowLayer('glow2', this.scene, 
        //     {
        //         // mainTextureRatio: 1,
        //         mainTextureSamples: 8,
        //         mainTextureFixedSize: 1024,
        //         blurKernelSize: 16,
        //     }
        // )
        // this.glow2.intensity = 0.6
    }


    // render
    render(){
        this.engine.runRenderLoop(() => {
            this.engine.clear(true, true, false)
            this.renderScene()
            this.animateComps()
        })
    }
    renderScene(){
        this.scene.render()
    }
    animateComps(){
        this.comps.forEach(comp => {
            if(comp.animate) comp.animate()
        })
    }


    // resize
    resize(){
        this.resizeViewports()
        this.resizeComps()
    }
    resizeViewports(){
        this.rw = this.engine.getRenderWidth()
        this.rh = this.engine.getRenderHeight()
        this.aspect = this.engine.getAspectRatio(this.camera)
        this.vw = Method.getVisibleWidth(this.camera, this.aspect, 0)
        this.vh = Method.getVisibleHeight(this.camera, 0)
    }
    resizeComps(){
        this.comps.forEach(comp => {
            if(comp.resize) comp.resize()
        })
    }
}