var gameState,
	currBlock = "",
	predictionBlock = "",
	currTurn = 0,
	currScore = 0,
	startStatus=false,
	canvasHandle = "",
	canvasContent = "",
	firstStart = true,
	isGameOver = true,
	allowButtons =true,
	firstTurn = true,
	payingStatus = "",
	lineRemoveAnimationCounter="";
	
function addEventListeners() {
	
	setUpBackGround();
	
	document.addEventListener('keydown', function(event) {

		switch (event.keyCode) {
			case 37:
				if( !(isGameOver) ){currBlock.moveLeft();}
				break;
			case 39:
				if( !(isGameOver) ){currBlock.moveRight();}
				break;
			case 38:
				if( !(isGameOver) ){currBlock.rotate();}
				break;
			case 40:
				if( !(isGameOver) ){currBlock.moveDown();}
				break;
		}
	});
	canvasHandle.addEventListener('click', on_canvas_click, false);
};	

function Start(){

	firstTurn = true;
	currScore = 0;
	currTurn = 0;
	setUpBackGround();
	initaliseGameState();
	startNewTurn();
	payingStatus = setInterval(animate,400);
	isGameOver = false;
	allowButtons = true;
}

function Pause(){

	clearInterval(payingStatus);
	isGameOver = true;
}

function unPause(){

	payingStatus = setInterval(animate,400);
	isGameOver = false;
}

function gameOver(){

	allowButtons = false;
	isGameOver = true;
	clearInterval(payingStatus);
	
	canvasContent.fillStyle = "rgba(255,10,10,.3)";
	canvasContent.fillRect(0, 0, canvasHandle.width, canvasHandle.height);
	
	//Text
	canvasContent.fillStyle = "black";
	canvasContent.font = "bold 34px Arial";
	canvasContent.fillText("Game Over!", 250, 250);
	
	var tempOffset = 70;
	
	if(currScore > 999){tempOffset=100}
	
	canvasContent.fillStyle = "black";
	canvasContent.font = "bold 26px Arial";
	canvasContent.fillText("Your Score was: "+currScore, 300-tempOffset, 350);
	
	canvasContent.fillStyle = "rgba(20,255,20,.5)";
	canvasContent.fillRect(230, 390, 230, 100);
	
	canvasContent.fillStyle = "rgba(20,255,20,.5)";
	canvasContent.fillRect(240, 400, 210, 80);
	
	canvasContent.fillStyle = "black";
	canvasContent.font = "bold 34px Arial";
	canvasContent.fillText("Play Again?", 250, 450);
	

}

function on_canvas_click(event) {
    var x = event.clientX - canvasHandle.offsetLeft;
    var y = event.clientY - canvasHandle.offsetTop;
	
	if( allowButtons ){
	
		if( (x>454) && (x<558) && (y>397) && (443)){
		
			if(firstStart){
			
				Start();
				startStatus = true;
				changeStartButton(false);
			
			}else{
			
				if(startStatus){
				
					changeStartButton(true);
					startStatus = false;
					Pause();
					
				}else{
					
					changeStartButton(false);
					startStatus = true;
					unPause();
				} 
			}
		}
		
		if( (x>572) && (x<675) && (y>397) && (y<443)){
		
			Pause();
			Start();
			startStatus = true;
			changeStartButton(false);
		}
		
		firstStart = false;
		
	}else {
	
		if( (x>240) && (x<450) && (y>400) && (y<480) ){
			
			Start();
			startStatus = true;
			changeStartButton(false);
			firstStart = false;
		}	
	}
};

function lansBlock(){
	
	this.colour;
	this.used;
	
	this.setUsed = function(u){
		this.used = u;
	}
	this.getUsed = function(){
		return this.used;
	}
	this.setColour = function(c){
		this.colour = c;
	}
	this.getColour = function(){
		return this.colour;
	}
}

function animate(){
	
	if(currBlock.hitBottom){
		
		checkForFullLine();
		startNewTurn();
	}else {
	
		currBlock.moveDown();
	}
	currBlock.testForTop();
}

