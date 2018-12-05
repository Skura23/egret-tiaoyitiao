// 用于存储全局变量
var bus = {
    life: null,
    getLoadingClip(){
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
    },
	// 复制对象并重命名键名
	cloneAndRename(obj, renames):any{
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
};