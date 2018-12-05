var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var PublicScene = (function (_super) {
    __extends(PublicScene, _super);
    function PublicScene() {
        var _this = _super.call(this) || this;
        // UI skin加载完毕后，调用自定义的init初始化方法
        // this.init();
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.init, _this);
        _this.skinName = "resource/scene/PublicScene.exml";
        return _this;
    }
    // protected partAdded(partName:string,instance:any):void
    // {
    // 	super.partAdded(partName,instance);
    // }
    PublicScene.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    PublicScene.prototype.init = function () {
        this.foo.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log('click foo');
        }, this);
        console.log('public scene');
    };
    return PublicScene;
}(eui.Component));
__reflect(PublicScene.prototype, "PublicScene");
//# sourceMappingURL=PublicScene.js.map