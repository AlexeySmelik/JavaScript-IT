let fs = require('fs');
let arg = process.argv;
const numSymbols = 255;

if (arg.length != 5){
	console.log('Not enought arguments...');
	return;
}

let code = (inText) => {
	let i = 0, n = 1, outText = '';
	while (i < inText.length){
		while (inText.charAt(i) == inText.charAt(i + n))
			n++;
		let nJump = n;
	
		while (n >= numSymbols){
			outText += '#' + String.fromCharCode(numSymbols) + inText.charAt(i);
			n -= numSymbols;
		}
	
		if ((n > 3) || (inText.charAt(i) == '#')){
			outText += '#' + String.fromCharCode(n) + inText.charAt(i);
		} else {
			for (let k = 0; k < n; k++)
				outText += inText.charAt(i);
		}
	
		i += nJump;
		n = 1;
	}
	return outText;
};

let decode = (inText) => {
	let alph = '';
	for (let i = 0; i <= numSymbols; i++)
		alph += String.fromCharCode(i);
	
	let i = 0, outText = '';
	while (i < inText.length){
		if (inText[i] == '#'){
			for (let k = 0; k < alph.indexOf(inText[i + 1]); k++)
				outText += inText[i + 2];
			i += 2;
		} else 
			outText += inText[i];
		i++;
	}
	
	return outText;
};

fs.readFile(arg[3], (err, data) => {
	if (err){
		console.error(err);
		return;
	}
	
	let inText = data.toString('utf-8');
	if (inText == ''){
		console.log(`"${arg[3]}" is empty...`);
		return;
	}
	let outText;

	if (arg[2] == 'code')
		outText = code(inText);
	else if (arg[2] == 'decode')
		outText = decode(inText);
	else
		console.log('Undefined function');

	fs.writeFile(arg[4], outText, (err) => {
		if (err){
			console.err(err);
			return;
		}
		console.log('The file has been saved!');
	});
});
