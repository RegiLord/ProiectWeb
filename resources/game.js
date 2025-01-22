window.onload = function() {
	const quizButton = document.getElementById("button1");
	const paintButton = document.getElementById("button2");
	const imageButton = document.getElementById("button3");

	quizButton.onclick = quizButtonClicked;
	paintButton.onclick = paintButtonClicked;
	imageButton.onclick = imageButtonClicked;
}

function quizButtonClicked() {
	const GameContainer = document.getElementById("GameContainer");
	resetContainer(GameContainer)
	GameContainer.innerText = "";
	GameContainer.style.backgroundColor = "#e09b04";

	const CurrentScore = document.createElement("p");
	const HighScore = document.createElement("p");
	const PlayScreen = document.createElement("div")

	const TextBox = document.createElement("p");
	const AnswerList = document.createElement("div");

	localStorage.setItem("Score", 0);
	CurrentScore.innerText = `Score: ${localStorage.getItem("Score")}`;
	CurrentScore.setAttribute("id", "score");

	if (localStorage.getItem("Highscore") == null) {
		localStorage.setItem("Highscore", 0);
	}
	HighScore.innerText = `HighScore: ${localStorage.getItem("Highscore")}`;
	HighScore.setAttribute("id", "highScore");

	PlayScreen.style.height = "100%";
	PlayScreen.style.display = "Flex";
	PlayScreen.style.flexDirection = "Column";
	PlayScreen.style.alignItems = "center";
	PlayScreen.style.justifyContent = "center";
	
	TextBox.innerText = "Want to start quiz?";
	TextBox.style.marginBottom = "100px";
	TextBox.setAttribute("id", "QuestionBox");
	AnswerList.style.display = "Flex";
	AnswerList.setAttribute("id", "AnswerList");

	const startButton = document.createElement("button");
	startButton.classList.add("buttonSt");
	startButton.innerText = "START";
	startButton.onclick = StartQuiz;
	AnswerList.appendChild(startButton)

	GameContainer.appendChild(CurrentScore);
	GameContainer.appendChild(HighScore);
	
	PlayScreen.appendChild(TextBox);
	PlayScreen.appendChild(AnswerList);
	GameContainer.appendChild(PlayScreen);

}

function paintButtonClicked() {
	const GameContainer = document.getElementById("GameContainer");
	resetContainer(GameContainer)
	GameContainer.style.backgroundColor = "white";

	let menubar = document.createElement("div")
	menubar.innerText = " "
	menubar.setAttribute("id", "menubar")
	menubar.style.backgroundColor = "grey"
	menubar.style.display = "flex"
	menubar.style.alignItems = "center"
	menubar.style.height = "40px"

	GameContainer.appendChild(menubar)
	let range = document.createElement('input');
	range.setAttribute("type","range");
	range.setAttribute("id","range");
	range.setAttribute("min","1");
	range.setAttribute("max","10");
	range.setAttribute("value","1");
	range.style.float = "left"
	menubar.appendChild(range)
	let colorPicker = document.createElement("input")
	colorPicker.setAttribute("type", "color")
	colorPicker.setAttribute("id","picker")
	colorPicker.style.float = "left"
	menubar.appendChild(colorPicker)
	let clearButton = document.createElement("button")
	clearButton.innerText = "Clear"
	clearButton.setAttribute("id", "clear")
	clearButton.style.float = "left"
	let saveButton = document.createElement("button")
	saveButton.innerText = "Save"
	saveButton.style.float = "left"
	saveButton.setAttribute("id", "save")
	menubar.appendChild(clearButton)
	menubar.appendChild(saveButton)

	var canvas = document.createElement("canvas")
	canvas.setAttribute("id", "canvas")
	canvas.height = parseInt(window.getComputedStyle(GameContainer).getPropertyValue("height")) - parseInt(window.getComputedStyle(menubar).getPropertyValue("height"))
	canvas.width = parseInt(window.getComputedStyle(GameContainer).getPropertyValue("width"))
	GameContainer.append(canvas)

	
	var ctx, flag = false,
        prevX = 0,
        currX = 0,
        prevY = 0,
        currY = 0,
        dot_flag = false;

    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)        
	}, false);
 	canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
    
    function draw() {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = range.value;
        ctx.stroke();
        ctx.closePath();
    }
    
	clearButton.onclick = erase
    function erase() {
        var m = confirm("Want to clear");
        if (m) 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
	saveButton.onclick = save
    function save() {
        var dataURL = canvas.toDataURL();

		const promireFetch = fetch("http://localhost:8000/resources/game.json");

   		promireFetch.then((response) => {
		if (!response.ok) {
			throw new Error(`Eroare: ${response.status}`);
		}
			return response.text();
		}).then(function(text) {
			const responseObject = JSON.parse(text);
			console.log(responseObject);
			console.log(dataURL)
		}).catch(function(err) {
			alert(err);
		})
	}
	
    function findxy(res, e) {
		offset_Top = parseInt(window.getComputedStyle(document.getElementById("header")).getPropertyValue("height"));
		offset_Top += parseInt(window.getComputedStyle(document.getElementById("main")).getPropertyValue("height"));
		offset_Top -= parseInt(window.getComputedStyle(GameContainer).getPropertyValue("height"));
		offset_Top += parseInt(window.getComputedStyle(document.getElementById("menubar")).getPropertyValue("height"));

		if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX;
            currY = e.clientY - offset_Top;
    
            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = colorPicker.value;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX;
                currY = e.clientY - offset_Top;
                draw();
            }
        }
    }

}