function startNewTurn(){
	
	currTurn++;
	setBlocks(currTurn);
	
	if(firstTurn){
		generateNextBlock();
	}
	
	currBlock = predictionBlock;
	currBlock.drawInGame();
	generateNextBlock();
	predictionBlock.drawInPrediction();
	firstTurn=false;
}
	
function initaliseGameState(){

	currTurn=0;
	
	gameState = new Array(10);
	
	for(var i=0; i<10; i++){
		
		gameState[i] = new Array(15);
		
		for(var j=0; j<15; j++){
			
			gameState[i][j] = new lansBlock();
			gameState[i][j].setColour(0);
			gameState[i][j].setUsed(0);
		}
	}
};

function generateNextBlock(){

	var blockChoice = ((Math.floor((Math.random()*100)+1))%2),
		colourChoice = ((Math.floor((Math.random()*100)+1))%4); 
	
	if(blockChoice === 0){
	
		predictionBlock = new currentBlock();
		predictionBlock.initPossitions(4,1,5,1,6,1,7,1,4,7,1,colourChoice, 1);
		
	}else if(blockChoice === 1){
	
		predictionBlock = new currentBlock();
		predictionBlock.initPossitions(5,1,6,1,5,2,6,2,5,6,2,colourChoice, 2);
	}

};

