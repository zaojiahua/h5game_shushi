
var PlayLayer = cc.Layer.extend({
	bgSprite : null,
	shuShiSprites : null,
	score : 0,
	time : 10,
	isGameOver : false,
	ctor : function(){
		this._super();

		// 加载资源
		cc.spriteFrameCache.addSpriteFrames(res.ShuShi_plist);

		// 用来存放下落的精灵
		this.shuShiSprites = [];

		var size = cc.director.getWinSize();

		this.bgSprite = new cc.Sprite(res.Background_png);
		this.bgSprite.attr({
			x : size.width / 2,
			y : size.height / 2,
			scale : 0.5,
			rotation : 180
		});
		this.addChild(this.bgSprite);

		this.schedule(this.update, 0.4, 16*1024, 1);
		this.schedule(this.timer, 1, 16*1024, 0);

		this.showHud();

		return true;
	},
	// hud
	showHud : function(){
		var size = cc.director.getWinSize();

		this.scoreLabel = new cc.LabelTTF("score:0", "Arial", 20);
		this.scoreLabel.attr({
			x : size.width / 2 + 100,
			y : size.height - 20
		});
		this.addChild(this.scoreLabel, 5);

		this.timeLabel = new cc.LabelTTF(this.time, "Arial", 20);
		this.timeLabel.attr({
			x : 20,
			y : size.height - 20
		});
		this.addChild(this.timeLabel, 5);
	},
	addScore : function(){
		this.score ++;
		this.scoreLabel.setString("score:" + this.score);
	},
	timer : function(){
		if(this.time <= 0){
			var size = cc.director.getWinSize();

			var gameOver = new cc.LayerColor(cc.color(255, 255, 255, 100));

			var gameOverLabel = new cc.LabelTTF("Game Over", "Arial", 40);
			gameOverLabel.attr({
				x : size.width / 2,
				y : size.height / 2 + 100
			});
			gameOver.addChild(gameOverLabel, 5);
			this.getParent().addChild(gameOver);

			// menu
			var tryAgainItem = new cc.MenuItemFont("Try Again", function(){
                cc.director.runScene(new PlayScene);
			}, this);
			tryAgainItem.attr({
				x : size.width / 2,
				y : size.height / 2,
				anchorX : 0.5,
				anchorY : 0.5
			});
			var menu = new cc.Menu(tryAgainItem);
			menu.attr({
				x : 0,
				y : 0
			});
			gameOver.addChild(menu, 5);

			// this.unschedule(this.update);
			this.unschedule(this.timer);
			
			//game over
			this.isGameOver = true;

			return;
		}
		this.time --;
		this.timeLabel.setString(this.time, "Arial", 20);
	},
	update : function(){
		this.addShuShi();
		this.removeShuShi();
	},
	addShuShi : function(){
		var size = cc.director.getWinSize();

		var shuShi = new ShuShiSprite(res.ShuShi_1n_png);
		var x = 75 + size.width / 2 * cc.random0To1();
		shuShi.attr({
			x : x,
			y : size.height - 30
		});

		var dropAction = new cc.MoveTo(1.5, cc.p(shuShi.x, -30));
		shuShi.runAction(dropAction);
		
		this.addChild(shuShi, 5);

		this.shuShiSprites.push(shuShi);
	},
	removeShuShi : function(){
		for(var i = 0; i < this.shuShiSprites.length; i++){
			if(this.shuShiSprites[i].y <= 0){
				this.shuShiSprites[i].removeFromParent();
				this.shuShiSprites[i] = undefined;
				this.shuShiSprites.splice(i, 1);
				i --;
			}
		}
	}
});

var PlayScene = cc.Scene.extend({
	onEnter : function(){
		this._super();

		var layer = new PlayLayer();
		this.addChild(layer);
	}
});