function imageButtonClicked() {
	const GameContainer = document.getElementById("GameContainer");
	resetContainer(GameContainer)
	GameContainer.innerText = "";
	GameContainer.style.backgroundColor = "white";

	var index = 0;
	const button = document.createElement("button");
	button.innerText = "Next";
	GameContainer.append(button);
	const img = document.createElement("img");
	GameContainer.append(img);


	button.onclick = function () {
		index = (index + 1) % 2;
	
		const promireFetch = fetch("http://localhost:8000/resources/game.json");

   		promireFetch.then((response) => {
		if (!response.ok) {
			throw new Error(`Eroare: ${response.status}`);
		}
			return response.text();
		}).then(function(text) {
			const responseObject = JSON.parse(text);
			img.src = responseObject[index].img;	

		}).catch(function(err) {
			alert(err);
		})	
	}

}

function resetContainer(GameContainer) {
	while (GameContainer.firstChild) {
		GameContainer.removeChild(GameContainer.firstChild);
	}
}

function StartQuiz() {
	const QuestionBox = document.getElementById("QuestionBox");
	const AnswerList = document.getElementById("AnswerList");

	QuestionBox.innerText = "Who wrote Sherlock Holmes?";
	while(AnswerList.firstChild) {
		AnswerList.removeChild(AnswerList.firstChild);
	}

	const buttonList = [];
	
	let button = document.createElement("button");
	button.classList.add("buttonSt");
	button.innerText = "James Moriarty";
	buttonList[0] = button.cloneNode(true);
	button.innerText = "Charles Babbage";
	buttonList[1] = button.cloneNode(true);
	button.innerText = "Arthur Conan Doyle";
	buttonList[2] = button.cloneNode(true);
	button.innerText = "John Watson";
	buttonList[3] = button.cloneNode(true);

	buttonList[2].addEventListener("click", function() {
		let score = localStorage.getItem("Score");
		score = parseInt(score) + 1;
		localStorage.setItem("Score", score);
	})
	for (let i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = SecondQuestion;
		AnswerList.appendChild(buttonList[i]);
	}
}

function SecondQuestion() {
	const QuestionBox = document.getElementById("QuestionBox");
	const AnswerList = document.getElementById("AnswerList");
	const score = document.getElementById("score");
	score.innerText = `Score: ${localStorage.getItem("Score")}`;

	QuestionBox.innerText = "Who is Gilgamesh's partner?";
	while(AnswerList.firstChild) {
		AnswerList.removeChild(AnswerList.firstChild);
	}

	const buttonList = [];

	let button = document.createElement("button");
	button.classList.add("buttonSt");
	button.innerText = "Lanling";
	buttonList[0] = button.cloneNode(true);
	button.innerText = "Enkidu";
	buttonList[1] = button.cloneNode(true);
	button.innerText = "Iskandar";
	buttonList[2] = button.cloneNode(true);
	button.innerText = "Ramesses ii";
	buttonList[3] = button.cloneNode(true);

	buttonList[1].addEventListener("click", function() {
		let score = localStorage.getItem("Score");
		score = parseInt(score) + 1;
		localStorage.setItem("Score", score);
	})
	for (let i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = ThirdQuestion;
		AnswerList.appendChild(buttonList[i]);
	}
}

