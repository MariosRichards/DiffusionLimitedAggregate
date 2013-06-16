

// Workflow - pomodoros? 3:30
// (1) Get initial canvas with seed image central // DONE
// took another 25 minutes to get the LP logo curried!
// get pixel data, create holding structure
// long delay getting the hang of chrome security error!
// added wandering function (need to pee accelerating implementation)
// delay fixing array setup bug
// (2) Add moving particle structure + brownian motion, add reading pixel data
// (3) Add writing pixel data on collision, add mouseover event



window.onload = function() {

	var theCanvas = document.getElementById("mycanvas");
	var theContext = theCanvas.getContext("2d");

	reqFrame =window.requestAnimationFrame ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame ||
	          window.oRequestAnimationFrame ||
	          window.msRequestAnimationFrame ||
	          function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element){
	            window.setTimeout(callback, 1000 / 60);
				};


	var canvasWidth = theCanvas.width;
	var canvasHeight = theCanvas.height;

	var seedImage = new Image();
	seedImage.src = "LPlogo.png";
	
	var pixelArray = []; // use array of arrays format! best?
	
	var seedImageWidth, seedImageHeight;
	
	var seedRadius;
	
	var pixelNumber = 0;
	
	var sourceX = canvasWidth/2;
	var sourceY = 100;
	
	var stop = true;
	var pause = true;
	
	for (var xpos = 0; xpos <canvasWidth; xpos++)
	{
		pixelArray[xpos] = [];
		for (var ypos = 0; ypos <canvasHeight; ypos++)
		{
			pixelArray[xpos][ypos] = 0;
		}
	}

	
	start = function(seedImage,theContext,canvasWidth,canvasHeight,pixelArray,seedImageWidth,seedImageHeight)
	{
		// put seed image onto centre of canvas!
		// drawImage?
	
		seedImageWidth = seedImage.width;
		seedImageHeight = seedImage.height;
		theContext.drawImage(seedImage,(canvasWidth-seedImageWidth)/2,(canvasHeight-seedImageHeight)/2);

		// get pixel data
		var imgData=theContext.getImageData(0,0,canvasWidth,canvasHeight);
		var notWhite;
		var xpos, ypos;
		var imgDataLength = imgData.data.length;
		var imageData = imgData.data;
		for (var pos = 0; pos <imgDataLength; pos+=4)
		{

			xpos = ((pos/4) % canvasWidth)<<0;
			ypos = ((pos/4) / canvasWidth)<<0;
			// didn't work!
			(imageData[pos]==255 && imageData[pos+1]==255 && imageData[pos+2]==255) || imageData[pos+3] ==0 ? notWhite = 0 : notWhite = 1;
			pixelArray[xpos][ypos] = notWhite;
		
		}

		// initial game loop and request draw
		// var now = Date.now();
		reqFrame(drawLoop);
		
	}	

	
	doClick = function(evt)
	{
		if (pause)
		{
			sourceX = evt.pageX - theCanvas.offsetLeft;
			sourceY = evt.pageY - theCanvas.offsetTop;	

			sourceX = Math.min( Math.max(sourceX, 1), canvasWidth-2);
			sourceY = Math.min( Math.max(sourceY, 1), canvasHeight-2);
			
			if (pixelArray[sourceX][sourceY])
			{
				stop = false;
			}
			else if (!stop)
			{
				stop = true;
				reqFrame(drawLoop);
			}
		}

    }	

	
	pause = function(evt)
	{
		pause = !pause;
		if (pause)
		{
			reqFrame(drawLoop);
		}
	}
	
	theCanvas.addEventListener("mousemove",doClick,false);	
	
	theCanvas.addEventListener("dblclick",pause,false);	
	
	seedImage.onload = function()
	{
	
		start(seedImage,theContext,canvasWidth,canvasHeight,pixelArray,seedImageWidth,seedImageHeight);
		
	}

	
	doWander = function()
	{
	
		// particle has to start somewhere
			// outside of the SeedRadius
			// but inside the canvas
			// cheat to start with
			
		var x = sourceX;
		var y = sourceY;
		
		var angle = Math.PI*2*Math.random;
		var radius = (Math.min(canvasWidth,canvasHeight)-100)/2;
		x = (canvasWidth/2 +    (Math.cos(angle)*radius))<<0;
		y = (canvasHeight/2 +    (Math.sin(angle)*radius))<<0;		
		
		// check not already in contact
			// outside the bounds!
			
		var wandering = true;
		var brownian;
		var wanderTime =0;
		while (wandering)
		{
		// brownian motion
			brownian = (Math.random()*4)<<0;

			switch(brownian)
			{
				case 0:
					x++;
					break;
				case 1:
					y++;
					break;				
				case 2:
					y--;
					break;				
				case 3:
					x--;
					// break;				
				// case 4:
					// x--;
					// y--;
					// break;				
				// case 5:
					// x--;
					// y++;
					// break;					
				// case 6:
					// x++;
					// y--;
					// break;
				// case 7:
					// x++;
					// y++;					
			}
		
			// optimisation = store values -2
			// transform map context to make origin at centre
			// would lead to difficulties with array!
		
			if (x<1 || x >(canvasWidth-2) || y<1 || y >(canvasHeight-2))// if collide with wall
			{
				// wandering = true
				// reset start position with new particle			
				// x = sourceX;
				// y = sourceY;				
				
				var angle = Math.PI*2*Math.random();
				var radius = (Math.min(canvasWidth,canvasHeight)-100)/2;
				x = (canvasWidth/2 +    (Math.cos(angle)*radius))<<0;
				y = (canvasHeight/2 +    (Math.sin(angle)*radius))<<0;
				
				
			
			} // assumes these two things are contradictory!
			else if( pixelArray[x-1][y]
				  || pixelArray[x][y-1]
				  || pixelArray[x+1][y]
				  || pixelArray[x][y+1]
				  // || pixelArray[x+1][y+1]
				  // || pixelArray[x-1][y+1]
				  // || pixelArray[x+1][y-1]
				  // || pixelArray[x-1][y-1]
				  )


			// if collide with aggregate
			{
				// plot pixel on canvas
				// wanderTime%256
				// rgb(255,0,0)
				// hsl(120,100%,50%)
				var a = 'hsl('+(Math.log(wanderTime+1)*20)%360+',100%,50%)';
				//'rgb('+ wanderTime%256 +',0,'+ (255-wanderTime%256) +')'
				theContext.fillStyle = a ;
				theContext.fillRect(x, y, 1, 1);
				// update internal pixelArray				
				pixelArray[x][y] = 1;
				wandering = false; // allow for redraw!

				// wandering = false;				

			}
			wanderTime++;
		}
		pixelNumber++;
	}

	
    drawLoop = function() //
	{
		var now = Date.now();
		while ((Date.now()-now)<8)
		{
			doWander();
		}

		if (stop && pause)
		{
			reqFrame(drawLoop);
		}

    }

};		


	
// setup - load resources (seed image)

// place seed image onto canvas

// get array of pixels

// loop

// create new walker at some position (eventually the mouseover position)


// brownian walk until either
// brown = (Math.random()*4)<<0; // 0-3
// x+= brown


// 0 -> -1, 1 -> 0, 2 -> 1, 3->0

//   brown & 0x1
// fun little problem!




// have I hit the wall?
   // kill particle
   
// if not, have I hit the aggreate (check pixel array)
   // add to pixel array
   // put pixel on screen
   // http://jsperf.com/setting-canvas-pixel
   
      //Fill rect!







// hits kill zone
// hits the aggregate
//    if hit aggregate add to aggregate









