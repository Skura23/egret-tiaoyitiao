class BeginScene extends eui.Component implements  eui.UIComponent {
	
	// 开始按钮
	public beginBtn:eui.Button;
	public loadingPop:eui.Group;
	
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
		// 页面加载完毕后，调用自定义的初始化方法
		this.init();
	}
	
	// 初始化(给开始按钮绑定点击事件)
	// z 点击开始按钮切换场景
	public init(){
		this.beginBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.tapHandler,this);
	}
	private tapHandler(){
		// 切换场景
		SceneMange.getInstance().changeScene('gameScene');
		var mc0 = this.getLoadingClip()
		this.loadingPop.addChild(mc0)
	}
	// 移除事件
	public release(){
		if(this.beginBtn.hasEventListener(egret.TouchEvent.TOUCH_TAP)){
			this.beginBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.tapHandler,this);
		}
	}
	private getLoadingClip(){
		// 添加loading动图
		var data = RES.getRes("loading_json");
		var txtr = RES.getRes("loading_png");
		var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
		var mc:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData( "loading" ) );
		mc.scaleX = 0.5;
		mc.scaleY = 0.5;
		mc.x = 11;
		mc.y = 52;
		mc.gotoAndPlay(0, -1);
		return mc
	}
}