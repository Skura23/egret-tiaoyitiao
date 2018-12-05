// 用于存储全局变量
var bus = {
    life: null,
    getLoadingClip: function () {
        // 添加loading动图
        var data = RES.getRes("loading_json");
        var txtr = RES.getRes("loading_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        var mc = new egret.MovieClip(mcFactory.generateMovieClipData("loading"));
        mc.scaleX = 0.5;
        mc.scaleY = 0.5;
        mc.x = 11;
        mc.y = 52;
        mc.gotoAndPlay(0, -1);
        return mc;
    }
};
//# sourceMappingURL=bus.js.map