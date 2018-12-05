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
var BeginScene = (function (_super) {
    __extends(BeginScene, _super);
    function BeginScene() {
        return _super.call(this) || this;
    }
    BeginScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    BeginScene.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        var mc0 = bus.getLoadingClip();
        this.loadingPop.addChild(mc0);
        // 页面加载完毕后，调用自定义的初始化方法
        this.init();
    };
    // 初始化(给开始按钮绑定点击事件)
    // z 点击开始按钮切换场景
    BeginScene.prototype.init = function () {
        this.beginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapHandler, this);
        // 下方按钮事件绑定
        this.btnWra.getChildAt(0).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = false;
            // this.rankPanel.visible = true;
            SceneMange.getInstance().publicScene.rankPanel.visible = true;
            SceneMange.getInstance().publicScene.rankAjax();
        }, this);
        this.btnWra.getChildAt(1).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // this.beginWra.visible = false;
        }, this);
        this.btnWra.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = false;
            this.gameRulePop.visible = true;
        }, this);
        this.ruleClose.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = true;
            this.gameRulePop.visible = false;
        }, this);
        SceneMange.getInstance().publicScene.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = true;
            SceneMange.getInstance().publicScene.rankArrCollection.source = [];
        }, this);
    };
    BeginScene.prototype.tapHandler = function () {
        // 切换场景
        var req = new egret.HttpRequest();
        var params = "?curLife=" + bus.life;
        req.responseType = egret.HttpResponseType.TEXT;
        req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife" + params, egret.HttpMethod.GET);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send();
        // 类似beforeSend, 发送前执行
        this.loadingPop.visible = true;
        this.beginBtn.touchEnabled = false;
        // this.restart.touchEnabled = false;
        req.addEventListener(egret.Event.COMPLETE, onSuccess, this);
        // req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
        // }, this)
        // todo loading 弹窗; 生命数初始载入问题;
        function onSuccess(event) {
            var request = event.currentTarget;
            var data = JSON.parse(request.response).data;
            egret.setTimeout(function () {
                bus.life = data.curLife;
                SceneMange.getInstance().changeScene('gameScene');
                this.loadingPop.visible = false;
                this.beginBtn.touchEnabled = true;
            }, this, 600);
        }
    };
    // 移除事件
    BeginScene.prototype.release = function () {
        if (this.beginBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.beginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tapHandler, this);
        }
    };
    return BeginScene;
}(eui.Component));
__reflect(BeginScene.prototype, "BeginScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=BeginScene.js.map