//массив для хранения дерева, элементы дерева - объекты
function Node(letter, freq, used, parent, code){
	this.letter = letter;
	this.freq = freq;
	this.used = used;
	this.parent = parent;
	this.code = code;
}

let fs = require ('fs');
let str = fs.readFileSync('input.txt').toString();
let alph = new Array();
let tree = new Array();

for(let i = 0; i < str.length; i++)
    alph [str.charAt(i)] = 0;
for(let i = 0; i < str.length; i++) 
    alph [str.charAt(i)]++;
for(i in alph){
	let newNode = new Node(i, alph[i], 0, null, '');
	tree.push(newNode);
}

let treeLength = tree.length;
	
for (let i = 0; i < treeLength - 1; i++){
	let minInd1 = -1;
	let minInd2 = -1;
	let minFreq1 = str.length;
	let minFreq2 = str.length;
	for(let j = 0; j < tree.length; j++){
		//поиск минимальных неиспльзованных элементов
		if((tree[j].used == 0) && (tree[j].freq <= minFreq1)){
			minInd2 = minInd1;
			minInd1 = j;
			minFreq2 = minFreq1;
			minFreq1 = tree[j].freq;
		}
		else if ((tree[j].used == 0) && (tree[j].freq <= minFreq2)){
			minInd2 = j;
			minFreq2 = tree[j].freq;
		}
		
	}
	tree.push(new Node(tree[minInd2].letter + tree[minInd1].letter, minFreq1 + minFreq2, false, null, ''));
	tree[minInd1].used = true;
	tree[minInd2].used = true;
	tree[minInd1].parent = tree.length - 1;
	tree[minInd2].parent = tree.length - 1;
	tree[minInd1].code = '0';
	tree[minInd2].code = '1';
}

for (let i = 0; i < treeLength; i++){
	let par = tree[tree[i].parent];
	while (par.parent != null){
		tree[i].code = par.code + tree[i].code;
		par = tree[par.parent];	
	}
}

for (let i = 0; i < treeLength; i++) 
    console.log(`${tree[i].letter}: ${tree[i].code}`);

let codeString = "";
for (let i = 0; i < str.length; i++){
    for (let j = 0; j < treeLength; j++){
        if (str[i] == tree[j].letter){
            codeString += tree[j].code;
            break;
        }
    }
}
console.log(codeString);

let decodeString = "";
let buf = "";
for (let i = 0; i < codeString.length; i++){
    buf += codeString[i];
    for (let j = 0; j < treeLength; j++){
        if (buf == tree[j].code){
            decodeString += tree[j].letter;
            buf = "";
            break;
        }
    }
}
console.log(`${decodeString == str ? 'good' : 'bad'} - ${decodeString}`);