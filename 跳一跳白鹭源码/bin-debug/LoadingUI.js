//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
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
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        // 获取、设置初始生命值 life ajax
        // var req = new egret.HttpRequest();
        // req.responseType = egret.HttpResponseType.TEXT;
        // req.open("https://www.easy-mock.com/mock/5bf3a15a531b28495fc589d3/tyt/getLife",egret.HttpMethod.GET);
        // req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // req.send();
        // req.addEventListener(egret.Event.COMPLETE,function(event:egret.Event):void{
        // 	var request = <egret.HttpRequest>event.currentTarget;
        // 	var data = JSON.parse(request.response).data;
        //     bus.life = data.life;
        // 	console.log(request.response);
        // },this);
        // req.addEventListener(egret.ProgressEvent.PROGRESS,function(event:egret.Event):void{
        // 	this.blockPanel.touchEnabled = false;
        // },this)
        // req.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        this.textField = new eui.Label();
        this.textField.horizontalCenter = "0";
        // this.textField.textColor = 0xffffff;
        this.textField.y = 400;
        this.textField.x = 70;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.textColor = 0xffffff;
        // this.bac = new eui.Rect();
        // this.bac.left = 0;
        // this.bac.right = 0;
        // this.bac.top = 0;
        // this.bac.bottom = 0;
        // this.bac.fillColor = 0x0D88D8;
        // <e:Rect anchorOffsetX="0" anchorOffsetY="0" left="0" right="0" top="0" bottom="0" strokeAlpha="0.6" fillAlpha="0.6"/>
        // this.addChild(this.bac);
        this.addChild(this.textField);
    };
    LoadingUI.prototype.onProgress = function (current, total) {
        // var num:any = current/total
        // var per = num.toFixed(2)*100 + '%';
        // this.textField.text = `加载中...${current}/${total}`;
        this.textField.text = "\u52A0\u8F7D\u4E2D...";
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI", ["RES.PromiseTaskReporter"]);
//# sourceMappingURL=LoadingUI.js.map