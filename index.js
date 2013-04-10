function $(id){
    return document.getElementById(id);
}
//alert(Math.random())
var num = Math.round(Math.random())
$("num").innerHTML = num;

var data = [];
var isMouseDown = false;
var pos = {
    x: 0,
    y: 0
}
var next_pos = {
    x: 0,
    y: 0
}
var canvas = $("draw").getContext('2d');
var DEFAULT_BRUSH_COLOR = "#0000ff";
var DEFAULT_BRUSH_SIZE = 25;
var number = -1;

$("draw").addEventListener('mousemove', mouseMove, false);
$("draw").addEventListener('mousedown', mouseDown, false);
$("draw").addEventListener('mouseup', mouseUp, false);
$("stop").addEventListener('click', train, false);
$("text").addEventListener('click', text, false);


setInterval(loop, 1000 / 60);
function mouseDown(e) {
    isMouseDown = true;
}
function loop() {
    if (isMouseDown) draw(canvas);//绘制鼠标点击位置
    pos.x = next_pos.x;
    pos.y = next_pos.y;
}
function mouseUp(e) {
    isMouseDown = false;
    binary($("draw"), num);
}
function mouseMove(e) {
    next_pos.x=e.clientX-700;//设置x坐标
    next_pos.y=e.clientY-100;//设置y坐标
   /* $("pos_display").innerHTML='你当前点击鼠标的位置为('+next_pos.x+','+next_pos.y+')';//更新当前鼠标点击的位置
    $("pos_display").innerHTML+='你next鼠标的位置为('+pos.x+','+pos.y+')';*/
}
function draw(ctx) {

    ctx.save();//保存当前绘图状态
    //ctx.fillStyle = DEFAULT_BRUSH_COLOR;//设置填充的背景颜色
    ctx.lineWidth =DEFAULT_BRUSH_SIZE;  //设置画笔的大小
    ctx.lineCap = "round"; //设置线条，让线条边缘更圆滑
    ctx.beginPath();
    //ctx.arc(pos.x,pos.y,DEFAULT_BRUSH_SIZE,0,Math.PI * 2,true);
    /****
    *context.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    *参数 x,y表示圆心
    *radius半径
    *startAngle起始弧度
    *endAngle终止弧度
    *anticlockwise是否为逆时针方向
    ***/
    //ctx.fill();//填充绘画路径
    //
    if( pos.x == next_pos.x && pos.y == next_pos.y ){
        ctx.arc(pos.x,pos.y,DEFAULT_BRUSH_SIZE/2,0,Math.PI * 2,true);
        ctx.fill();//填充绘画路径
    }
    else{
        ctx.moveTo(pos.x,pos.y);
        ctx.lineTo(next_pos.x,next_pos.y);
        ctx.stroke();
    }
    ctx.restore();//恢复绘画状态

}

function binary(canvas,number) {
    var datum = {
    input: [],
    output: [0,0]/*{
        number0: 0,
        number1: 0,
        number2: 0,
        number3: 0,
        number4: 0,
        number5: 0,
        number6: 0,
        number7: 0,
        number8: 0,
        number9: 0,
    }*/
}
    if(!canvas.data){
        var ctx = canvas.getContext('2d');
        var imagedata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    var greys = new Array(64);
    for (var y = 0,j=0, leny = imagedata.height; y < leny; y+=20) {

        for (var x = 0, lenx= imagedata.width; x < lenx; x+=20) {
            var i = x*4 + y*4*lenx;
            greys[j++] = imagedata.data[i+3] == 0 ? 0 : 1;
        }; 
        
    };
    datum.input = greys;
    if(arguments[1]){
       datum.output[number]=1; 
    }
    data.push(datum);
    //初始化canvas数据
    ctx.clearRect(0,0,imagedata.width,imagedata.height);
    num = Math.round(Math.random());
    $("num").innerHTML = num;
    if(data.length > 1){
        $("stop").value = "多画几次我会更聪明";
    }
    if(data.length > 5){
       $("stop").value = "看看我学得怎么样"; 
    }

}
var net = new brain.NeuralNetwork();
function train(){

    $("Texting").style.display = "block";
    net.train(data);
    var canvas = $("Text").getContext('2d');
    canvas.fillRect(20,20,18,130);
}

function text(){
    binary($("Text"));
    var output = net.run(data[0].input);
    var s = "";
    for (var property in output) {  
       s = s + "\n "+property +": " + output[property] ;  
    } 
    console.log(s);
    alert("数字为1的概率为"+output[1]+"\n数字为0的概率为"+output[0]);
}


