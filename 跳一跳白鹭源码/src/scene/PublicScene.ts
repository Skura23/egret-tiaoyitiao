class PublicScene extends eui.Component{
    // 开始按钮
	public beginBtn:eui.Button;
	public loadingPop:eui.Group;
	public gameRulePop:eui.Group;
	
	// wrapper of beginscene
	public beginWra:eui.Group;
	// wrapper of btns
	public btnWra:eui.Group;
	public ruleClose:eui.Label;

    public foo:eui.Image;
	// rank列表是否刷新flag
	public isRefresh:number = 0;
	// rank列表数据
	public rankArrCollection: eui.ArrayCollection;
	public userRankCollection: eui.ArrayCollection;
	// rank列表
	public rankDataList: eui.List;
	public userRankData: eui.List;
	
	public rankScroller:eui.Scroller;
	public rankPanel:eui.Group;

	public sharePanel:eui.Group;
	public shareMask:eui.Group;
	
	// 返回上一步按钮
	public rankToPrev: eui.Label;
	public rankFlag=true;
	public page = 1;
	

	public constructor() {
		super();
		// UI skin加载完毕后，调用自定义的init初始化方法
		// this.init();
		this.addEventListener(eui.UIEvent.COMPLETE, this.init, this);
        this.skinName = "resource/scene/PublicScene.exml";
	}

	// protected partAdded(partName:string,instance:any):void
	// {
	// 	super.partAdded(partName,instance);
	// }
	protected childrenCreated():void
	{
		super.childrenCreated();
		
	}
	public init(){
		// this.foo.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
		// 	console.log('click foo');
		// }, this);
		// this.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
		// 	this.rankPanel.visible = false;
		// 	this.overPanel.visible = true;
		// }, this);
		console.log('public scene');
		var mc1 = bus.getLoadingClip()
		var mc1Wra = new eui.Group();
		mc1Wra.width = 50;
		mc1Wra.height = 50;
		mc1Wra.left = "40%";
		mc1Wra.top = "25%";
		mc1Wra.visible = false;
		mc1Wra.name = 'rankLoadingMc';
		mc1Wra.addChild(mc1)
		this.rankScroller.addChild(mc1Wra)

		this.userRankCollection = new eui.ArrayCollection();
		this.userRankCollection.source = [];
		this.userRankData.dataProvider = this.userRankCollection;

		this.rankArrCollection = new eui.ArrayCollection();
		this.rankArrCollection.source = [];
		this.rankDataList.dataProvider = this.rankArrCollection;

		// 绑定rankScroller滑动刷新
		this.rankScroller.addEventListener(eui.UIEvent.CHANGE,this.onScrollerChangeHander,this);
		this.rankScroller.addEventListener(eui.UIEvent.CHANGE_END,this.onScrollerChangeEndHander,this);
		this.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.rankPanel.visible = false;
			this.rankArrCollection.source = [];
			this.page = 1;
		}, this);
		this.shareMask.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.shareMask.visible = false;
			this.sharePanel.visible = true;
		}, this);

		this.initSharePanelFuncs()
	}
	// rank列表滚动时监听函数
	public onScrollerChangeHander(e:eui.UIEvent):void{
		var myScroller:eui.Scroller = e.currentTarget;
		//  console.info("x:"+myScroller.viewport.scrollV);
		// myScroller.viewport.scrollV是指viewport相对内容的竖直高度
		if(myScroller.viewport.scrollV<-100){
			this.isRefresh = 1;
		}
		if(myScroller.viewport.scrollV>(this.rankArrCollection.length*65-this.rankDataList.height+70)){
			this.isRefresh = -1;
			console.log(this.rankDataList.height);
			
		}
	}
	// rank列表滚动结束时监听函数
	public onScrollerChangeEndHander(e:eui.UIEvent):void{
		if(this.isRefresh!=0){
			console.info("Refresh"+this.isRefresh);
			if(this.isRefresh==-1){
				//这里是上拉加载更多逻辑
				this.rankAjax()
			}
			if(this.isRefresh==1){
				//这里是下拉刷新逻辑
			}
			this.isRefresh = 0;
		}
	}
	// 获取排行榜ajax
	public rankAjax() {
		egret.ImageLoader.crossOrigin = "anonymous"
		var rankLoadingMc = this.rankScroller.getChildByName('rankLoadingMc');
		rankLoadingMc.visible = true;
		this.rankScroller.bounces = false;
		var req = new egret.HttpRequest();
		var params = "?page="+this.page;
		req.responseType = egret.HttpResponseType.TEXT;
		req.open("http://jmgzh.jo.cn/yx/tyt_zhu/g_zpaih"+params,egret.HttpMethod.GET);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send();
		// 类似beforeSend, 发送前执行
		// this.loadingPop.visible = true;
		// this.relive.touchEnabled = false;
		req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
		function onSuccess(event:egret.Event):void{
			rankLoadingMc.visible = false;
			this.rankScroller.bounces = true;
			var request = <egret.HttpRequest>event.currentTarget;
			var data = JSON.parse(request.response).msg.zph;
			var listData = bus.cloneAndRename(data.content, {
				ph: 'rankOrder',
				nickname: 'rankName',
				zscore: 'rankPoint',
				headimgurl: 'rankHead'
			})
			// console.log(listData,this.rankDataList);
			// 新增rankHead属性
			// for(let i =0;i<listData.length;i++){
			// 	(<any>Object).assign(listData[i],{rankHead:"rank_head_png"});
			// }
			// var arrayCollection = new eui.ArrayCollection();
			// arrayCollection.source = listData;
			// this.rankDataList.dataProvider = arrayCollection
			// this.rankArrCollection.source = this.rankArrCollection.source.concat(listData);
			// this.rankArrCollection.refresh()
			for(let i =0;i<listData.length;i++){
				this.rankArrCollection.addItem(listData[i])
			}
			console.log(listData, this.rankArrCollection);
			this.page = data.currPage +1
		}
	}

	private initSharePanelFuncs() {
		// 关闭按钮
		this.sharePanel.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.sharePanel.visible = false;
			// this.overPanel.visible = true;
		}, this)
		// 分享
		this.sharePanel.getChildAt(3).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			window.location.href = "http://jmgzh.jo.cn/fxym.html"
			// this.sharePanel.visible = false;
			// this.shareMask.visible = true;
		}, this)
		// 跳转到积分兑换
		this.sharePanel.getChildAt(4).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			window.location.href = "http://jmgzh.jo.cn/yx/tyt_zhu/g_dh"
		}, this)
	}	
	private showShareMask(){
		
	}
}