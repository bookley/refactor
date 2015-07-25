/**
 * Created by Jamie on 25-Jul-15.
 */
class ImageMap {
    private width:number;
    private height:number;
    private tileHeight:number;
    private tileWidth:number;

    constructor(width:number, height:number, tileWidth:number, tileHeight:number){
        this.width = width;
        this.height = height;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    }

    /**
     *
     * @param index An index into the imageMap
     * @returns {{U: number, V: number}} The U and V coordinates of the resulting texture
     */
    getCoordsAtIndex(index:number){
        var finalWidth = index * this.tileWidth;
        var x:number, y:number;

        if(finalWidth > this.width) {
            var rowNum = Math.ceil(this.width / finalWidth);
            var offset = finalWidth & this.width;

            x = offset;
            y = rowNum * this.tileHeight;
        } else {
            x = finalWidth;
            y = 0;
        }

        return {
            U: x / this.width,
            V: y / this.height
        };
    }

}

export = ImageMap;