let snake;
let apple;
let snakeGame;

window.onload = function()/*lancement a la fenetre*/
/*canvas c html5*/
{

	snakeGame = new SnakeGame(900,600,30);
	snake = new Snake ([[6,4], [5,4], [4,4]], "right");
	apple = new Apple([10,10]);
	snakeGame.init(snake,apple, 200);
}

document.onkeydown = function handleKeyDown(e)
{
	const key = e.keyCode;
	let newDirection;
	switch(key)
	{
		case 37:
			newDirection = "left";
			break;
		case 38:
			newDirection = "up";
			break;
		case 39:
			newDirection = "right";
			break;
		case 40:
			newDirection = "down";
			break;
		case 32:
			snake = new Snake ([[6,4], [5,4], [4,4]], "right");
			applee = new Apple([10,10]);
			snakeGame.init(snake,apple,200);				
			return;		
		default:
			return;
	}
	snakeGame.snake.setDirection(newDirection);		
	}
function SnakeGame(canvasWidth, canvasHeight, blockSize)
{
	this.canvas = document.createElement("canvas");
	this.canvas.width = canvasWidth;
	this.canvas.height = canvasHeight;
	this.canvas.style.border = "30px solid #000";
	this.canvas.style.margin = "50px auto";
	this.canvas.style.display = "block";
	this.canvas.style.backgroundColor = "#222";
	/*pour attacher le scripte a html au body exactement*/
	document.body.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");
	this.blockSize = blockSize;
	this.delay;
	this.snake;
	this.apple;
	this.widthInBlock = canvasWidth/blockSize;
	this.heightInBlock = canvasHeight/blockSize;
	this.score;
	const instance = this;
	let timeout;


	this.init = function(snake, apple, delay)
	{
		this.snake = snake;
		this.apple = apple;
		this.score = 0;
		this.delay= delay;
		clearTimeout(timeout);
		refreshCanvas();
	}

	this.speedUp = function()
	{
		this.delay /= 1.5;
	}


	const refreshCanvas = function()
 	{
		instance.snake.advance();
		if(instance.checkCollision())
			{
				instance.gameOver();
			}
		else
			{
				if(instance.snake.isEatingApple(instance.apple))
				{
					instance.score++;
					instance.snake.ateApple = true;
					do
					{
                    	instance.apple.setNewPosition(instance.widthInBlock, instance.heightInBlock);
					}
					while(instance.apple.isOnSnake(instance.snake))
					
					if(instance.score % 10 == 0)
					{
						instance.speedUp();
					}
				}
			instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
			
			instance.drawScore();
			instance.snake.draw(instance.ctx, instance.blockSize);
			instance.apple.draw(instance.ctx, instance.blockSize);
			timeout = setTimeout(refreshCanvas,instance.delay);
			}
	}


	this.checkCollision = function ()
		{
			let wallCollision = false;
			let snakeCollision =false;
			const head = this.snake.body[0];
			const rest = this.snake.body.slice(1);
			const snakeX = head[0];
			const snakeY = head[1];
			const minX = 0;
			const minY = 0;
			const maxX = this.widthInBlock - 1;
			const maxY = this.heightInBlock - 1;
			const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			const isNotBetweenVerticallWalls = snakeY < minY || snakeY > maxY;
			
			if(isNotBetweenHorizontalWalls || isNotBetweenVerticallWalls)
				{
					wallCollision = true;
				}
			for(let i = 0; i < rest.length; i++)
			{
				if(snakeX === rest[i][0] && snakeY === rest[i][1])
				{
					snakeCollision = true;
				}
			}
			return wallCollision || snakeCollision;
		};

		this.gameOver = function() 
		{

		this.ctx.save();
		this.ctx.font = "bold 70px sans-serif";
        this.ctx.fillStyle = "#000";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 5;
        const centreX = this.canvas.width / 2;
        const centreY = this.canvas.height / 2;      
        this.ctx.strokeText("Game Over", centreX, centreY - 180);
        this.ctx.fillText("Game Over", centreX, centreY - 180);
        this.ctx.font = "bold 30px sans-serif";
        this.ctx.strokeText("Press space to play", centreX, centreY - 120);
        this.ctx.fillText("Press space to play", centreX, centreY - 120);
        this.ctx.restore();
		};
		this.drawScore = function()
		{
			this.ctx.save();
			this.ctx.font = "bold 100px sans-serif";
			this.ctx.fillStyle = "white";
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			const centreX = this.canvas.width /2;
			const centreY = this.canvas.height /2;
			this.ctx.fillText(this.score.toString(), centreX, centreY);
			this.ctx.restore();	
		};
}
function Snake(body, direction)
	{
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function(ctx,blockSize)
		{
			ctx.save();
			ctx.fillStyle ="red";
			for(let i = 0; i < this.body.length; i++)
			{
				let x = this.body[i][0] * blockSize;
				let y = this.body[i][1] * blockSize;
				ctx.fillRect(x, y, blockSize, blockSize);
	
			}
			ctx.restore();
			
		};
		this.advance = function()
		{
			var nextPosition = this.body[0].slice();
			switch(this.direction)
			{
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				case "up":
					nextPosition[1] -= 1;
					break;
				default:
					throw("invalid Direction");
				}
			
			this.body.unshift(nextPosition);
			if(!this.ateApple)
				this.body.pop();
			else
				this.ateApple = false;
		};
		this.setDirection = function(newDirection)
		{
			let allowedDirections;
			switch(this.direction)
			{
				case "left":
				case "right":
					allowedDirections =["up", "down"];
					break;
				case "down":
				case "up":
					allowedDirections =["left", "right"];
					break;
				default:
					throw("invalid Direction");
				}
				if(allowedDirections.indexOf(newDirection)> -1)
					{
						this.direction = newDirection;
					}
		};
		
		
		this.isEatingApple = function(appleToEat)
		{
			const head = this.body[0];
			if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
					return true;
				else
					return false;
			
		};
	}
	function Apple(position)
	{
		this.position = position;
		this.draw = function(ctx,blockSize)
		{
		ctx.save();
		ctx.fillStyle = "green";
		ctx.beginPath();
		const radius = blockSize/2;
		let x = this.position[0] * blockSize + radius;
		let y = this.position[1] * blockSize + radius;
		ctx.arc(x, y, radius, 0, Math.PI*2, true);
		ctx.fill();
		ctx.restore();
		};
		this.setNewPosition = function(widthInBlock, heightInBlock)
		{
			const newX = Math.round (Math.random() * (widthInBlock - 1));
			const newY = Math.round(Math.random() * (heightInBlock - 1));
			this.position = [newX, newY];
		};
		this.isOnSnake = function (snakeToCheck)
		{
			let isOnSnake = false;
			for(let i = 0 ; i < snakeToCheck.body.length; i++)
				{
					if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
						{
							isOnSnake = true;
						}
				}
			return isOnSnake;
		};
	}
		
		