function currentBlock(){

	this.possition;
	this.leftMost;
	this.rightMost;
	this.bottomMost;
	this.colour;
	this.hitBottom ;
	this.type;
	this.orientation = 1;
	
	this.tempA;		this.tempB;		this.tempC;
	this.tempD;		this.tempE;		this.tempF;
	this.tempG;		this.tempH;		this.tempLM;
	this.tempRM;	this.tempBM;	this.tempColour;
	this.tempType;
	
	this.initPossitions = function(a,b,c,d,e,f,g,h,lM,rM,bM,colour,type){
		
		this.tempA = a;			this.tempB = b;			this.tempC = c;			
		this.tempD = d;			this.tempE = e;			this.tempF = f;
		this.tempG = g;			this.tempH = h;			this.tempLM = lM;	
		this.tempRM = rM;		this.tempBM = bM;		this.tempColour = colour;
		this.tempType = type;
		this.hitBottom = false;
	
	};
	
	this.drawInPrediction = function(){
		

		canvasContent.clearRect(455, 25, 220, 160);
		canvasContent.fillStyle = "rgba(255,255,255,1)";
		canvasContent.fillRect(455, 25, 220, 160);
		
		drawSquare(this.tempA+8,this.tempB+1,this.tempColour,20);
		drawSquare(this.tempC+8,this.tempD+1,this.tempColour,20);
		drawSquare(this.tempE+8,this.tempF+1,this.tempColour,20);
		drawSquare(this.tempG+8,this.tempH+1,this.tempColour,20);
	}
	
	this.drawInGame = function(){
		
		this.colour = this.tempColour;
		this.type = this.tempType;
		this.hitBottom = false;
		
		gameState[this.tempA-1][this.tempB-1].setUsed(1);
		gameState[this.tempC-1][this.tempD-1].setUsed(1);
		gameState[this.tempE-1][this.tempF-1].setUsed(1);
		gameState[this.tempG-1][this.tempH-1].setUsed(1);
		
		gameState[this.tempA-1][this.tempB-1].setColour(this.colour);
		gameState[this.tempC-1][this.tempD-1].setColour(this.colour);
		gameState[this.tempE-1][this.tempF-1].setColour(this.colour);
		gameState[this.tempG-1][this.tempH-1].setColour(this.colour);
		
		drawSquare(this.tempA,this.tempB,this.colour,0);
		drawSquare(this.tempC,this.tempD,this.colour,0);
		drawSquare(this.tempE,this.tempF,this.colour,0);
		drawSquare(this.tempG,this.tempH,this.colour,0);
		
		this.possition = [
							[this.tempA,this.tempB],
							[this.tempC,this.tempD],
							[this.tempE,this.tempF],
							[this.tempG,this.tempH]
						];
		this.leftMost = this.tempLM;
		this.rightMost = this.tempLM;
		this.bottomMost = this.tempBM;
	}
	
	this.testForTop = function(){
	
		if( (this.bottomMost<3) &&  (this.hitBottom)){
		
			gameOver();
		}
	}
	
	this.testForBottom = function(){
	
		this.testForTop();
		
		this.possition[0][1]
		this.possition[1][1]
		this.possition[2][1] 
		this.possition[3][1]
		
		if( (this.possition[0][1] === 15) ||
			(this.possition[1][1] === 15) ||
			(this.possition[2][1] === 15) ||
			(this.possition[3][1] === 15)	){
			
			this.hitBottom=true;
		}else{
			
			//line
			if( (this.type === 1) && (!this.hitBottom) ){
				
				if( this.orientation === 1 ){
			
					if( ( gameState[(this.possition[0][0]-1) ][(this.possition[0][1])].getUsed() === 1 ) ||
						( gameState[(this.possition[1][0]-1) ][(this.possition[1][1])].getUsed() === 1 ) ||
						( gameState[(this.possition[2][0]-1) ][(this.possition[2][1])].getUsed() === 1 ) ||
						( gameState[(this.possition[3][0]-1) ][(this.possition[3][1])].getUsed() === 1 ) ){
						
						this.hitBottom=true;
					}
				}else if( this.orientation === 2 ){
					
					if( ( gameState[(this.possition[0][0]-1) ][(this.possition[3][1])].getUsed() === 1 ) ){
						
						this.hitBottom=true;
					}
				}
			
			//square
			}else if( (this.type === 2) && (!this.hitBottom) ){
			
				if( ( gameState[ (this.possition[2][0]-1) ][(this.possition[2][1]) ].getUsed() === 1 ) ||
					( gameState[ (this.possition[3][0]-1) ][(this.possition[3][1]) ].getUsed() === 1 ) ){
					
					this.hitBottom=true;
				}
			}
		}
	};
	
	this.rotate = function(){
		
		if( this.type === 1 ){
		
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(0);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(0);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(0);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(0);
			
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(0);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(0);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(0);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(0);
			
			removeSquare(this.possition[0][0], this.possition[0][1]);
			removeSquare(this.possition[1][0], this.possition[1][1]);
			removeSquare(this.possition[2][0], this.possition[2][1]);
			removeSquare(this.possition[3][0], this.possition[3][1]);
			
			if( this.orientation === 1 ){
				
				if( (this.possition[0][1] < 13)){
				
					if( (gameState[(this.possition[0][0]-1)][(this.possition[0][1])].getUsed()===0) &&
						(gameState[(this.possition[0][0]-1)][(this.possition[0][1]+1)].getUsed()===0) &&
						(gameState[(this.possition[0][0]-1)][(this.possition[0][1]+2)].getUsed()===0) ){ 
					
						this.orientation = 2;
						
						this.possition[0][1] = this.possition[0][1];
						this.possition[1][1] = this.possition[1][1]+1;
						this.possition[2][1] = this.possition[2][1]+2;
						this.possition[3][1] = this.possition[3][1]+3;
						
						this.possition[0][0] = this.possition[0][0];
						this.possition[1][0] = this.possition[0][0];
						this.possition[2][0] = this.possition[0][0];
						this.possition[3][0] = this.possition[0][0];
						
						this.leftMost   = this.possition[0][0];
						this.rightMost  = this.possition[0][0];
						this.bottomMost = this.possition[3][1];
						this.hitBottom  = false;
					}
				}
			
			}else if( this.orientation === 2 ){
			
				if( (this.possition[0][0] < 8) ){
				
					if( (gameState[(this.possition[0][0]-2)][(this.possition[0][1]-1)].getUsed()===0) &&
						(gameState[(this.possition[0][0]-3)][(this.possition[0][1]-1)].getUsed()===0) &&
						(gameState[(this.possition[0][0]-4)][(this.possition[0][1]-1)].getUsed()===0)  ){
				
						this.orientation = 1;
						
						this.possition[0][1] = this.possition[0][1];
						this.possition[1][1] = this.possition[1][1]-1;
						this.possition[2][1] = this.possition[2][1]-2;
						this.possition[3][1] = this.possition[3][1]-3;
						
						this.possition[0][0] = this.possition[0][0];
						this.possition[1][0] = this.possition[0][0]+1;
						this.possition[2][0] = this.possition[0][0]+2;
						this.possition[3][0] = this.possition[0][0]+3;
						
						this.leftMost   = this.possition[0][0];
						this.rightMost  = this.possition[3][0];
						this.bottomMost = this.possition[3][1];
						this.hitBottom  = false;
					}
				}
			}
			
			drawSquare(this.possition[0][0], this.possition[0][1], this.colour,0);
			drawSquare(this.possition[1][0], this.possition[1][1], this.colour,0);
			drawSquare(this.possition[2][0], this.possition[2][1], this.colour,0);
			drawSquare(this.possition[3][0], this.possition[3][1], this.colour,0);
			
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(1);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(1);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(1);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(1);
			
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(this.colour);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(this.colour);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(this.colour);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(this.colour);
		}
	};
	
	this.moveDown = function(){
		
		this.testForBottom();
		
		if( (this.bottomMost<15) && (!this.hitBottom) ){
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(0);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(0);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(0);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(0);
			
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(0);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(0);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(0);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(0);
			
			removeSquare(this.possition[0][0], this.possition[0][1]);
			removeSquare(this.possition[1][0], this.possition[1][1]);
			removeSquare(this.possition[2][0], this.possition[2][1]);
			removeSquare(this.possition[3][0], this.possition[3][1]);
			
			this.possition[0][1] = this.possition[0][1]+1;
			this.possition[1][1] = this.possition[1][1]+1;
			this.possition[2][1] = this.possition[2][1]+1;
			this.possition[3][1] = this.possition[3][1]+1;
			
			drawSquare(this.possition[0][0], this.possition[0][1], this.colour,0);
			drawSquare(this.possition[1][0], this.possition[1][1], this.colour,0);
			drawSquare(this.possition[2][0], this.possition[2][1], this.colour,0);
			drawSquare(this.possition[3][0], this.possition[3][1], this.colour,0);
			
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(1);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(1);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(1);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(1);
			
			gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(this.colour);
			gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(this.colour);
			gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(this.colour);
			gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(this.colour);
			
			this.bottomMost++;
		}else{
		
			this.hitBottom=true;
		}
	};
	
	this.moveLeft = function(){
	
		if( (this.leftMost>1) && (!this.hitBottom) ){
		
			if(this.testLeftMovement()){
		
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(0);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(0);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(0);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(0);
				
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(0);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(0);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(0);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(0);
				
				removeSquare(this.possition[0][0], this.possition[0][1]);
				removeSquare(this.possition[1][0], this.possition[1][1]);
				removeSquare(this.possition[2][0], this.possition[2][1]);
				removeSquare(this.possition[3][0], this.possition[3][1]);
				
				this.possition[0][0] = this.possition[0][0]-1;
				this.possition[1][0] = this.possition[1][0]-1;
				this.possition[2][0] = this.possition[2][0]-1;
				this.possition[3][0] = this.possition[3][0]-1;
				
				drawSquare(this.possition[0][0], this.possition[0][1], this.colour,0);
				drawSquare(this.possition[1][0], this.possition[1][1], this.colour,0);
				drawSquare(this.possition[2][0], this.possition[2][1], this.colour,0);
				drawSquare(this.possition[3][0], this.possition[3][1], this.colour,0);
				
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(1);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(1);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(1);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(1);
				
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(this.colour);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(this.colour);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(this.colour);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(this.colour);
				
				this.leftMost = this.leftMost - 1;
				this.rightMost = this.rightMost - 1;
			}
		}
	};
	
	this.moveRight = function(){
	
		if( (this.rightMost<10) && (!this.hitBottom) ){
		
			if( this.testRightMovement() ){
		
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(0);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(0);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(0);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(0);
				
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(0);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(0);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(0);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(0);
				
				removeSquare(this.possition[0][0], this.possition[0][1]);
				removeSquare(this.possition[1][0], this.possition[1][1]);
				removeSquare(this.possition[2][0], this.possition[2][1]);
				removeSquare(this.possition[3][0], this.possition[3][1]);
				
				this.possition[0][0] = this.possition[0][0]+1;
				this.possition[1][0] = this.possition[1][0]+1;
				this.possition[2][0] = this.possition[2][0]+1;
				this.possition[3][0] = this.possition[3][0]+1;
				
				drawSquare(this.possition[0][0], this.possition[0][1], this.colour,0);
				drawSquare(this.possition[1][0], this.possition[1][1], this.colour,0);
				drawSquare(this.possition[2][0], this.possition[2][1], this.colour,0);
				drawSquare(this.possition[3][0], this.possition[3][1], this.colour,0);
				
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setUsed(1);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setUsed(1);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setUsed(1);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setUsed(1);
				
				gameState[(this.possition[0][0]-1)][(this.possition[0][1]-1)].setColour(this.colour);
				gameState[(this.possition[1][0]-1)][(this.possition[1][1]-1)].setColour(this.colour);
				gameState[(this.possition[2][0]-1)][(this.possition[2][1]-1)].setColour(this.colour);
				gameState[(this.possition[3][0]-1)][(this.possition[3][1]-1)].setColour(this.colour);
				
				this.leftMost = this.leftMost + 1;
				this.rightMost = this.rightMost + 1;
			}
		}
	};
	
	this.testLeftMovement = function (){
	
		var canMoveLeft = true;
		
		//line
		if( this.type === 1 ){
			
			if( this.orientation === 1 ){
	
				if( ( gameState[(this.possition[0][0]-2) ][(this.possition[0][1]-1)].getUsed() === 1 )  ){
					
					canMoveLeft=false;
				}	
				
			}else if( this.orientation === 2 ){
			
				if( ( gameState[(this.possition[0][0]-2) ][(this.possition[0][1]-1)].getUsed() === 1 ) ||
					( gameState[(this.possition[1][0]-2) ][(this.possition[1][1]-1)].getUsed() === 1 ) ||
					( gameState[(this.possition[2][0]-2) ][(this.possition[2][1]-1)].getUsed() === 1 ) ||
					( gameState[(this.possition[3][0]-2) ][(this.possition[3][1]-1)].getUsed() === 1 ) ){
					
					canMoveLeft=false;
				}	
			}
		//square
		}else if( this.type === 2 ){
		
			if( ( gameState[ (this.possition[0][0]-2) ][(this.possition[0][1]-1) ].getUsed() === 1 ) ||
				( gameState[ (this.possition[2][0]-2) ][(this.possition[2][1]-1) ].getUsed() === 1 ) ){
				
				canMoveLeft=false;
			}
		}
		
		return canMoveLeft;
	}
	
	this.testRightMovement = function (){
	
		var canMoveRight= true;
		
		if( (this.possition[3][0]<10) && (this.possition[1][0]<10) && (this.possition[3][0]<10)){
			
			//line
			if( this.type === 1 ){
				
				if( this.orientation === 1 ){
		
					if( ( gameState[(this.possition[3][0]) ][(this.possition[0][1]-1)].getUsed() === 1 )  ){
						
						canMoveRight=false;
					}	
					
				}else if( this.orientation === 2 ){
				
					if( ( gameState[(this.possition[0][0])][(this.possition[0][1]-1)].getUsed() === 1 ) ||
						( gameState[(this.possition[1][0])][(this.possition[1][1]-1)].getUsed() === 1 ) ||
						( gameState[(this.possition[2][0])][(this.possition[2][1]-1)].getUsed() === 1 ) ||
						( gameState[(this.possition[3][0])][(this.possition[3][1]-1)].getUsed() === 1 ) ){
						
						canMoveRight=false;
					}	
				}	
			//square
			}else if( this.type === 2 ){
			
				if( ( gameState[ (this.possition[1][0]) ][(this.possition[1][1]-1) ].getUsed() === 1 ) ||
					( gameState[ (this.possition[3][0]) ][(this.possition[3][1]-1) ].getUsed() === 1 ) ){
					
					canMoveRight=false;
				}
			}
		}else{
			canMoveRight=false;
		}
		return canMoveRight;
	}
};

