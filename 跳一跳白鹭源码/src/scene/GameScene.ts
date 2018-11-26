class GameScene extends eui.Component implements eui.UIComponent {
	// z 带eui. 前缀的皆为eui内的页面元素
	// 游戏场景组
	public blockPanel: eui.Group;
	// 小 i
	public player: eui.Image;
	// 分数图标
	public scoreIcon: eui.Image;
	// 生命图标
	public lifeIcon: eui.Image;
	// 游戏场景中的积分
	public scoreLabel: eui.Label;
	// 生命值
	public lifeLabel: eui.Label;
	// 所有方块资源的数组
	private blockSourceNames: Array<string> = [];
	// 按下的音频
	private pushVoice: egret.Sound;
	// 按下音频的SoundChannel对象
	private pushSoundChannel: egret.SoundChannel;
	// 弹跳的音频
	private jumpVoice: egret.Sound;
	// 所有方块的数组
	private blockArr: Array<eui.Image> = [];
	// 所有回收方块的数组
	private reBackBlockArr: Array<eui.Image> = [];
	// 当前的盒子（最新出现的盒子）
	private currentBlock: eui.Image;
	// 下一个盒子方向(1靠右侧出现/-1靠左侧出现)
	public direction: number = 1;
	// 随机盒子距离跳台的距离
	private minDistance = 240;
	private maxDistance = 400;
	// tanθ角度值
	public tanAngle: number = 0.556047197640118;

	// 跳的距离
	public jumpDistance: number = 0;
	// 判断是否是按下状态
	private isReadyJump = false;
	// 落脚点
	private targetPos: egret.Point;
	// 左侧跳跃点
	private leftOrigin = { "x": 180, "y": 350 };
	// 右侧跳跃点
	private rightOrigin = { "x": 505, "y": 350 };
	// 游戏中得分
	private score = 0;
	// rank列表是否刷新flag
	private isRefresh:number = 0;
	// rank列表数据
	private rankArrCollection: eui.ArrayCollection;
	// 游戏中生命数
	public life = 1;

	// 游戏结束场景
	public overPanel: eui.Group;
	public rankPanel: eui.Group;
	public rankScroller: eui.Scroller;
	public rankDataList: eui.List;
	public overScoreLabel: eui.Label;
	public loadingPop: eui.Group;
	public restart: eui.Button;
	public relive: eui.Button;
	public viewRankBtn: eui.Button;
	public rankReturn: eui.Button;



	public constructor() {
		super();
	}

	protected partAdded(partName: string, instance: any): void {
		super.partAdded(partName, instance);
	}
	protected childrenCreated(): void {
		super.childrenCreated();
		// 添加loading动图
		var data = RES.getRes("loading_json");
		var txtr = RES.getRes("loading_png");
		var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
		var mc:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData( "loading" ) );
		mc.scaleX = 0.5;
		mc.scaleY = 0.5;
		mc.x = 11;
		mc.y = 52;
		this.loadingPop.addChild(mc)
		mc.gotoAndPlay(0, -1);

		this.init();
		this.reset();
	}
	private init() {
		this.blockSourceNames = ["block1_png", "block2_png", "block3_png"];
		// 初始化音频
		this.pushVoice = RES.getRes('push_mp3');
		this.jumpVoice = RES.getRes('jump_mp3');

		// 添加触摸事件
		this.blockPanel.touchEnabled = true;
		this.blockPanel.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onKeyDown, this);
		this.blockPanel.addEventListener(egret.TouchEvent.TOUCH_END, this.onKeyUp, this);
		// 绑定结束按钮
		this.restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartHandler, this);
		// 绑定复活按钮
		this.relive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reliveHandler, this);
		// 绑定结束页排行榜查看按钮
		this.viewRankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewRankHandler, this);
		this.rankReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			this.rankPanel.visible = false;
			this.overPanel.visible = true;
		}, this);
		// 绑定rankScroller滑动刷新
		this.rankScroller.addEventListener(eui.UIEvent.CHANGE,this.onScrollerChangeHander,this);
		this.rankScroller.addEventListener(eui.UIEvent.CHANGE_END,this.onScrollerChangeEndHander,this);
		// this.rankPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
		// 	window.open('http://www.baidu.com','targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=350,height=250')
		// }, this);
		this.rankArrCollection = new eui.ArrayCollection();
		this.rankArrCollection.source = [];
		this.rankDataList.dataProvider = this.rankArrCollection
		// 设置玩家的锚点
		this.player.anchorOffsetX = this.player.width / 2;
		this.player.anchorOffsetY = this.player.height - 20;
		this.life = bus.life;
		this.lifeLabel.text = this.life.toString();
		// 心跳计时器
		egret.Ticker.getInstance().register(function (dt) {
			dt /= 1000;
			if (this.isReadyJump) {
				this.jumpDistance += 300 * dt;
			}
		}, this)
	}
	// 按下的事件逻辑
	private onKeyDown() {
		// 播放按下的音频
		this.pushSoundChannel = this.pushVoice.play(0, 1);
		// 变形
		egret.Tween.get(this.player).to({
			scaleY: 0.5
		}, 3000)

		this.isReadyJump = true;
	}
	// 放开
	private onKeyUp() {
		// 判断是否是在按下状态
		if (!this.isReadyJump) {
			return;
		}
		// 声明落点坐标
		if (!this.targetPos) {
			this.targetPos = new egret.Point();
		}
		// 立刻让屏幕不可点,等小人落下后重新可点
		this.blockPanel.touchEnabled = false;
		// 停止播放按压音频,并且播放弹跳音频
		this.pushSoundChannel.stop()
		this.jumpVoice.play(0, 1);
		// 清楚所有动画
		egret.Tween.removeAllTweens();
		this.blockPanel.addChild(this.player);
		// 结束跳跃状态
		this.isReadyJump = false;
		// 落点坐标
		this.targetPos.x = this.player.x + this.jumpDistance * this.direction;
		// 根据落点重新计算斜率,确保小人往目标中心跳跃
		this.targetPos.y = this.player.y + this.jumpDistance * (this.currentBlock.y - this.player.y) / (this.currentBlock.x - this.player.x) * this.direction;
		// 执行跳跃动画
		egret.Tween.get(this).to({ factor: 1 }, 500).call(() => {
			this.player.scaleY = 1;
			this.jumpDistance = 0;
			// 判断跳跃是否成功
			// z 跳跃动画结束后根据距离判断是否成功
			this.judgeResult();
		});
		// 执行小人空翻动画
		// z 以小人中间位置为旋转中心
		this.player.anchorOffsetY = this.player.height / 2;

		egret.Tween.get(this.player).to({ rotation: this.direction > 0 ? 360 : -360 }, 200).call(() => {
			this.player.rotation = 0
		}).call(() => {
			this.player.anchorOffsetY = this.player.height - 20;
		});
	}
	// 重置游戏
	public reset() {
		// 清空舞台
		this.blockPanel.removeChildren();
		this.blockArr = [];
		// 添加一个方块
		let blockNode = this.createBlock();
		blockNode.touchEnabled = false;
		// 设置方块的起始位置
		blockNode.x = 180;
		blockNode.y = this.height / 2 + blockNode.height;
		this.currentBlock = blockNode;
		// 摆正小人的位置
		this.player.y = this.currentBlock.y;
		this.player.x = this.currentBlock.x;
		this.blockPanel.addChild(this.player);
		this.blockPanel.addChild(this.scoreIcon);
		this.blockPanel.addChild(this.scoreLabel);
		this.blockPanel.addChild(this.lifeIcon);
		this.blockPanel.addChild(this.lifeLabel);
		this.direction = 1;
		// 添加积分
		this.blockPanel.addChild(this.scoreLabel);
		// 添加下一个方块
		this.addBlock();
	}
	// 添加一个方块
	private addBlock() {
		// debugger;
		// 随机一个方块
		let blockNode = this.createBlock();
		// 设置位置
		let distance = this.minDistance + Math.random() * (this.maxDistance - this.minDistance);
		if (this.direction > 0) {
			blockNode.x = this.currentBlock.x + distance;
			blockNode.y = this.currentBlock.y - distance * this.tanAngle;
		} else {
			blockNode.x = this.currentBlock.x - distance;
			blockNode.y = this.currentBlock.y - distance * this.tanAngle;
		}
		this.currentBlock = blockNode;
	}
	// 工厂方法,创建一个方块
	private createBlock(): eui.Image {
		var blockNode = null;
		if (this.reBackBlockArr.length) {
			// 回收池里面有,则直接取
			blockNode = this.reBackBlockArr.splice(0, 1)[0];
		} else {
			// 回收池里面没有,则重新创建
			blockNode = new eui.Image();
		}
		// 使用随机背景图
		let n = Math.floor(Math.random() * this.blockSourceNames.length);
		blockNode.source = this.blockSourceNames[n];
		this.blockPanel.addChild(blockNode);
		// 设置方块的锚点
		blockNode.anchorOffsetX = 222;
		blockNode.anchorOffsetY = 78;
		// 把新创建的block添加进入blockArr里
		this.blockArr.push(blockNode);
		return blockNode;
	}

	private judgeResult() {
		// 界面的倒数第二个方块
		var lastButOneBlock = this.blockArr[this.blockArr.length-2]
		// 根据this.jumpDistance来判断跳跃是否成功
		if (Math.pow(this.currentBlock.x - this.player.x, 2) + Math.pow(this.currentBlock.y - this.player.y, 2) <= 70 * 70) {
			// 小人落在方块上
			var increment = 1
			// if(){
			// 	// 靠近中心 2分
			// 	increment = 2;
			// }
			// 更新积分
			this.score += increment;
			// 直接新增、操作画布元素
			// var increTextSpr:egret.Sprite = new egret.Sprite();
			var increText:egret.TextField = new egret.TextField();
			increText.text = '+'+ increment;
			increText.size = 40;
			increText.textColor = 0x000000;
			// increTextSpr.addChild(increText);
			increText.x = this.player.x - 20 ;
			increText.y = this.player.y-160;
			// increText.alpha=0.2;
			this.blockPanel.addChild(increText);
			// egret.Tween.get(increText).to({
			// 	// x: 100,
			// 	y: increText.y - 100,
			// 	alpha: 0
			// }, 600).call(() => {
			// 	this.blockPanel.removeChild(increText);
			// })
			// egret.setTimeout(function(){
			// 	this.blockPanel.removeChild(increText);
			// }, this, 800)
			// 直接新增、操作画布元素 end
			this.scoreLabel.text = this.score.toString();
			// 随机下一个方块出现的位置
			this.direction = Math.random() > 0.5 ? 1 : -1;
			// 当前方块要移动到相应跳跃点的距离
			var blockX, blockY;
			// z 跳跃点是固定的, 以方块位置作参考
			blockX = this.direction > 0 ? this.leftOrigin.x : this.rightOrigin.x;
			blockY = this.height / 2 + this.currentBlock.height;
			// 小人要移动到的点.
			var playerX, PlayerY;
			playerX = this.player.x - (this.currentBlock.x - blockX);
			PlayerY = this.player.y - (this.currentBlock.y - blockY);
			// 更新页面
			// z 给update传入当前方块与下一方块的距离值以控制其他方块移动
			this.update(this.currentBlock.x - blockX, this.currentBlock.y - blockY, increText);
			// 更新小人的位置
			// z 移动小人位置
			egret.Tween.get(this.player).to({
				x: playerX,
				y: PlayerY,
				// alpha: 0
			}, 900).call(() => {
				// 开始创建下一个方块
				this.addBlock();
				// 让屏幕重新可点;
				this.blockPanel.touchEnabled = true;
			})
			// console.log('x' + x);
			console.log(this.currentBlock.x);
		} else if( Math.pow(lastButOneBlock.x - this.player.x, 2) + Math.pow(lastButOneBlock.y - this.player.y, 2) <= 70 * 70){
			this.blockPanel.touchEnabled = true;
		} else {
			// 失败,弹出重新开始的panel
			console.log('游戏失败!')
			this.overPanel.visible = true;
			this.overScoreLabel.text = this.score.toString();
		}
	}
	// z 控制屏幕中所有方块移动
	private update(x, y, increText) {
		// egret.Tween.removeAllTweens();
		for (var i: number = this.blockArr.length - 1; i >= 0; i--) {
			var blockNode = this.blockArr[i];
			if (blockNode.x + (blockNode.width - 222) < 0 || blockNode.x - 222 > this.width || blockNode.y - 78 > this.height) {
				// 方块超出屏幕,从显示列表中移除
				this.blockPanel.removeChild(blockNode);
				this.blockArr.splice(i, 1);
				// 添加到回收数组中
				this.reBackBlockArr.push(blockNode);
			} else {
				// 没有超出屏幕的话,则移动
				// 方块移动
				egret.Tween.get(blockNode).to({
					x: blockNode.x - x,
					y: blockNode.y - y
				}, 900)
			}
		}
		if(increText){
			egret.Tween.get(increText).to({
				x: increText.x - x*4/9,
				y: increText.y - y*4/9,
				// alpha: 0
			}, 400).call(()=>{
				egret.Tween.get(increText).to({
					x: increText.x - x*5/9,
					y: increText.y - y*5/9 ,
					alpha: 0
				}, 500)
			})
		}
		console.log(this.blockArr);
	}
	// 重新一局
	private restartHandler() {
		// 隐藏结束场景
		this.overPanel.visible = false;
		// 置空积分
		this.score = 0;
		this.scoreLabel.text = this.score.toString();
		// 开始放置方块
		this.reset();
		// 游戏场景可点
		this.blockPanel.touchEnabled = true;
	}
	// 为按钮绑定链接
	private bindLink(){
		// 查看排行榜链接
		// this.viewRankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
		// 	window.open("http://www.sina.com");
		// },this)
	}
	// 查看排行handler
	private viewRankHandler() {
		this.overPanel.visible = false;
		this.rankPanel.visible = true;
		this.rankAjax()
	}
	// 获取排行榜ajax
	private rankAjax() {
		var req = new egret.HttpRequest();
		// var params = "?curLife="+this.life;
		req.responseType = egret.HttpResponseType.TEXT;
		req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getRank",egret.HttpMethod.GET);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send();
		// 类似beforeSend, 发送前执行
		// this.loadingPop.visible = true;
		// this.relive.touchEnabled = false;
		req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
		function onSuccess(event:egret.Event):void{
			var request = <egret.HttpRequest>event.currentTarget;
			var data = JSON.parse(request.response).data;
			var listData = cloneAndRename(data, {
				order: 'rankOrder',
				name: 'rankName',
				point: 'rankPoint'
			})
			// console.log(listData,this.rankDataList);
			// 新增rankHead属性
			for(let i =0;i<listData.length;i++){
				(<any>Object).assign(listData[i],{rankHead:"rank_head_png"});
			}
			// var arrayCollection = new eui.ArrayCollection();
			// arrayCollection.source = listData;
			// this.rankDataList.dataProvider = arrayCollection
			this.rankArrCollection.source = this.rankArrCollection.source.concat(listData);
			console.log(listData, this.rankArrCollection);
			this.rankArrCollection.refresh()
			// todo: modi scroll pos
			this.rankScroller.viewport.scrollV = this.rankScroller.viewport.contentHeight - 10*75
		}
	}
	// rank列表滚动时监听函数
	private onScrollerChangeHander(e:eui.UIEvent):void{
		var myScroller:eui.Scroller = e.currentTarget;
		//  console.info("x:"+myScroller.viewport.scrollV);
		if(myScroller.viewport.scrollV<-100){
			this.isRefresh = 1;
		}
		if(myScroller.viewport.scrollV>(this.rankArrCollection.length*75-this.rankDataList.height+100)){
			this.isRefresh = -1;
		}
	}
	// rank列表滚动结束时监听函数
	private onScrollerChangeEndHander(e:eui.UIEvent):void{
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
	// 复活
	private reliveHandler() {
		// 生命值 -1 ajax
		var req = new egret.HttpRequest();
		var params = "?curLife="+this.life;
		req.responseType = egret.HttpResponseType.TEXT;
		req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
		req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		req.send();
		// 类似beforeSend, 发送前执行
		this.loadingPop.visible = true;
		this.relive.touchEnabled = false;
		req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
		// req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
			
		// }, this)
		// todo loading 弹窗; 生命数初始载入问题;
		function onSuccess(event:egret.Event):void{
			var request = <egret.HttpRequest>event.currentTarget;
			var data = JSON.parse(request.response).data;
			egret.setTimeout(function(){
				this.life = data.curLife;
				if (this.life < 0) this.life = 0;
				this.lifeLabel.text = this.life.toString();
				if(this.life === 0) this.relive.visible = false;
				// direction判断失败界面倒数第二个方块的位置
				if(this.direction === 1){
					this.player.x = this.leftOrigin.x;
					this.player.y = this.height / 2 + this.currentBlock.height;
				} else if(this.direction === -1) {
					this.player.x = this.rightOrigin.x;
					this.player.y = this.height / 2 + this.currentBlock.height;
				}
				// 隐藏结束场景
				this.overPanel.visible = false;
				this.loadingPop.visible = false;
				this.relive.touchEnabled = true;
				this.blockPanel.touchEnabled = true;
			}, this, 600)
		}
	}
	//添加factor的set,get方法,注意用public  
	public get factor(): number {
		return 0;
	}
	//计算方法参考 二次贝塞尔公式  
	public set factor(value: number) {
		this.player.x = (1 - value) * (1 - value) * this.player.x + 2 * value * (1 - value) * (this.player.x + this.targetPos.x) / 2 + value * value * (this.targetPos.x);
		this.player.y = (1 - value) * (1 - value) * this.player.y + 2 * value * (1 - value) * (this.targetPos.y - 300) + value * value * (this.targetPos.y);
	}
}

// 复制对象并重命名键名
let cloneAndRename = (obj, renames):any => {
    let clone = {};
	let cloneArr = []
	function _handler(i){
		let _obj={};
		_obj = (i || i===0) ? obj[i] : obj;
		Object.keys(_obj).forEach(function (key) {
			if (renames[key] !== undefined) {
				clone[renames[key]] = _obj[key];
			} else {
				clone[key] = _obj[key];
			}
		});
	}
	if (!obj.length){
		_handler(null)
		return clone;
	} else {
		for(let i = 0; i < obj.length; i++){
			_handler(i)
			cloneArr.push(JSON.parse(JSON.stringify(clone))) 
		}
		return cloneArr
	}
}