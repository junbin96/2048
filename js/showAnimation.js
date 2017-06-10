function showNumber(i, j, number) {
	var theNumber = $('#number-cell-' + i + j);
	theNumber.css('background-color', getBg(number));
	theNumber.css('color', getColor(number));
	theNumber.text(getText(number));

	theNumber.animate({
		width: '100px',
		height: '100px',
		top: getPosTop(i, j),
		left: getPosLeft(i, j)
	}, 50)
}

function showMove(fx, fy, tx, ty) {
	var theNumber = $('#number-cell-' + fx + fy);

	theNumber.animate({
		top: getPosTop(tx, ty),
		left: getPosLeft(tx, ty)
	}, 200)
}

function updateScore(score) {
	$('#score').text(score);
}