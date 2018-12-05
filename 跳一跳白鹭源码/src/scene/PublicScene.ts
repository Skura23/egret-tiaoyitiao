class PublicScene extends eui.Component{
    // 开始按钮
	public beginBtn:eui.Button;
	public loadingPop:eui.Group;
	public gameRulePop:eui.Group;
	
	// wrapper of beginscene
	public beginWra:eui.Group;
	// wrapper of btns
	public btnWra:eui.Group;
	private ruleClose:eui.Label;

    public foo:eui.Image;

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
		this.foo.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
			console.log('click foo');
			
		}, this);
		console.log('public scene');
	}
}