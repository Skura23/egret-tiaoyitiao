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
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, function () {
            console.log(12);
        }, _this);
        return _this;
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
        var publicScene = SceneMange.getInstance().publicScene;
        this.beginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapHandler, this);
        // 下方按钮事件绑定
        this.btnWra.getChildAt(0).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = false;
            // this.rankPanel.visible = true;
            publicScene.rankPanel.visible = true;
            publicScene.rankAjax();
            var req = new egret.HttpRequest();
            // var params = "?curLife="+bus.life;
            // var params = bus.testId;
            req.responseType = egret.HttpResponseType.TEXT;
            // req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
            req.open("http://jmgzh.jo.cn/yx/tyt_zhu/g_paih", egret.HttpMethod.GET);
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            req.send();
            // 类似beforeSend, 发送前执行
            // this.restart.touchEnabled = false;
            req.addEventListener(egret.Event.COMPLETE, onSuccess, this);
            // req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
            // }, this)
            // todo loading 弹窗; 生命数初始载入问题;
            function onSuccess(event) {
                var request = event.currentTarget;
                // 相邻排行数据
                var data = JSON.parse(request.response).msg;
                SceneMange.getInstance().publicScene.userRankCollection.source = [{
                        rankOrder: data.scroe.ph,
                        rankHead: data.scroe.headimgurl,
                        rankName: data.scroe.nickname,
                        rankPoint: data.scroe.zscore
                    }];
            }
        }, this);
        // 品牌故事按钮
        this.btnWra.getChildAt(1).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // this.beginWra.visible = false;
            this.beginWra.visible = false;
            this.brandStoryPop.visible = true;
        }, this);
        // 规则按钮
        this.btnWra.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = false;
            this.gameRulePop.visible = true;
        }, this);
        this.brandStoryClose.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = true;
            this.brandStoryPop.visible = false;
        }, this);
        this.ruleClose.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = true;
            this.gameRulePop.visible = false;
        }, this);
        publicScene.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = true;
            publicScene.rankArrCollection.source = [];
        }, this);
        publicScene.sharePanel.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.beginWra.visible = true;
            // this.overPanel.visible = true;
        }, this);
        this.beginInitAjax();
        // this.addWxShare()
    };
    // public addWxShare(){
    // 	var req = new egret.HttpRequest();
    // 	// var params = "?curLife="+bus.life;
    // 	// var params = bus.testId;
    // 	req.responseType = egret.HttpResponseType.TEXT;
    // 	// req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
    // 	req.open("http://jmgzh.jo.cn/yx/tyt_zhu/fenxiang",egret.HttpMethod.GET);
    // 	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 	req.send();
    // 	// 类似beforeSend, 发送前执行
    // 	// this.restart.touchEnabled = false;
    // 	req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
    // 	// req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
    // 	// }, this)
    // 	// todo loading 弹窗; 生命数初始载入问题;
    // 	function onSuccess(event:egret.Event):void{
    // 		var request = <egret.HttpRequest>event.currentTarget;
    // 		var data = JSON.parse(request.response);
    // 		console.log(data,'分享');
    // 		wx.config({
    // 			debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    // 			appId: data.appId, // 必填，公众号的唯一标识
    // 			timestamp: data.timestamp, // 必填，生成签名的时间戳
    // 			nonceStr: data.nonceStr, // 必填，生成签名的随机串
    // 			signature: data.signature,// 必填，签名
    // 			jsApiList: [
    // 				'onMenuShareTimeline',
    // 				'onMenuShareAppMessage',
    // 				'onMenuShareQQ',
    // 				'onMenuShareWeibo',
    // 				'openLocation',
    // 				'hideOptionMenu',
    // 				'closeWindow'
    // 			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // 		});
    // 		// 分享到朋友
    // 		wx.onMenuShareAppMessage({
    // 			title: '', // 分享标题
    // 			desc: '', // 分享描述
    // 			link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // 			imgUrl: '', // 分享图标
    // 			type: '', // 分享类型,music、video或link，不填默认为link
    // 			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    // 			success: function () {
    // 				console.log('share');
    // 				// 用户点击了分享后执行的回调函数
    // 				var req = new egret.HttpRequest();
    // 				// var params = "?curLife="+bus.life;
    // 				// var params = bus.testId;
    // 				req.responseType = egret.HttpResponseType.TEXT;
    // 				// req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
    // 				req.open("http://jmgzh.jo.cn/yx/?tyt_zhu/p_smz",egret.HttpMethod.GET);
    // 				req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 				req.send();
    // 			}
    // 		});
    // 		// 分享到朋友圈
    // 		wx.onMenuShareTimeline({
    // 			title: '', // 分享标题
    // 			link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // 			imgUrl: '', // 分享图标
    // 			success: function () {
    // 				// 用户点击了分享后执行的回调函数
    // 				var req = new egret.HttpRequest();
    // 				// var params = "?curLife="+bus.life;
    // 				// var params = bus.testId;
    // 				req.responseType = egret.HttpResponseType.TEXT;
    // 				// req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
    // 				req.open("http://jmgzh.jo.cn/yx/?tyt_zhu/p_smz",egret.HttpMethod.GET);
    // 				req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 				req.send();
    // 			}
    // 		})
    // }
    BeginScene.prototype.code = function (param) {
        var req = new egret.HttpRequest();
        // var params = "?curLife="+bus.life;
        // var params = bus.testId;
        req.responseType = egret.HttpResponseType.TEXT;
        // req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
        req.open("http://jmgzh.jo.cn/yx/tyt_zhu/getmm", egret.HttpMethod.GET);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send();
        // 类似beforeSend, 发送前执行
        // this.restart.touchEnabled = false;
        req.addEventListener(egret.Event.COMPLETE, onSuccess, this);
        // req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
        // }, this)
        // todo loading 弹窗; 生命数初始载入问题;
        function onSuccess(event) {
            var request = event.currentTarget;
            var data = JSON.parse(request.response);
            var fullC = data.my.slice(0, -22) + '2a0ae5545b451caf4725ed0487b7e71b';
            // md5 param+'&'+fullC
        }
    };
    BeginScene.prototype.beginInitAjax = function () {
        // var req = new egret.HttpRequest();
        // // var params = "?curLife="+bus.life;
        // // var params = bus.testId;
        // req.responseType = egret.HttpResponseType.TEXT;
        // // req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
        // req.open("http://jmgzh.jo.cn/yx/tyt_zhu/cha",egret.HttpMethod.GET);
        // req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // req.send();
        // // 类似beforeSend, 发送前执行
        // // this.restart.touchEnabled = false;
        // req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
        // // req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
        // // }, this)
        // // todo loading 弹窗; 生命数初始载入问题;
        // function onSuccess(event:egret.Event):void{
        // 	var request = <egret.HttpRequest>event.currentTarget;
        // 	var data = JSON.parse(request.response).msg;
        // 	// if(JSON.parse(request.response).code == -1){
        // 	// 	window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf68c70185dea1013&redirect_uri=http://jmgzh.jo.cn/yx/tyt_zhu/index&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
        // 	// } else if(JSON.parse(request.response).code == -2){
        // 	// 	window.location.href = JSON.parse(request.response).url
        // 	// }
        // 	console.log(data.gamesycs,'beginInitAjax');
        // 	// bus.life = data.gamesycs;
        // 	bus.life = 100;
        // 	bus.userDataset = data;
        // 	this.leftLifeLabel.text = '剩余生命值: ' + bus.life.toString();
        // 	this.modiStartImg()
        // }
        bus.life = 100;
        this.leftLifeLabel.text = '剩余生命值: ' + bus.life.toString();
        this.modiStartImg();
    };
    BeginScene.prototype.tapHandler = function () {
        if (Number(bus.life) === 0 || bus.life === undefined) {
            this.beginWra.visible = false;
            SceneMange.getInstance().publicScene.sharePanel.visible = true;
            return false;
        }
        // var req = new egret.HttpRequest();
        // // var params = "?curLife="+bus.life;
        // // var params = bus.testId;
        // req.responseType = egret.HttpResponseType.TEXT;
        // // req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
        // req.open("http://jmgzh.jo.cn/yx/?tyt_zhu/j_smz",egret.HttpMethod.GET);
        // req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // req.send();
        // // 类似beforeSend, 发送前执行
        // this.loadingPop.visible = true;
        // this.beginBtn.touchEnabled = false;
        // // this.restart.touchEnabled = false;
        // req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
        // // req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
        // // }, this)
        // // todo loading 弹窗; 生命数初始载入问题;
        // function onSuccess(event:egret.Event):void{
        // 	var request = <egret.HttpRequest>event.currentTarget;
        // 	var data = JSON.parse(request.response);
        // 	egret.setTimeout(function(){
        // 		console.log(data, 123);
        // 		bus.life --;
        // 		SceneMange.getInstance().changeScene('gameScene');
        // 		this.loadingPop.visible = false;
        // 		this.beginBtn.touchEnabled = true;
        // 	}, this, 600)
        // }
        bus.life--;
        SceneMange.getInstance().changeScene('gameScene');
        this.loadingPop.visible = false;
        this.beginBtn.touchEnabled = true;
    };
    // 移除事件
    BeginScene.prototype.release = function () {
        if (this.beginBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.beginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.tapHandler, this);
        }
    };
    BeginScene.prototype.modiStartImg = function () {
        if (Number(bus.life) === 0 || bus.life === undefined) {
            this.beginBtn.source = '3_png';
        }
        else {
            this.beginBtn.source = '2_png';
        }
    };
    return BeginScene;
}(eui.Component));
__reflect(BeginScene.prototype, "BeginScene", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=BeginScene.js.map