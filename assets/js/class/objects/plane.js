export default class{
    constructor({geometryOpt, scene, engine}){
        this.geometryOpt = geometryOpt
        this.scene = scene
        this.engine = engine

        this.init()
    }

    
    // init
    init(){
        this.create()
    }


    // create
    create(){
        const material = this.createMaterial()
        this.mesh = this.createMesh()
        this.mesh.material = material
    }
    createMesh(){
        const mesh = BABYLON.MeshBuilder.CreatePlane('plane', this.geometryOpt, this.scene)
        return mesh
    }
    createMaterial(){
        const material = new BABYLON.StandardMaterial('material', this.scene)
        material.emissiveColor = new BABYLON.Color3(1, 1, 1)
        return material
    }


    // set
    setMaterial(material){
        this.disposeMaterial()
        this.mesh.material = material
    }
    setVerticesBuffer(name, data, size, instanced = false){
        const buffer = new BABYLON.VertexBuffer(this.engine, data, name, true, false, size, instanced);
        this.mesh.setVerticesBuffer(buffer)
    }


    // get
    get(){
        return this.mesh
    }
    getVerticesData(name){
        return this.mesh.getVerticesData(name)
    }
    getVertexBuffer(name){
        return this.mesh.getVertexBuffer(name)
    }
    getMaterial(){
        return this.mesh.material
    }

    
    // dispose
    disposeMaterial(){
        this.mesh.material.dispose()
    }
}