function checkForFullLine(){
	
	var lineValue=0;
	
	for(var i=0; i<15; i++){
	
		lineValue=0;
		
		for(var j=0; j<10; j++){
			
			lineValue= lineValue + gameState[j][i].getUsed();
		}
		
		if(lineValue === 10 ){
		
			removeLine(i);
		}
	}
};

function removeLine(lineNumber){
	
	removeSquare(1, lineNumber+1);
	removeSquare(2, lineNumber+1);
	removeSquare(3, lineNumber+1);
	removeSquare(4, lineNumber+1);
	removeSquare(5, lineNumber+1);
	removeSquare(6, lineNumber+1);
	removeSquare(7, lineNumber+1);
	removeSquare(8, lineNumber+1);
	removeSquare(9, lineNumber+1);
	removeSquare(10, lineNumber+1);
	
	gameState[0][lineNumber].setUsed(0);
	gameState[1][lineNumber].setUsed(0);
	gameState[2][lineNumber].setUsed(0);
	gameState[3][lineNumber].setUsed(0);
	gameState[4][lineNumber].setUsed(0);
	gameState[5][lineNumber].setUsed(0);
	gameState[6][lineNumber].setUsed(0);
	gameState[7][lineNumber].setUsed(0);
	gameState[8][lineNumber].setUsed(0);
	gameState[9][lineNumber].setUsed(0);
	
	gameState[0][lineNumber].setColour(0);
	gameState[1][lineNumber].setColour(0);
	gameState[2][lineNumber].setColour(0);
	gameState[3][lineNumber].setColour(0);
	gameState[4][lineNumber].setColour(0);
	gameState[5][lineNumber].setColour(0);
	gameState[6][lineNumber].setColour(0);
	gameState[7][lineNumber].setColour(0);
	gameState[8][lineNumber].setColour(0);
	gameState[9][lineNumber].setColour(0);
	
	var temp = new Array(10);
	for(var i=0; i<10; i++){
		
		temp[i] = new Array(15);
		
		for(var j=0; j<15; j++){
			
			if(j === 0){
				
				temp[i][j] = new lansBlock();
				temp[i][j].setColour(0);
				temp[i][j].setUsed(0);
				
			}else if( (j>0) && (j<=lineNumber) ){
				
				if( gameState[i][j-1].getUsed() === 1 ){
					
					temp[i][j] = new lansBlock();
					temp[i][j].setColour(gameState[i][j-1].getColour());
					temp[i][j].setUsed(gameState[i][j-1].getUsed());
				}else{
				
					temp[i][j] = new lansBlock();
					temp[i][j].setColour(0);
					temp[i][j].setUsed(0);
				}
			
			}else if(j>lineNumber){
			
				if( gameState[i][j].getUsed() === 1 ){
					
					temp[i][j] = new lansBlock();
					temp[i][j].setColour(gameState[i][j].getColour());
					temp[i][j].setUsed(gameState[i][j].getUsed());
				}else{
				
					temp[i][j] = new lansBlock();
					temp[i][j].setColour(0);
					temp[i][j].setUsed(0);
				}
			}
		}
	}
	
	gameState = temp;
		
	for(var n=0; n<10; n++){
	
		for(var m=0; m<15; m++){
		
			removeSquare(n+1,m+1);
		}
	}
	
	for(var h=0; h<10; h++){
	
		for(var l=0; l<15; l++){
		
			if(gameState[h][l].getUsed()===1){
				
				drawSquare(h+1,l+1,gameState[h][l].getColour(),0);
			}
		}
	}
	
	currScore = currScore + 100; 
	setScore(currScore);
};

