(function( self ){

	var Stats = function( realTime ){

		if( this instanceof Stats ){

			return Stats.methods.initialize(realTime);

		}
		else {

			return new Stats(realTime);

		};

	};

	var PIXEL_RATIO = Math.round(window.devicePixelRatio || 1);

	var SIZE = {
		WIDTH: 80 * PIXEL_RATIO,
		HEIGHT: 50 * PIXEL_RATIO,
		FRAMES: {
			WIDTH: 74 * PIXEL_RATIO,
			HEIGHT: 32 * PIXEL_RATIO,
			X: 3 * PIXEL_RATIO,
			Y: 15 * PIXEL_RATIO
		},
		TEXT: {
			HEIGHT: 8 * PIXEL_RATIO,
			X: 75 * PIXEL_RATIO,
			Y: 10 * PIXEL_RATIO
		}
	};

	var STYLE = {
		FPS: {
			DATAS: "#1AFFFF",
			FRAMES: "#1B314C",
			BACKGROUND: "#1A1A38"
		},
		MS: {
			DATAS: "#1AFF1A",
			FRAMES: "#1B4C1B",
			BACKGROUND: "#1A381A"
		},
		MB: {
			DATAS: "#FF1A94",
			FRAMES: "#4C1B34",
			BACKGROUND: "#381A29"
		},
		PING: {
			DATAS: "#FFFFFF",
			FRAMES: "#555555",
			BACKGROUND: "#222222"
		}
	};

	var MODES = {
		FPS: 0,
		MS: 1,
		MB: 2,
		PING: 3
	};

	var SUPPORT_MODE_MB = (window.performance != undefined && window.performance.memory != undefined && window.performance.memory.usedJSHeapSize != undefined ? true : false);

	Stats.methods = {
		initialize: function( realTime ){

			this.mode = MODES.FPS;

			this.realTime = (realTime || false);

			this.frameTime = 0;

			this.beginTime = 0;
			this.endTime = 0;

			this.isPinging = false;
			this.beginPinging = 0;
			this.endPinging = 0;

			this.fps = {
				value: 0,
				current: 0,
				min: Infinity,
				max: -Infinity,
				array: new Array(SIZE.FRAMES.WIDTH)
			};

			this.ms = {
				value: 0,
				current: 0,
				min: Infinity,
				max: -Infinity,
				array: new Array(SIZE.FRAMES.WIDTH)
			};

			this.mb = {
				value: 0,
				current: 0,
				min: Infinity,
				max: -Infinity,
				array: new Array(SIZE.FRAMES.WIDTH)
			};

			this.ping = {
				value: 0,
				current: 0,
				min: Infinity,
				max: -Infinity,
				array: new Array(SIZE.FRAMES.WIDTH)
			};

			this.domElement = document.createElement("canvas");
			this.domElement.className = "statsjs";

			this.domElement.width = SIZE.WIDTH;
			this.domElement.height = SIZE.HEIGHT;

			this.domElement.style.width = (SIZE.WIDTH / PIXEL_RATIO) + "px";
			this.domElement.style.height = (SIZE.HEIGHT / PIXEL_RATIO) + "px";

			this.domElement.addEventListener("click", function( event ){

				this.switchMode();

			}.bind(this), false);

			this.context = this.domElement.getContext("2d");

			this.context.imageSmoothingEnabled = false;
			this.context.font = "bold " + SIZE.TEXT.HEIGHT + "px sans-serif";
			this.context.textAlign = "right";

			return this;

		},
		switchMode: function(){

			if( this.mode == MODES.FPS ){

				this.mode = MODES.MS;

			}
			else if( this.mode == MODES.MS ){

				if( SUPPORT_MODE_MB == true ){

					this.mode = MODES.MB;

				}
				else {

					this.mode = MODES.PING;				

				};

			}
			else if( this.mode == MODES.MB ){

				this.mode = MODES.PING;

			}
			else if( this.mode == MODES.PING ){

				this.mode = MODES.FPS;

			};

			this.draw();

		},
		begin: function(){

			this.beginTime = window.performance.now();

		},
		end: function(){

			var now = window.performance.now();
			var deltaTime = (now - this.frameTime);

			this.endTime = now;

			this.fps.current++;
			this.fps.max = Math.max(this.fps.current, this.fps.max);

			this.ms.current = (this.endTime - this.beginTime).toFixed(0);
			this.ms.min = Math.min(this.ms.current, this.ms.min);
			this.ms.max = Math.max(this.ms.current, this.ms.max);

			if( SUPPORT_MODE_MB == true ){

				this.mb.current = Math.round(window.performance.memory.usedJSHeapSize * 0.000000954);
				this.mb.min = Math.min(this.mb.current, this.mb.min);
				this.mb.max = Math.max(this.mb.current, this.mb.max);

			};

			if( this.realTime == true ){

				this.fps.value = this.fps.current;

				this.fps.array[this.fps.array.length - 1] = this.fps.value;

			};

			if( deltaTime < 1000 && this.realTime == true ){

				this.draw();

			}
			else if( deltaTime >= 1000 ){

				this.fps.min = Math.min(this.fps.current, this.fps.min);

				this.frameTime = now;

				this.fps.value = this.fps.current;
				this.ms.value = this.ms.current;
				this.mb.value = this.mb.current;
				this.ping.value = this.ping.current;

				for( var index = 0, length = SIZE.FRAMES.WIDTH; index < length; index++ ){

					this.fps.array[index] = this.fps.array[index + 1];
					this.ms.array[index] = this.ms.array[index + 1];
					this.mb.array[index] = this.mb.array[index + 1];
					this.ping.array[index] = this.ping.array[index + 1];

				};

				this.fps.array[this.fps.array.length - 1] = this.fps.value;
				this.ms.array[this.ms.array.length - 1] = this.ms.value;
				this.mb.array[this.mb.array.length - 1] = this.mb.value;
				this.ping.array[this.ping.array.length - 1] = this.ping.value;

				this.draw();

				this.fps.current = 0;

			};

		},
		beginPing: function(){

			this.beginPinging = window.performance.now();

		},
		endPing: function(){

			this.endPinging = window.performance.now();
			this.ping.current = parseInt(this.endPinging - this.beginPinging);

			this.ping.min = Math.min(this.ping.current, this.ping.min);
			this.ping.max = Math.max(this.ping.current, this.ping.max);

		},
		draw: function(){

			this.context.clearRect(0, 0, SIZE.WIDTH, SIZE.HEIGHT);

			if( this.mode == MODES.FPS ){

				this.context.fillStyle = STYLE.FPS.BACKGROUND;
				this.context.fillRect(0, 0, SIZE.WIDTH, SIZE.HEIGHT);

				this.context.fillStyle = STYLE.FPS.FRAMES;
				this.context.fillRect(SIZE.FRAMES.X, SIZE.FRAMES.Y, SIZE.FRAMES.WIDTH, SIZE.FRAMES.HEIGHT);

				this.context.fillStyle = STYLE.FPS.DATAS;

				var min = (this.fps.min == Infinity ? "∞" : this.fps.min);
				var max = (this.fps.max == -Infinity ? "∞" : this.fps.max);

				if( this.realTime == true ){

					this.context.fillText(this.fps.current + " FPS (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				}
				else {

					this.context.fillText(this.fps.value + " FPS (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				};

				for( var line = 0, length = this.fps.array.length; line < length; line++ ){

					var height = (((this.fps.array[line] / this.fps.max) * SIZE.FRAMES.HEIGHT) || 0);

					var x = SIZE.FRAMES.X + line;
					var y = (SIZE.FRAMES.Y + SIZE.FRAMES.HEIGHT) - height;

					this.context.fillRect(x, y, 1, height);

				};

			}
			else if( this.mode == MODES.MS ){

				this.context.fillStyle = STYLE.MS.BACKGROUND;
				this.context.fillRect(0, 0, SIZE.WIDTH, SIZE.HEIGHT);

				this.context.fillStyle = STYLE.MS.FRAMES;
				this.context.fillRect(SIZE.FRAMES.X, SIZE.FRAMES.Y, SIZE.FRAMES.WIDTH, SIZE.FRAMES.HEIGHT);

				this.context.fillStyle = STYLE.MS.DATAS;

				var min = (this.ms.min == Infinity ? "∞" : this.ms.min);
				var max = (this.ms.max == -Infinity ? "∞" : this.ms.max);

				if( this.realTime == true ){

					this.context.fillText(this.ms.current + " MS (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				}
				else {

					this.context.fillText(this.ms.value + " MS (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				};

				for( var line = 0, length = this.ms.array.length; line < length; line++ ){

					var height = (((this.ms.array[line] / this.ms.max) * SIZE.FRAMES.HEIGHT) || 0);

					var x = SIZE.FRAMES.X + line;
					var y = (SIZE.FRAMES.Y + SIZE.FRAMES.HEIGHT) - height;

					this.context.fillRect(x, y, 1, height);

				};

			}
			else if( this.mode == MODES.MB ){

				this.context.fillStyle = STYLE.MB.BACKGROUND;
				this.context.fillRect(0, 0, SIZE.WIDTH, SIZE.HEIGHT);

				this.context.fillStyle = STYLE.MB.FRAMES;
				this.context.fillRect(SIZE.FRAMES.X, SIZE.FRAMES.Y, SIZE.FRAMES.WIDTH, SIZE.FRAMES.HEIGHT);

				this.context.fillStyle = STYLE.MB.DATAS;

				var min = (this.mb.min == Infinity ? "∞" : this.mb.min);
				var max = (this.mb.max == -Infinity ? "∞" : this.mb.max);

				if( this.realTime == true ){

					this.context.fillText(this.mb.current + " MB (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				}
				else {

					this.context.fillText(this.mb.value + " MB (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				};

				for( var line = 0, length = this.mb.array.length; line < length; line++ ){

					var height = (((this.mb.array[line] / this.mb.max) * SIZE.FRAMES.HEIGHT) || 0);

					var x = SIZE.FRAMES.X + line;
					var y = (SIZE.FRAMES.Y + SIZE.FRAMES.HEIGHT) - height;

					this.context.fillRect(x, y, 1, height);

				};

			}
			else if( this.mode == MODES.PING ){

				this.context.fillStyle = STYLE.PING.BACKGROUND;
				this.context.fillRect(0, 0, SIZE.WIDTH, SIZE.HEIGHT);

				this.context.fillStyle = STYLE.PING.FRAMES;
				this.context.fillRect(SIZE.FRAMES.X, SIZE.FRAMES.Y, SIZE.FRAMES.WIDTH, SIZE.FRAMES.HEIGHT);

				this.context.fillStyle = STYLE.PING.DATAS;

				var min = (this.ping.min == Infinity ? "∞" : this.ping.min);
				var max = (this.ping.max == -Infinity ? "∞" : this.ping.max);

				if( this.realTime == true ){

					this.context.fillText(this.ping.current + " PING (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				}
				else {

					this.context.fillText(this.ping.value + " PING (" + min + "-" + max + ")", SIZE.TEXT.X, SIZE.TEXT.Y);

				};

				for( var line = 0, length = this.ping.array.length; line < length; line++ ){

					var height = (((this.ping.array[line] / this.ping.max) * SIZE.FRAMES.HEIGHT) || 0);

					var x = SIZE.FRAMES.X + line;
					var y = (SIZE.FRAMES.Y + SIZE.FRAMES.HEIGHT) - height;

					this.context.fillRect(x, y, 1, height);

				};

			};

		}
	};

	Stats.methods.initialize.prototype = Stats.methods;

	if( typeof define !== "undefined" && define instanceof Function && define.amd != undefined ){

		define(function(){

			return Stats;

		});

	}
	else if( typeof module !== "undefined" && module.exports ){

		module.exports = Stats;

	}
	else if( self != undefined ){

		self.Stats = Stats;

	};

})(this || {});
