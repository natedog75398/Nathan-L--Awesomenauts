game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        this.goldTimerCheck();
        this.creepTimerCheck();

        return true;
    },
    goldTimerCheck: function() {
        if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= 1000)) {
            game.data.gold += game.data.exp1 + 1;
            //console.log("Current gold: " + game.data.gold);

        }
    },
    creepTimerCheck: function() {
        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 2700, 0, {});
            me.game.world.addChild(creepe, 5);
            //putting creep in game

        }
    }
});

game.HeroDeathManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        //always updating
    },
    update: function() {
        if (game.data.player.dead) {
            me.game.world.removeChild(game.data.player);
            //if player is dead remove him
            me.state.current().resetPlayer(10, 0);
            //reset the player to set coordinates
        }
        return true;
        //returning true
    }
});


game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        //always updating
        this.gameover = false;
        //game over is false

    },
    update: function() {
        if (game.data.win === true && !this.gameover) {
            this.gameOver(true);
        } else if (game.data.win === false && !this.gameover) {
            //if the game isnt over and you loose game is over
            this.gameOver(false);

        }

        return true;
        //returning true
    },
    gameOver: function(win) {
        if (win) {
            game.data.exp += 10;
            //if game dosnet end you get 10
        } else {
            game.data.exp += 1;
            //if game isnt over you gain 1 health
        }
        game.data.gameover = true;
        //game is over
        me.save.exp = game.data.exp;
        //saving game experience
        me.save.exp2 = 4;
    }
});

game.SpendGold = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.buying = false;
    },
    update: function() {
        this.now = new Date().getTime();

        if (me.input.isKeyPressed("buy") && this.now - this.lastBuy >= 1000) {
            this.lastBuy = this.now;
            if (!this.buying) {
                this.startBuying();

            } else {
                this.stopBuying();
            }

        }

        return true;
    },
    startBuying: function() {
        this.buying = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.state.pause(me.state.PLAY);
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        this.setBuyText();
    },
    setBuyText: function() {
        game.data.buytext = new (me.Renderable.extend({
            init: function() {

                this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");
                this.updateWhenPaused = true;
                this.alwaysupdate = true;


            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "Press F1-F6 TO BUY. F5 TO SKIP", this.pos.x, this.pos.y);
            }


        }));
        me.game.world.addChild(game.data.buytext, 35);
    },
    stopBuying: function() {
        this.buying = false;
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.buyscreen);
        me.input.unbindKey(me.input.KEY.F1);
        me.input.unbindKey(me.input.KEY.F2);
        me.input.unbindKey(me.input.KEY.F3);
        me.input.unbindKey(me.input.KEY.F4);
        me.input.unbindKey(me.input.KEY.F5);
        me.input.unbindKey(me.input.KEY.F6);
        me.game.world.removeChild(game.data.buytext);
    }
});