function drawSquare(x,y,colour,xOffSet){
	
	var newColour = 0,
		newX = 0,
		newY = 0.
		yOffset = 0;
	
	switch (colour) {
		case 0:
			newColour = "#FFF700"; //yellow
			break;
		case 1:
			newColour = "#FF0000"; //red
			break;
		case 2:
			newColour = "#0015FF"; //blue
			break;
		case 3:
			newColour = "#FA20F6"; //Purple
			break;
		case 5:
			newColour = "#00ff22"; //Green
			break;
	}
	
	if( (predictionBlock.tempType === 1) && (xOffSet>0)  ){
		yOffset=20;
	}
	
	newX = ((25)+(x*40)-40)+xOffSet;
	newY = ((25)+(y*40)-40)+yOffset;

	canvasContent.fillStyle = newColour;
	canvasContent.fillRect(newX, newY, 38, 38);

};

function removeSquare(x,y){
	
	var newX = 0,
		newY = 0;
	newX = ((25)+(x*40)-40);
	newY = ((25)+(y*40)-40);
	canvasContent.clearRect(newX,newY,38,38);
};

function setUpBackGround(){
	
	canvasHandle = document.getElementById("game-canvas");
	canvasContent = canvasHandle.getContext('2d'); 
	
	var bannerText = new Image();
    bannerText.src = 'img/gametext.png';
	
	canvasContent.clearRect(0, 0, canvasHandle.width, canvasHandle.height);
	
	//Filling Background
		//Border
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(0, 0, 700, 650);
			//Contents
			canvasContent.fillStyle = "rgba(160,227,242,.5)";
			canvasContent.fillRect(5, 5, 690, 640);
		
	//Creating Playing area
		//Border
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(20, 20, 408, 610);
			//Contents
			canvasContent.fillStyle = "rgba(255,255,255,1)";
			canvasContent.fillRect(25, 25, 400, 600);
				//grid - Vertical
				canvasContent.moveTo(64, 25);
				canvasContent.lineTo(64, 625);
				canvasContent.moveTo(104, 25);
				canvasContent.lineTo(104, 625);
				canvasContent.moveTo(144, 25);
				canvasContent.lineTo(144, 625);
				canvasContent.moveTo(184, 25);
				canvasContent.lineTo(184, 625);
				canvasContent.moveTo(224, 25);
				canvasContent.lineTo(224, 625);
				canvasContent.moveTo(264, 25);
				canvasContent.lineTo(264, 625);
				canvasContent.moveTo(304, 25);
				canvasContent.lineTo(304, 625);
				canvasContent.moveTo(344, 25);
				canvasContent.lineTo(344, 625);
				canvasContent.moveTo(384, 25);
				canvasContent.lineTo(384, 625);
				canvasContent.moveTo(424, 25);
				canvasContent.lineTo(424, 625);
				
				//grid - Horizontal 
				canvasContent.moveTo(25, 64);
				canvasContent.lineTo(425, 64);
				canvasContent.moveTo(25, 104);
				canvasContent.lineTo(425, 104);
				canvasContent.moveTo(25, 144);
				canvasContent.lineTo(425, 144);
				canvasContent.moveTo(25, 184);
				canvasContent.lineTo(425, 184);
				canvasContent.moveTo(25, 224);
				canvasContent.lineTo(425, 224);
				canvasContent.moveTo(25, 264);
				canvasContent.lineTo(425, 264);
				canvasContent.moveTo(25, 304);
				canvasContent.lineTo(425, 304);
				canvasContent.moveTo(25, 344);
				canvasContent.lineTo(425, 344);
				canvasContent.moveTo(25, 384);
				canvasContent.lineTo(425, 384);
				canvasContent.moveTo(25, 424);
				canvasContent.lineTo(425, 424);
				canvasContent.moveTo(25, 464);
				canvasContent.lineTo(425, 464);
				canvasContent.moveTo(25, 504);
				canvasContent.lineTo(425, 504);
				canvasContent.moveTo(25, 544);
				canvasContent.lineTo(425, 544);
				canvasContent.moveTo(25, 584);
				canvasContent.lineTo(425, 584);
				canvasContent.moveTo(25, 624);
				canvasContent.lineTo(425, 624);
				canvasContent.lineWidth = 2;
				canvasContent.strokeStyle = '#BDBDBD';
				canvasContent.stroke();
	
	//Creating prediction box
		//Border
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(450, 20, 230, 170);
			//Contents
			canvasContent.fillStyle = "rgba(255,255,255,1)";
			canvasContent.fillRect(455, 25, 220, 160);
	
	//Creating Score Text
		//Border
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(450, 250, 230, 120);
			//container
			canvasContent.fillStyle = "rgba(160,227,242,.5)";
			canvasContent.fillRect(455, 255, 220, 110);
				//Text
				canvasContent.fillStyle = "black";
				canvasContent.font = "bold 26px Arial";
				canvasContent.fillText("Score:", 470, 290);
				canvasContent.fillText("0", 560, 290);
				canvasContent.fillText("Blocks:", 470, 340);
				canvasContent.fillText("0", 570, 340);
	
	//Creating Pause/Start, Restart Button
		//border - Start
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(450, 395, 110, 50);	
			//buttons - Start
			canvasContent.fillStyle = "#34FD63";
			canvasContent.fillRect(455, 400, 100, 40);
			canvasContent.fillStyle = "black";
			canvasContent.font = "bold 24px Arial";
			canvasContent.fillText("Start", 475, 428);
			
		//border - Restart
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(570, 395, 110, 50);	
			//buttons - Restart
			canvasContent.fillStyle = "#FD3437";
			canvasContent.fillRect(575, 400, 100, 40);
			canvasContent.fillStyle = "black";
			canvasContent.font = "bold 24px Arial";
			canvasContent.fillText("Restart", 585, 428);
	
	//Creating Game Title
	bannerText.onload = function() {
		canvasContent.drawImage(bannerText, 452, 545);
	};
};

