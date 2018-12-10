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
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this) || this;
        // 所有方块资源的数组
        _this.blockSourceNames = [];
        // 所有方块的数组
        _this.blockArr = [];
        // 所有回收方块的数组
        _this.reBackBlockArr = [];
        // 下一个盒子方向(1靠右侧出现/-1靠左侧出现)
        _this.direction = 1;
        // 随机盒子距离跳台的距离
        _this.minDistance = 240;
        _this.maxDistance = 400;
        // tanθ角度值
        _this.tanAngle = 0.556047197640118;
        // 跳的距离
        _this.jumpDistance = 0;
        // 判断是否是按下状态
        _this.isReadyJump = false;
        // 左侧跳跃点
        _this.leftOrigin = { "x": 180, "y": 350 };
        // 右侧跳跃点
        _this.rightOrigin = { "x": 505, "y": 350 };
        // 游戏总累积得分
        _this.score = 0;
        // 此次游戏得分
        _this.thisTimeScore = 0;
        // rank列表是否刷新flag
        _this.isRefresh = 0;
        // 游戏中生命数
        // todo
        _this.giftTriggerCounter = 0;
        _this.life = 1;
        return _this;
    }
    GameScene.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    GameScene.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        var mc0 = bus.getLoadingClip();
        this.loadingPop.addChild(mc0);
        // var mc1 = bus.getLoadingClip()
        // var mc1Wra = new eui.Group();
        // mc1Wra.width = 50;
        // mc1Wra.height = 50;
        // mc1Wra.left = "40%";
        // mc1Wra.top = "25%";
        // mc1Wra.visible = false;
        // mc1Wra.name = 'rankLoadingMc';
        // mc1Wra.addChild(mc1)
        // this.rankScroller.addChild(mc1Wra)
        this.init();
        // this.reset();
    };
    // private getLoadingClip(){
    // }
    GameScene.prototype.init = function () {
        this.blockSourceNames = ["block_digua_png", "block_icp_png", "block_jmkj_png", "block_juming_png", "block_namepre_png", "block_yupu_png", "block_1_png", "block_2_png", "block_3_png", "block_4_png", "block_5_png"];
        // 加载左上头像图片
        this.loadMyHeadImg(bus.userDataset.headimgurl);
        this.scoreNameLabel.text = bus.userDataset.nickname;
        // 初始化分享积分获取弹窗功能
        // this.initSharePanelFuncs()
        // 初始化红包弹窗功能
        this.initGiftPanelFuncs();
        // 初始化音频 
        this.pushVoice = RES.getRes('push_mp3');
        this.jumpVoice = RES.getRes('jump_mp3');
        // rank相关初始化
        // this.rankArrCollection = new eui.ArrayCollection();
        // this.rankArrCollection.source = [];
        // this.rankDataList.dataProvider = this.rankArrCollection
        // 添加触摸事件
        this.blockPanel.touchEnabled = true;
        this.blockPanel.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onKeyDown, this);
        this.blockPanel.addEventListener(egret.TouchEvent.TOUCH_END, this.onKeyUp, this);
        // 绑定结束按钮
        // this.restart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.restartHandler, this);
        // 绑定复活按钮
        this.relive.addEventListener(egret.TouchEvent.TOUCH_TAP, this.reliveHandler, this);
        // 绑定结束页排行榜查看按钮
        this.viewRankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.viewRankHandler, this);
        // game over 页返回上页按钮
        this.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.rankPanel.visible = false;
            this.overPanel.visible = true;
        }, this);
        // game over 页返回主页按钮
        this.overToHome.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.overPanel.visible = false;
            // this.reset()
            SceneMange.getInstance().changeScene('beginScene');
        }, this);
        SceneMange.getInstance().publicScene.rankToPrev.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.overPanel.visible = true;
        }, this);
        SceneMange.getInstance().publicScene.sharePanel.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.overPanel.visible = true;
        }, this);
        // 绑定rankScroller滑动刷新
        // this.rankScroller.addEventListener(eui.UIEvent.CHANGE,this.onScrollerChangeHander,this);
        // this.rankScroller.addEventListener(eui.UIEvent.CHANGE_END,this.onScrollerChangeEndHander,this);
        // this.rankArrCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE,function(){
        // 	this.rankScroller.viewport.scrollV = this.rankScroller.viewport.contentHeight - 10*71
        // },this);
        // this.rankPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
        // 	window.open('http://www.baidu.com','targetWindow','toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=350,height=250')
        // }, this);
        // 设置玩家的锚点
        this.player.anchorOffsetX = this.player.width / 2;
        this.player.anchorOffsetY = this.player.height - 20;
        this.life = bus.life;
        this.score = Number(bus.userDataset.zscore);
        this.lifeLabel.text = this.life.toString();
        this.scoreLabel.text = '积分' + this.score.toString();
        // 心跳计时器
        egret.Ticker.getInstance().register(function (dt) {
            dt /= 1000;
            if (this.isReadyJump) {
                this.jumpDistance += 300 * dt;
            }
        }, this);
    };
    // 按下的事件逻辑
    GameScene.prototype.onKeyDown = function () {
        // 播放按下的音频
        this.pushSoundChannel = this.pushVoice.play(0, 1);
        // 变形
        egret.Tween.get(this.player).to({
            scaleY: 0.5
        }, 3000);
        this.isReadyJump = true;
    };
    // 放开
    GameScene.prototype.onKeyUp = function () {
        var _this = this;
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
        this.pushSoundChannel.stop();
        this.jumpVoice.play(0, 1);
        // 清除所有动画
        egret.Tween.removeAllTweens();
        this.blockPanel.addChild(this.player);
        // 松开手指时去除slogan
        if (this.blockPanel.getChildByName('slogan')) {
            this.blockPanel.removeChild(this.blockPanel.getChildByName('slogan'));
        }
        // 结束跳跃状态
        this.isReadyJump = false;
        // 落点坐标
        this.targetPos.x = this.player.x + this.jumpDistance * this.direction;
        // 根据落点重新计算斜率,确保小人往目标中心跳跃
        this.targetPos.y = this.player.y + this.jumpDistance * (this.currentBlock.y - this.player.y) / (this.currentBlock.x - this.player.x) * this.direction;
        // 执行跳跃动画
        egret.Tween.get(this).to({ factor: 1 }, 500).call(function () {
            _this.player.scaleY = 1;
            _this.jumpDistance = 0;
            // if(this.blockPanel.getChildByName('sloganImg')){
            // 	this.blockPanel.removeChild(this.blockPanel.getChildByName('sloganImg'))
            // }
            // 判断跳跃是否成功
            // z 跳跃动画结束后根据距离判断是否成功
            _this.judgeResult();
        });
        // 执行小人空翻动画
        // z 以小人中间位置为旋转中心
        this.player.anchorOffsetY = this.player.height / 2;
        egret.Tween.get(this.player).to({ rotation: this.direction > 0 ? 360 : -360 }, 200).call(function () {
            _this.player.rotation = 0;
        }).call(function () {
            _this.player.anchorOffsetY = _this.player.height - 20;
        });
    };
    // 重置游戏
    GameScene.prototype.reset = function () {
        // 清空舞台(删除所有子元素)
        this.blockPanel.removeChildren();
        this.blockArr = [];
        // 添加一个方块
        var blockNode = this.createBlock();
        // 此次游戏得分置零
        this.thisTimeScore = 0;
        blockNode.touchEnabled = false;
        // 设置方块的起始位置
        blockNode.x = 180;
        blockNode.y = this.height / 2 + blockNode.height;
        this.currentBlock = blockNode;
        // 摆正小人的位置
        this.player.y = this.currentBlock.y;
        this.player.x = this.currentBlock.x;
        this.player.source = 'person_r_png';
        this.blockPanel.addChild(this.player);
        // this.blockPanel.addChild(this.scoreIcon);
        // this.blockPanel.addChild(this.scoreLabel);
        this.blockPanel.addChild(this.lifeIcon);
        this.blockPanel.addChild(this.lifeLabel);
        this.direction = 1;
        // 添加积分
        // this.blockPanel.addChild(this.scoreLabel);
        // 添加下一个方块
        this.addBlock();
    };
    // 添加一个方块
    GameScene.prototype.addBlock = function () {
        // debugger;
        // 随机一个方块
        var blockNode = this.createBlock();
        // 设置位置
        var distance = this.minDistance + Math.random() * (this.maxDistance - this.minDistance);
        if (this.direction > 0) {
            blockNode.x = this.currentBlock.x + distance;
            blockNode.y = this.currentBlock.y - distance * this.tanAngle;
        }
        else {
            blockNode.x = this.currentBlock.x - distance;
            blockNode.y = this.currentBlock.y - distance * this.tanAngle;
        }
        this.currentBlock = blockNode;
    };
    // 工厂方法,创建一个方块
    GameScene.prototype.createBlock = function () {
        var blockNode = null;
        if (this.reBackBlockArr.length) {
            // 回收池里面有,则直接取
            blockNode = this.reBackBlockArr.splice(0, 1)[0];
        }
        else {
            // 回收池里面没有,则重新创建
            blockNode = new eui.Image();
        }
        // 使用随机背景图
        var n = Math.floor(Math.random() * this.blockSourceNames.length);
        blockNode.source = this.blockSourceNames[n];
        this.blockPanel.addChildAt(blockNode, 0);
        // 添加品牌标语
        // 设置方块的锚点
        blockNode.anchorOffsetX = 222;
        blockNode.anchorOffsetY = 78;
        // 把新创建的block添加进入blockArr里
        this.blockArr.push(blockNode);
        return blockNode;
    };
    // 添加品牌标语
    GameScene.prototype.addSlogan = function () {
        var sloganMap = {
            "block_digua_png": '让域名创造更多价值啊啊啊啊啊啊',
            "block_icp_png": '让域名创造更多价值啊啊啊啊啊啊',
            "block_jmkj_png": '让域名创造更多价值啊啊啊啊啊啊',
            "block_juming_png": '让域名创造更多价值啊啊啊啊啊啊',
            "block_namepre_png": '让域名创造更多价值',
            "block_yupu_png": '让域名创造更多价值'
        };
        var block = this.blockArr[this.blockArr.length - 1];
        var src = block.source;
        var blockName = src.replace('block_', '').replace('_png', '');
        if (!isNaN(Number(blockName)))
            return false;
        var sloganTxt = '', sloganX, sloganY;
        // rotateDeg = getTanDeg(this.tanAngle);
        // todo
        var slogan = new eui.Label();
        sloganTxt = sloganMap['block_' + blockName + '_png'];
        slogan.size = 25;
        sloganX = this.player.x;
        sloganY = this.player.y - 192;
        slogan.name = 'slogan';
        slogan.text = sloganTxt;
        slogan.anchorOffsetX = slogan.width / 2;
        // 0xF6F705
        slogan.textColor = 0xF6F705;
        slogan.fontFamily = 'Microsoft YaHei';
        slogan.x = sloganX;
        slogan.y = sloganY;
        this.blockPanel.addChild(slogan);
    };
    // 检查标语的边界, 控制标语不超出画布
    // 1 为左边超出, 2 为右边超出
    GameScene.prototype.checkSloganBorder = function (slogan) {
        if (slogan.x - slogan.width / 2 < 0) {
            return 1;
        }
        else if (slogan.x + slogan.width / 2 > this.blockPanel.width) {
            return 2;
        }
        else {
            return 0;
        }
    };
    GameScene.prototype.judgeResult = function () {
        var _this = this;
        // 界面的倒数第二个方块
        var lastButOneBlock = this.blockArr[this.blockArr.length - 2];
        // 根据this.jumpDistance来判断跳跃是否成功
        if (Math.pow(this.currentBlock.x - this.player.x, 2) + Math.pow(this.currentBlock.y - this.player.y, 2) <= 73 * 73) {
            // 小人落在方块上
            var increment = 1;
            // if(){
            // 	// 靠近中心 2分
            // 	increment = 2;
            // }
            // 更新积分
            this.score += increment;
            this.thisTimeScore += increment;
            // 直接新增、操作画布元素
            // var increTextSpr:egret.Sprite = new egret.Sprite();
            var increText = new egret.TextField();
            increText.text = '+' + increment;
            increText.size = 40;
            increText.textColor = 0xffffff;
            // increTextSpr.addChild(increText);
            increText.x = this.player.x - 20;
            increText.y = this.player.y - 160;
            // increText.alpha=0.2;
            this.blockPanel.addChild(increText);
            this.addSlogan();
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
            this.scoreLabel.text = '积分' + this.score.toString();
            // 随机下一个方块出现的位置
            this.direction = Math.random() > 0.5 ? 1 : -1;
            // 当前方块要移动到相应跳跃点的距离
            if (this.direction === 1) {
                this.player.source = 'person_r_png';
            }
            else {
                this.player.source = 'person_l_png';
            }
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
            }, 900).call(function () {
                // 开始创建下一个方块
                _this.addBlock();
                // 让屏幕重新可点;
                _this.blockPanel.touchEnabled = true;
            });
            // console.log('x' + x);
            console.log(this.currentBlock.x);
        }
        else if (Math.pow(lastButOneBlock.x - this.player.x, 2) + Math.pow(lastButOneBlock.y - this.player.y, 2) <= 70 * 70) {
            this.blockPanel.touchEnabled = true;
        }
        else {
            // 失败,弹出重新开始的panel
            console.log('游戏失败!');
            this.overPanel.visible = true;
            // 失败时获取相邻排行榜
            this.getNeighborRankAjax();
            // 失败时获取排行榜
            SceneMange.getInstance().publicScene.rankAjax();
        }
    };
    // todo 渲染neighbor数据
    GameScene.prototype.getNeighborRankAjax = function () {
        // var rankLoadingMc = this.rankScroller.getChildByName('rankLoadingMc');
        // rankLoadingMc.visible = true;
        // this.rankScroller.bounces = false;
        var req = new egret.HttpRequest();
        var params = "?score=" + this.thisTimeScore;
        req.responseType = egret.HttpResponseType.TEXT;
        req.open("http://jmgzh.jo.cn/yx/tyt_zhu/g_paih" + params, egret.HttpMethod.GET);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send();
        req.addEventListener(egret.Event.COMPLETE, onSuccess, this);
        function onSuccess(event) {
            var request = event.currentTarget;
            // 相邻排行数据
            var data = JSON.parse(request.response).msg;
            console.log(data, 'getNeighborRank');
            bus.life = data.scroe.gamesycs;
            bus.userDataset.zscore = data.scroe.zscore;
            this.life = bus.life;
            this.score = Number(bus.userDataset.zscore);
            this.leftLifeLabel.text = this.life.toString();
            this.overScoreLabel.text = this.score.toString();
            this.thisTimeScoreLabel.text = this.thisTimeScore.toString();
            this.renderNeighborRank(data.dqph);
            // 我的排行数据更新
            SceneMange.getInstance().publicScene.userRankCollection.source = [{
                    rankOrder: data.scroe.ph,
                    rankHead: data.scroe.headimgurl,
                    rankName: data.scroe.nickname,
                    rankPoint: data.scroe.zscore
                }];
            // userRankData
        }
    };
    GameScene.prototype.renderNeighborRank = function (data) {
        for (var i = 0; i < data.length; i++) {
            this['neighborRank' + i].getChildAt(0).text = data[i].ph.toString();
            // 若有远程图则加载, 否则用默认图
            this.loadRemoteImg(data[i].headimgurl, this['neighborRank' + i], 1);
            if (data[i].nickname === null) {
                this['neighborRank' + i].getChildAt(2).text = 'null';
            }
            else {
                this['neighborRank' + i].getChildAt(2).text = data[i].nickname.toString();
            }
            this['neighborRank' + i].getChildAt(3).text = data[i].zscore.toString();
        }
    };
    // z 控制屏幕中所有方块移动
    GameScene.prototype.update = function (x, y, increText) {
        var _this = this;
        // egret.Tween.removeAllTweens();
        for (var i = this.blockArr.length - 1; i >= 0; i--) {
            var blockNode = this.blockArr[i];
            if (blockNode.x + (blockNode.width - 222) < 0 || blockNode.x - 222 > this.width || blockNode.y - 78 > this.height) {
                // 方块超出屏幕,从显示列表中移除
                this.blockPanel.removeChild(blockNode);
                this.blockArr.splice(i, 1);
                // 添加到回收数组中
                this.reBackBlockArr.push(blockNode);
            }
            else {
                // 没有超出屏幕的话,则移动
                // 方块移动
                egret.Tween.get(blockNode).to({
                    x: blockNode.x - x,
                    y: blockNode.y - y
                }, 900);
            }
        }
        if (increText) {
            egret.Tween.get(increText).to({
                x: increText.x - x * 4 / 9,
                y: increText.y - y * 4 / 9,
            }, 400).call(function () {
                egret.Tween.get(increText).to({
                    x: increText.x - x * 5 / 9,
                    y: increText.y - y * 5 / 9,
                    alpha: 0
                }, 500);
            });
        }
        var slogan = this.blockPanel.getChildByName('slogan');
        if (slogan) {
            egret.Tween.get(slogan).to({
                x: slogan.x - x,
                y: slogan.y - y
            }, 900).call(function () {
                // 设置显示层级最高以防止被方块遮挡
                _this.blockPanel.setChildIndex(slogan, 99);
                var _flag = _this.checkSloganBorder(slogan);
                if (_flag === 1) {
                    egret.Tween.get(slogan).to({
                        x: slogan.width / 2 + 10
                    }, 250);
                }
                else if (_flag === 2) {
                    egret.Tween.get(slogan).to({
                        x: _this.blockPanel.width - slogan.width / 2 - 10
                    }, 250);
                }
            });
        }
        console.log(this.blockArr);
    };
    // 重新一局
    GameScene.prototype.restartHandler = function () {
        // 隐藏结束场景
        this.overPanel.visible = false;
        // 置空此次游戏积分
        this.thisTimeScore = 0;
        // 记录总积分
        this.scoreLabel.text = this.score.toString();
        // 清空排行列表
        this.rankArrCollection.source = [];
        // 开始放置方块
        this.reset();
        // 游戏场景可点
        this.blockPanel.touchEnabled = true;
    };
    // 加载左上远程图片
    GameScene.prototype.loadMyHeadImg = function (url) {
        var imgLoader = new egret.ImageLoader();
        egret.ImageLoader.crossOrigin = "anonymous";
        imgLoader.load(url);
        imgLoader.once(egret.Event.COMPLETE, function (evt) {
            if (evt.currentTarget.data) {
                egret.log("加载左上头像成功: " + evt.currentTarget.data);
                var texture = new egret.Texture();
                texture.bitmapData = evt.currentTarget.data;
                var bitmap = new egret.Bitmap(texture);
                bitmap.x = 30;
                bitmap.y = 70;
                bitmap.width = 75;
                bitmap.height = 75;
                bitmap.mask = this.userIconMask;
                this.addChild(bitmap);
            }
        }, this);
    };
    // 加载远程图片
    // url 地址, parent 父容器, index 图片深度索引, 
    GameScene.prototype.loadRemoteImg = function (url, parent, index) {
        // return bitmap;
        var image = new eui.Image();
        image.width = 75;
        image.height = 75;
        image.x = 41;
        image.y = 58;
        image.source = 'rank_head_png';
        if (url === null) {
            parent.removeChild(parent.getChildAt(index));
            parent.addChildAt(image, index);
        }
        else {
            var bitmap_1;
            var imgLoader = new egret.ImageLoader();
            egret.ImageLoader.crossOrigin = "anonymous";
            imgLoader.load(url);
            imgLoader.once(egret.Event.COMPLETE, function (evt) {
                if (evt.currentTarget.data) {
                    egret.log("加载左上头像成功: " + evt.currentTarget.data);
                    var texture = new egret.Texture();
                    texture.bitmapData = evt.currentTarget.data;
                    bitmap_1 = new egret.Bitmap(texture);
                    bitmap_1.width = 75;
                    bitmap_1.height = 75;
                    bitmap_1.x = 41;
                    bitmap_1.y = 58;
                    parent.removeChild(parent.getChildAt(index));
                    parent.addChildAt(bitmap_1, index);
                }
            }, this);
        }
    };
    // 为按钮绑定链接
    GameScene.prototype.bindLink = function () {
        // 查看排行榜链接
        // this.viewRankBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(){
        // 	window.open("http://www.sina.com");
        // },this)
    };
    // 查看排行handler
    GameScene.prototype.viewRankHandler = function () {
        this.overPanel.visible = false;
        SceneMange.getInstance().publicScene.rankPanel.visible = true;
        // SceneMange.getInstance().publicScene.
        SceneMange.getInstance().publicScene.rankAjax();
    };
    // 初始化分享得积分的弹窗内功能
    GameScene.prototype.initGiftPanelFuncs = function () {
        // 关闭按钮
        this.giftPanel.getChildAt(6).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            this.giftPanel.visible = false;
            // this.overPanel.visible = true;
            this.giftOpen.visible = true;
            this.giftNum.text = '' + '元';
            this.giftNum.visible = false;
        }, this);
        // 拆红包
        this.giftPanel.getChildAt(3).addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            // 拆红包ajax
            // 完成回调:
            this.giftCap0.text = '恭喜您获得红包';
            this.giftCap1.text = '已存入零钱，可直接提现';
            this.giftOpen.visible = false;
            this.giftNum.text = '' + '元';
            this.giftNum.visible = true;
        }, this);
    };
    // // 获取排行榜ajax
    // private rankAjax() {
    // 	var rankLoadingMc = this.rankScroller.getChildByName('rankLoadingMc');
    // 	rankLoadingMc.visible = true;
    // 	this.rankScroller.bounces = false;
    // 	var req = new egret.HttpRequest();
    // 	// var params = "?curLife="+this.life;
    // 	req.responseType = egret.HttpResponseType.TEXT;
    // 	req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getRank",egret.HttpMethod.GET);
    // 	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // 	req.send();
    // 	// 类似beforeSend, 发送前执行
    // 	// this.loadingPop.visible = true;
    // 	// this.relive.touchEnabled = false;
    // 	req.addEventListener(egret.Event.COMPLETE,onSuccess,this);
    // 	function onSuccess(event:egret.Event):void{
    // 		rankLoadingMc.visible = false;
    // 		this.rankScroller.bounces = true;
    // 		var request = <egret.HttpRequest>event.currentTarget;
    // 		var data = JSON.parse(request.response).data;
    // 		var listData = bus.cloneAndRename(data, {
    // 			order: 'rankOrder',
    // 			name: 'rankName',
    // 			point: 'rankPoint'
    // 		})
    // 		// console.log(listData,this.rankDataList);
    // 		// 新增rankHead属性
    // 		for(let i =0;i<listData.length;i++){
    // 			(<any>Object).assign(listData[i],{rankHead:"rank_head_png"});
    // 		}
    // 		// var arrayCollection = new eui.ArrayCollection();
    // 		// arrayCollection.source = listData;
    // 		// this.rankDataList.dataProvider = arrayCollection
    // 		// this.rankArrCollection.source = this.rankArrCollection.source.concat(listData);
    // 		// this.rankArrCollection.refresh()
    // 		for(let i =0;i<listData.length;i++){
    // 			this.rankArrCollection.addItem(listData[i])
    // 		}
    // 		console.log(listData, this.rankArrCollection);
    // 	}
    // }
    // // rank列表滚动时监听函数
    // private onScrollerChangeHander(e:eui.UIEvent):void{
    // 	var myScroller:eui.Scroller = e.currentTarget;
    // 	//  console.info("x:"+myScroller.viewport.scrollV);
    // 	if(myScroller.viewport.scrollV<-100){
    // 		this.isRefresh = 1;
    // 	}
    // 	if(myScroller.viewport.scrollV>(this.rankArrCollection.length*71-this.rankDataList.height+70)){
    // 		this.isRefresh = -1;
    // 	}
    // }
    // // rank列表滚动结束时监听函数
    // private onScrollerChangeEndHander(e:eui.UIEvent):void{
    // 	if(this.isRefresh!=0){
    // 		console.info("Refresh"+this.isRefresh);
    // 		if(this.isRefresh==-1){
    // 			//这里是上拉加载更多逻辑
    // 			this.rankAjax()
    // 		}
    // 		if(this.isRefresh==1){
    // 			//这里是下拉刷新逻辑
    // 		}
    // 		this.isRefresh = 0;
    // 	}
    // }
    // +++
    // 初始化分享得积分的弹窗内功能
    // private initSharePanelFuncs() {
    // 	// 关闭按钮
    // 	this.sharePanel.getChildAt(2).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
    // 		this.sharePanel.visible = false;
    // 		this.overPanel.visible = true;
    // 	}, this)
    // 	// 分享
    // 	this.sharePanel.getChildAt(3).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
    // 	}, this)
    // 	// 跳转到积分兑换
    // 	this.sharePanel.getChildAt(4).addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
    // 		window.location.href = "http://www.baidu.com"
    // 	}, this)
    // }
    // 红包触发器
    GameScene.prototype.giftTriggerHandler = function () {
    };
    // 复活
    GameScene.prototype.reliveHandler = function () {
        if (this.life === 0) {
            this.overPanel.visible = false;
            SceneMange.getInstance().publicScene.sharePanel.visible = true;
            return false;
        }
        // 生命值 -1 ajax
        var req = new egret.HttpRequest();
        // var params = "?curLife="+this.life;
        req.responseType = egret.HttpResponseType.TEXT;
        // req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife"+params,egret.HttpMethod.GET);
        req.open("http://jmgzh.jo.cn/yx/?tyt_zhu/j_smz", egret.HttpMethod.GET);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.send();
        // 类似beforeSend, 发送前执行
        this.loadingPop.visible = true;
        this.relive.touchEnabled = false;
        // this.restart.touchEnabled = false;
        req.addEventListener(egret.Event.COMPLETE, onSuccess, this);
        // req.addEventListener(egret.ProgressEvent.PROGRESS, function(event:egret.Event):void{
        // }, this)
        function onSuccess(event) {
            var request = event.currentTarget;
            var data = JSON.parse(request.response).msg;
            egret.setTimeout(function () {
                this.life--;
                bus.life = this.life;
                // 此次游戏得分置零
                this.thisTimeScore = 0;
                // console.log(this.life);
                // if (this.life < 0) {
                // 	this.life = 0;
                // 	bus.life = 0;
                // }
                this.lifeLabel.text = this.life.toString();
                if (this.life === 0)
                    this.relive.source = '3_png';
                // direction判断失败界面倒数第二个方块的位置
                if (this.direction === 1) {
                    this.player.x = this.leftOrigin.x;
                    this.player.y = this.height / 2 + this.currentBlock.height;
                }
                else if (this.direction === -1) {
                    this.player.x = this.rightOrigin.x;
                    this.player.y = this.height / 2 + this.currentBlock.height;
                }
                // this.rankArrCollection.source = [];
                // 隐藏结束场景
                this.overPanel.visible = false;
                this.loadingPop.visible = false;
                this.relive.touchEnabled = true;
                // this.restart.touchEnabled = true;
                this.blockPanel.touchEnabled = true;
            }, this, 600);
        }
    };
    Object.defineProperty(GameScene.prototype, "factor", {
        //添加factor的set,get方法,注意用public  
        get: function () {
            return 0;
        },
        //计算方法参考 二次贝塞尔公式  
        set: function (value) {
            this.player.x = (1 - value) * (1 - value) * this.player.x + 2 * value * (1 - value) * (this.player.x + this.targetPos.x) / 2 + value * value * (this.targetPos.x);
            this.player.y = (1 - value) * (1 - value) * this.player.y + 2 * value * (1 - value) * (this.targetPos.y - 300) + value * value * (this.targetPos.y);
        },
        enumerable: true,
        configurable: true
    });
    return GameScene;
}(eui.Component));
__reflect(GameScene.prototype, "GameScene", ["eui.UIComponent", "egret.DisplayObject"]);
// // 复制对象并重命名键名
// let cloneAndRename = (obj, renames):any => {
//     let clone = {};
// 	let cloneArr = []
// 	function _handler(i){
// 		let _obj={};
// 		_obj = (i || i===0) ? obj[i] : obj;
// 		Object.keys(_obj).forEach(function (key) {
// 			if (renames[key] !== undefined) {
// 				clone[renames[key]] = _obj[key];
// 			} else {
// 				clone[key] = _obj[key];
// 			}
// 		});
// 	}
// 	if (!obj.length){
// 		_handler(null)
// 		return clone;
// 	} else {
// 		for(let i = 0; i < obj.length; i++){
// 			_handler(i)
// 			cloneArr.push(JSON.parse(JSON.stringify(clone))) 
// 		}
// 		return cloneArr
// 	}
// }
// 根据tan值求角度值
function getTanDeg(tan) {
    var result = Math.atan(tan) / (Math.PI / 180);
    result = Math.round(result);
    return result;
}
//# sourceMappingURL=GameScene.js.map