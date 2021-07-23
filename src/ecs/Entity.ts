import IComponent from "./IComponent"
export default abstract class Entity 
{
    private _name: String
    private _id: String
    protected _components: Array<IComponent> = []

    create(name:String) {
        this._name = name
    }

    addComponent(){

    }

    removeComponent(){

    }

    
}