var board = new Array();
var score = 0;
var hasConflicted = new Array();
$(function () {

	newgame()
})

function newgame () {
	//初始化
	init();

	//将分数清零
	$('#score').text(0);
	score = 0;
	//随机2个数字
	oneNumber();
	oneNumber();

}

function init () {
	$('.gameover').css('display', 'none');
	//将初始的块排列
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var Cell = $('#cell-' + i + j);
			Cell.css('top', getPosTop(i, j));
			Cell.css('left', getPosLeft(i, j));
		}
	}
	//将board转为二维数组
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0; j < 4; j++) {
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}
	//将board[i][j]显示
	updateBoardView();

}

function updateBoardView () {
	$('.number-cell').remove();
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			$('#cell-container').append('<div class="number-cell" id="number-cell-' + i + j + '"></div>');
			var theNumberCell = $('#number-cell-' + i + j);
			if (board[i][j] == 0) {
				theNumberCell.css('width', 0);
				theNumberCell.css('height', 0);
				theNumberCell.css('top', getInitPosTop(i, j));
				theNumberCell.css('left', getInitPosLeft(i, j));
			} else {
				theNumberCell.css('width', '1rem');
				theNumberCell.css('height', '1rem');
				theNumberCell.css('top', getPosTop(i, j));
				theNumberCell.css('left', getPosLeft(i, j));
				theNumberCell.css('background-color', getBg(board[i][j]));
				theNumberCell.css('color', getColor(board[i][j]));
				theNumberCell.text(getText(board[i][j]));
			}
			hasConflicted[i][j] = false;
		}
	}

}

function oneNumber () {
	if (noSpace(board)) {
		return false;
	}
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));

	while (true) {
		if (board[randx][randy] == 0) {
			break;
		}
		randx = parseInt(Math.floor(Math.random() * 4));
		randy = parseInt(Math.floor(Math.random() * 4));
	}

	var randNumber = Math.random() < 0.5 ? 2 : 4;
	board[randx][randy] = randNumber;

	showNumber(randx, randy, randNumber);
}

$(document).keydown(function (event) {
	switch (event.keyCode) {
		case 37: //left
			if (moveLeft()) {
				setTimeout('oneNumber()', 210);
				setTimeout('isgameover()', 400);
			}
			break;
		case 38: //up
			if (moveUp()) {
				setTimeout('oneNumber()', 210);
				setTimeout('isgameover()', 400);
			}
			break;
		case 39: //right
			if (moveRight()) {
				setTimeout('oneNumber()', 210);
				setTimeout('isgameover()', 400);
			}
			break;
		case 40: //down
			if (moveDown()) {
				setTimeout('oneNumber()', 210);
				setTimeout('isgameover()', 400);
			}
			break;
		default:
			break;
	}
})

$("#cell-container").on('swipeUp', function () {
	if (moveUp()) {
		setTimeout('oneNumber()', 210);
		setTimeout('isgameover()', 400);
	}
});
$("#cell-container").on('swipeDown', function () {
	if (moveDown()) {
		setTimeout('oneNumber()', 210);
		setTimeout('isgameover()', 400);
	}
});
$("#cell-container").on('swipeLeft', function () {
	if (moveLeft()) {
		setTimeout('oneNumber()', 210);
		setTimeout('isgameover()', 400);
	}
});
$("#cell-container").on('swipeRight', function () {
	if (moveRight()) {
		setTimeout('oneNumber()', 210);
		setTimeout('isgameover()', 400);
	}
});

function isgameover () {
	if (noSpace(board) && noMove(board)) {
		gameover();
	}
}

function gameover () {
	$('.gameover').css('display', 'block');
}

function moveLeft () {
	if (!canMoveLeft(board)) {
		return false;
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 1; j < 4; j++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < j; k++) {
					if (board[i][k] == 0 && noBlockRow(i, k, j, board)) {
						//移动
						showMove(i, j, i, k);

						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockRow(i, k, j, board) && !hasConflicted[i][k]) {
						//移动
						showMove(i, j, i, k);
						//添加
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//得分
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}

function moveRight () {
	if (!canMoveRight(board)) {
		return false;
	}

	for (var i = 0; i < 4; i++) {
		for (var j = 2; j >= 0; j--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > j; k--) {
					if (board[i][k] == 0 && noBlockRow(i, j, k, board)) {
						//移动
						showMove(i, j, i, k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[i][k] == board[i][j] && noBlockRow(i, j, k, board) && !hasConflicted[i][k]) {
						//移动
						showMove(i, j, i, k);
						//添加
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//得分
						score += board[i][k];
						updateScore(score);

						hasConflicted[i][k] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}

function moveUp () {
	if (!canMoveUp(board)) {
		return false;
	}

	for (var j = 0; j < 4; j++) {
		for (var i = 1; i < 4; i++) {
			if (board[i][j] != 0) {
				for (var k = 0; k < i; k++) {
					if (board[k][j] == 0 && noBlockCol(j, k, i, board)) {
						//移动
						showMove(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockCol(j, k, i, board) && !hasConflicted[k][j]) {
						//移动
						showMove(i, j, k, j);
						//添加
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//得分
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}

function moveDown () {
	if (!canMoveDown(board)) {
		return false;
	}

	for (var j = 0; j < 4; j++) {
		for (var i = 2; i >= 0; i--) {
			if (board[i][j] != 0) {
				for (var k = 3; k > i; k--) {
					if (board[k][j] == 0 && noBlockCol(j, i, k, board)) {
						//移动
						showMove(i, j, k, j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					} else if (board[k][j] == board[i][j] && noBlockCol(j, i, k, board) && !hasConflicted[k][j]) {
						//移动
						showMove(i, j, k, j);
						//添加
						board[k][j] += board[i][j];
						board[i][j] = 0;
						//得分
						score += board[k][j];
						updateScore(score);

						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()', 200);
	return true;
}
$(document).on('touchmove', function (e) {
	e.preventDefault();
})
document.body.addEventListener('touchmove',bodyScroll,false);  
$('body').css({'position':'fixed',"width":"100%"});