function changeStartButton(start){

	if(start){
	
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(450, 395, 110, 50);	
			//buttons - Start
			canvasContent.fillStyle = "#34FD63";
			canvasContent.fillRect(455, 400, 100, 40);
			canvasContent.fillStyle = "black";
			canvasContent.font = "bold 24px Arial";
			canvasContent.fillText("Start", 475, 428);
	}else {
		
		canvasContent.fillStyle = "#BDBDBD";
		canvasContent.fillRect(450, 395, 110, 50);	
			//buttons - Start
			canvasContent.fillStyle = "#FD3437";
			canvasContent.fillRect(455, 400, 100, 40);
			canvasContent.fillStyle = "black";
			canvasContent.font = "bold 24px Arial";
			canvasContent.fillText("Pause", 469, 428);
	}
}

function setScore(score){

	canvasContent.fillStyle = "#BDBDBD";
	canvasContent.fillRect(560, 260, 100, 50);	
	canvasContent.fillStyle = "rgba(160,227,242,.5)";
	canvasContent.fillRect(560, 260, 100, 50);	
	canvasContent.fillStyle = "black";
	canvasContent.font = "bold 26px Arial";
	canvasContent.fillText(score, 560, 290);
};

function setBlocks(blocks){

	canvasContent.fillStyle = "#BDBDBD";
	canvasContent.fillRect(565, 310, 100, 50);	
	canvasContent.fillStyle = "rgba(160,227,242,.5)";
	canvasContent.fillRect(565, 310, 100, 50);	
	canvasContent.fillStyle = "black";
	canvasContent.font = "bold 26px Arial";
	canvasContent.fillText(blocks, 570, 340);
};