/**
 * Created by Jamie on 20-Jul-15.
 */
export class Asset {
    data:string;
    name:string;
    type:string;

    constructor(data:string, name:string, type:string) {
        this.data = data;
        this.name = name;
        this.type = type;
    }
}