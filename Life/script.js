var canvas = new fabric.Canvas('canvas');
var size = 40;
var height = canvas.height / size;
var width = canvas.width / size;

var matrix = new Array(height);
for (let _ = 0; _ < height; _++)
    matrix[_] = new Array(width);

for (let i = 0; i < height; i++){
    for (let j = 0; j < width; j++){
        let rect = new fabric.Rect({ 
            left: i * size,
            top: j * size,
            backgroundColor: 'black',
            fill: 'white',
            width: size,
            height: size,
            selectable: false
        })
        canvas.add(rect);
        matrix[i][j] = rect;
    }
}

function GetNumberOfNeihbours(x, y){
    let counter = 0;
    for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
            if (!(i == 0 && j == 0) && matrix[(i + y + height) % height][(j + x + width) % width].fill == 'green')
                counter++;
        }
    }
    return counter;
}

function NextStep(){
    let pattern = new Array(height);;
    for (let _ = 0; _ < height; _++)
        pattern[_] = new Array(width);

    for (let i = 0; i < height; i++){
        for (let j = 0; j < width; j++){
            let counterNeighbours = GetNumberOfNeihbours(j, i);
            if (matrix[i][j].fill == 'white' && counterNeighbours == 3){
                pattern[i][j] = 1;
            } else if (matrix[i][j].fill == 'green' && (counterNeighbours == 2 || counterNeighbours == 3)){
                pattern[i][j] = 1;
            } else {
                pattern[i][j] = 0;
            }
        }
    }

    for (let i = 0; i < height; i++){
        for (let j = 0; j < width; j++){
            if (pattern[i][j] == 0){
                matrix[i][j].set('fill', 'white');
            } else {
                matrix[i][j].set('fill', 'green');
            }
        }
    }
}

function Clear(){
    for (let i = 0; i < height; i++){
        for (let j = 0; j < width; j++){
            window.matrix[i][j].set('fill', 'white');
        }
    }
}

function SimpleClicker(elem){
    elem.style.background = elem.style.background == "red" && document.getElementById("1").style.background != "green" ? "green" : "red";  
    if (elem.style.background == "green")
        canvas.on('mouse:down', function(options) {NextStep();});
    else
    {
        document.getElementById("1").style.background = "red";
        canvas.off();
    }
}

function Edit(elem){
    elem.style.background = elem.style.background == "red" ? "green" : "red";
    canvas.on('mouse:down', function(options) {
        if (options.target)
            options.target.set('fill', options.target.fill == 'green' ? 'white' : 'green'); 
    });
}