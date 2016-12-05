
var ShuShiSprite = cc.Sprite.extend({
	disappearAction : null,
	onEnter : function(){
		this._super();

		this.disappearAction = this.createDisappearAction();
		this.disappearAction.retain();

		this.addTouchListener();
	},
	onExit : function(){
		this.disappearAction.release();

		this._super();
	},
	addTouchListener : function(){
		this.touchListener = cc.EventListener.create({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches : true,
			onTouchBegan : function(touch, event){
				var pos = touch.getLocation();
				var target = event.getCurrentTarget();

				if(target.getParent().isGameOver) return;

				if(cc.rectContainsPoint(target.getBoundingBox(), pos)){
					
					cc.eventManager.removeListener(target.touchListener);
					target.stopAllActions();
					var dc = target.disappearAction;
					var sequence = cc.Sequence.create(dc, 
						cc.CallFunc.create(function(){
							target.removeFromParent();
						}, target));
					target.runAction(sequence);

					// update hud
					target.getParent().addScore();

					return true;
				}
				return false;
			}
		});
		cc.eventManager.addListener(this.touchListener, this);
	},
	createDisappearAction : function(){
		var spriteSheets = [];
		for(var i = 0; i < 11; i++){
			var spriteName = "sushi_1n_"+ i +".png";
			sprite = cc.spriteFrameCache.getSpriteFrame(spriteName);
			spriteSheets.push(sprite);
		}
		var animation = new cc.Animation(spriteSheets, 0.01);
		var animate = new cc.Animate(animation);

		return animate;
	}
});