function ThirdQuestion() {
	const QuestionBox = document.getElementById("QuestionBox");
	const AnswerList = document.getElementById("AnswerList");
	const score = document.getElementById("score");
	score.innerText = `Score: ${localStorage.getItem("Score")}`;

	QuestionBox.innerText = "Which knight reached the Holy Grail?";
	while(AnswerList.firstChild) {
		AnswerList.removeChild(AnswerList.firstChild);
	}

	const buttonList = [];

	let button = document.createElement("button");
	button.classList.add("buttonSt");
	button.innerText = "Galahad";
	buttonList[0] = button.cloneNode(true);
	button.innerText = "Tristan";
	buttonList[1] = button.cloneNode(true);
	button.innerText = "Lancelot";
	buttonList[2] = button.cloneNode(true);
	button.innerText = "Arthur";
	buttonList[3] = button.cloneNode(true);

	buttonList[0].addEventListener("click", function() {
		let score = localStorage.getItem("Score");
		score = parseInt(score) + 1;
		localStorage.setItem("Score", score);
	})
	for (let i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = FourthQuestion;
		AnswerList.appendChild(buttonList[i]);
	}
}

function FourthQuestion() {
	const QuestionBox = document.getElementById("QuestionBox");
	const AnswerList = document.getElementById("AnswerList");
	const score = document.getElementById("score");
	score.innerText = `Score: ${localStorage.getItem("Score")}`;

	QuestionBox.innerText = "Who is Hades's wife?";
	while(AnswerList.firstChild) {
		AnswerList.removeChild(AnswerList.firstChild);
	}

	const buttonList = [];

	let button = document.createElement("button");
	button.classList.add("buttonSt");
	button.innerText = "Persephone";
	buttonList[0] = button.cloneNode(true);
	button.innerText = "Apollo";
	buttonList[1] = button.cloneNode(true);
	button.innerText = "Hera";
	buttonList[2] = button.cloneNode(true);
	button.innerText = "Gaia";
	buttonList[3] = button.cloneNode(true);

	buttonList[0].addEventListener("click", function() {
		let score = localStorage.getItem("Score");
		score = parseInt(score) + 1;
		localStorage.setItem("Score", score);
	})
	for (let i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = FifthQuestion;
		AnswerList.appendChild(buttonList[i]);
	}
}

function FifthQuestion() {
	const QuestionBox = document.getElementById("QuestionBox");
	const AnswerList = document.getElementById("AnswerList");
	const score = document.getElementById("score");
	score.innerText = `Score: ${localStorage.getItem("Score")}`;

	QuestionBox.innerText = "Who is the god of the Sun?";
	while(AnswerList.firstChild) {
		AnswerList.removeChild(AnswerList.firstChild);
	}

	const buttonList = []

	let button = document.createElement("button");
	button.classList.add("buttonSt");
	button.innerText = "Solaris";
	buttonList[0] = button.cloneNode(true);
	button.innerText = "Zeus";
	buttonList[1] = button.cloneNode(true);
	button.innerText = "Ra";
	buttonList[2] = button.cloneNode(true);
	button.innerText = "Anubis";
	buttonList[3] = button.cloneNode(true);

	buttonList[2].addEventListener("click", function() {
		let score = localStorage.getItem("Score");
		score = parseInt(score) + 1;
		localStorage.setItem("Score", score);
	})
	for (let i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = EndQuiz;
		AnswerList.appendChild(buttonList[i]);
	}
}

function EndQuiz() {
	const QuestionBox = document.getElementById("QuestionBox");
	const AnswerList = document.getElementById("AnswerList");
	const score = document.getElementById("score");
	score.innerText = `Score: ${localStorage.getItem("Score")}`;

	QuestionBox.innerText = `THE END Score: ${localStorage.getItem("Score")}`
	while(AnswerList.firstChild) {
		AnswerList.removeChild(AnswerList.firstChild);
	}


	const Score = localStorage.getItem("Score")
	const Highscore = localStorage.getItem("Highscore");

	if (Score > Highscore) {
		localStorage.setItem("Highscore", Score);
	}

	const button = document.createElement("button");
	button.classList.add("buttonSt");
	button.innerText = "Retry";
	button.onclick = quizButtonClicked;
	AnswerList.appendChild(button)
}


