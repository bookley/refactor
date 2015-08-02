define(["graphics/imageMap"], function(ImageMap) {
    describe('ImageMap', function() {
        it('returns correct coordinates', function() {
            var imageMap = new ImageMap(null, 10, 10, 2, 2);
            expect(imageMap.getCoordsAtIndex(0)).toEqual([0, 0.2, 0.2, 0.2, 0.2, 0, 0, 0]);
        });

        it('should handle rows correctly', function() {
            var imageMap = new ImageMap(null, 10, 10, 2, 2);
            expect(imageMap.getCoordsAtIndex(5)).toEqual([0, 0.4, 0.2, 0.4, 0.2, 0.2, 0, 0.2]);
        });
    });
});