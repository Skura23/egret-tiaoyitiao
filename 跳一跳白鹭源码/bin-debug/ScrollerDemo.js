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
var ScrollerDemo = (function (_super) {
    __extends(ScrollerDemo, _super);
    function ScrollerDemo() {
        return _super.call(this) || this;
    }
    ScrollerDemo.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        //创建一个容器，里面包含一张图片
        var group = new eui.Group();
        var img = new eui.Image("/resource/assets/bg.jpg");
        group.addChild(img);
        //创建一个Scroller
        var myScroller = new eui.Scroller();
        //注意位置和尺寸的设置是在Scroller上面，而不是容器上面
        myScroller.width = 200;
        myScroller.height = 200;
        //设置viewport
        myScroller.viewport = group;
        this.addChild(myScroller);
    };
    return ScrollerDemo;
}(eui.Group));
__reflect(ScrollerDemo.prototype, "ScrollerDemo");
//# sourceMappingURL=ScrollerDemo.js.map