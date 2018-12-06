class BeginScene extends eui.Component implements  eui.UIComponent {
	
	// 开始按钮
	public beginBtn:eui.Image;
	public loadingPop:eui.Group;
	public gameRulePop:eui.Group;
	
	// wrapper of beginscene
	public beginWra:eui.Group;
	// wrapper of btns
	public btnWra:eui.Group;
	private ruleClose:eui.Label;
	// 排行榜返回按钮
	public rankToPrev: eui.Label;
	// 排行榜弹窗
	public rankPanel: eui.Group;
	

	public constructor() {
		super();
		this.addEventListener(eui.UIEvent.COMPLETE, function(){
			console.log(12);
		}, this);
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		var mc0 = bus.getLoadingClip()
		this.loadingPop.addChild(mc0)
		// 页面加载完毕后，调用自定义的初始化方法
		this.init();
	}
	
	// 初始化(给开始按钮绑定点击事件)
	// z 点击开始按钮切换场景
	public init(){
		var publicScene = SceneMange.getInstance().publicScene
		this.beginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapHandler,this);
		// 下方按钮事件绑定
		this.btnWra.getChildAt(0).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.beginWra.visible = false;
			// this.rankPanel.visible = true;
			publicScene.rankPanel.visible = true;
			publicScene.rankAjax()
		}, this);
		this.btnWra.getChildAt(1).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			// this.beginWra.visible = false;
		}, this);
		this.btnWra.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.beginWra.visible = false;
			this.gameRulePop.visible = true;
		}, this);
		this.ruleClose.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.beginWra.visible = true;
			this.gameRulePop.visible = false;
		}, this);
		publicScene.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.beginWra.visible = true;
			publicScene.rankArrCollection.source = [];
		}, this)
		publicScene.sharePanel.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.beginWra.visible = true;
			// this.overPanel.visible = true;
		}, this)
		this.modiStartImg()
		this.beginInitAjax()
	}
	private beginInitAjax(){
		var req = new egret.HttpRequest();
		// var params = "?curLife="+bus.life;
		// var params = bus.testId;
		req.responseType = egret.HttpResponseType.TEXT;
		// req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
		req.open("http://jmgzh.jo.cn/yx/?tyt_zhu/cha",egret.HttpMethod.GET);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send();
		// 类似beforeSend, 发送前执行
		
		// this.restart.touchEnabled = false;
		req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
		// req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
			
		// }, this)
		// todo loading 弹窗; 生命数初始载入问题;
		function onSuccess(event:egret.Event):void{
			var request = <egret.HttpRequest>event.currentTarget;
			var data = JSON.parse(request.response).msg;
			console.log(data,'beginInitAjax');
			bus.life = data.gamesycs;
			bus.userDataset = data;
		}
	}
	private tapHandler(){
		if(bus.life === 0){
			this.beginWra.visible = false;
			SceneMange.getInstance().publicScene.sharePanel.visible = true;
			return false;
		}
		// 切换场景
		var req = new egret.HttpRequest();
		// var params = "?curLife="+bus.life;
		// var params = bus.testId;
		req.responseType = egret.HttpResponseType.TEXT;
		// req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
		req.open("http://jmgzh.jo.cn/yx/?tyt_zhu/j_smz",egret.HttpMethod.GET);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send();
		// 类似beforeSend, 发送前执行
		this.loadingPop.visible = true;
		this.beginBtn.touchEnabled = false;
		// this.restart.touchEnabled = false;
		req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
		// req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
			
		// }, this)
		// todo loading 弹窗; 生命数初始载入问题;
		function onSuccess(event:egret.Event):void{
			var request = <egret.HttpRequest>event.currentTarget;
			var data = JSON.parse(request.response);
			egret.setTimeout(function(){
				console.log(data, 123);
				bus.life --;
				SceneMange.getInstance().changeScene('gameScene');
				this.loadingPop.visible = false;
				this.beginBtn.touchEnabled = true;
			}, this, 600)
		}
	}
	// 移除事件
	public release(){
		if(this.beginBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
			this.beginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.tapHandler,this);
		}
	}
	public modiStartImg(){
		if(bus.life === 0) {
			this.beginBtn.source = '3_png';
		}else{
			this.beginBtn.source = '2_png';
		}
	}
	// private getLoadingClip(){
	// 	// 添加loading动图
	// 	var data = RES.getRes("loading_json");
	// 	var txtr = RES.getRes("loading_png");
	// 	var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
	// 	var mc:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData( "loading" ) );
	// 	mc.scaleX = 0.5;
	// 	mc.scaleY = 0.5;
	// 	mc.x = 11;
	// 	mc.y = 52;
	// 	mc.gotoAndPlay(0, -1);
	// 	return mc
	// }
}