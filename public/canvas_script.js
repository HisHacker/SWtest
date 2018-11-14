// init
$(document).ready(function () {
    hackertoncanvas();
});

// class var
var canvas, ctx, canvasWidth = 980, canvasHeight = 660; // 캔버스

var blockItems = [], blockIcon = [], blockNum = 6, iconInit = false, blockIndex; // 블록

var trashCan = [2], trashChoice = false, trashInit = false; // 휴지통

var box, boxInit = false, boxChoice = false; // 보관함

var mouse; // 마우스

var blockNewIndex;

var blockOverlabIndex;
var blockOverlabState = false;

var blockInum = 0;

var plusbtn;

var createBlockCount = 0;

function hackertoncanvas() {
 
    canvas = document.getElementById('iscanvas');
    
    ctx = canvas.getContext('2d');

    plusbtn = document.getElementById('plusbtn');

    mouse = new Mouse(canvas);

    canvas.addEventListener('mousedown', mouse.mousedown);

    plusbtn.onclick = function() {
        createBlock();
    }

}

function createBlock() {

    var x, y, bt;

    x = 30;

    switch (createBlockCount) {
        case 0 :
            bt = 1;
            y = 30;
            blockItems.push(new Block(x, y, bt, 1, blockInum, 'Eleve parkside', '17:14')); // 가장 마지막에 생성된 객체가 최상위 계층        
            blockInum++;
            createBlockCount++;
            break;

        case 1 :
            bt = 2;
            y = 130;
            blockItems.push(new Block(x, y, bt, 1, blockInum, 'musium', '18:14')); // 가장 마지막에 생성된 객체가 최상위 계층        
            blockInum++;
            createBlockCount++;
            break;

        case 2 :
            bt = 2;
            y = 230;
            blockItems.push(new Block(x, y, bt, 1, blockInum, 'Abc shop', '19:14')); // 가장 마지막에 생성된 객체가 최상위 계층        
            blockInum++;
            createBlockCount++;
            break;

    }
        // 임시 //
        // 차후 블록의 순서, 위치, 속성 등을 정해주는 알고리즘 작성
        
    blockInum++;    

    canvasDraw();

}

// Mouse
function Mouse(canvas) {

    var mlocX = 0, mlocY = 0;

    this.canvas = canvas;

    this.mousedown = function(e) {

        var mouseX = e.layerX, mouseY = e.layerY;

        

        // 하이어라키가 상위에 있는 객체가 mouse event가 적용되기 위해 내림차 반복
        for (var i = blockItems.length-1; i >= 0; i--) { 
        
            blockX = blockItems[i].getX();
            blockY = blockItems[i].getY();

            if (mouseX > blockX && mouseX < blockX + blockItems[i].getWidth() && mouseY > blockY && mouseY < blockY + blockItems[i].getHeight()) {

                blockIndex = i;

                // Box
                if (blockIndex < blockNewIndex) {
                    boxChoice = false;
                    for (var i=blockItems.length; i > blockNewIndex; i--) {
                        blockItems.pop();
                    }
                } else if (boxChoice) {
                    var temp = [];
                    temp = blockItems[blockIndex];
                    for (var i=blockItems.length; i > blockNewIndex; i--) {
                        blockItems.pop();
                    }
                    if (boxChoice) {
                        blockItems.push(temp);
                    }
                    boxChoice = false;
                    
                    blockIndex = blockItems.length-1;
                    blockItems[blockIndex].setBlockNew(1);

                    blockNewIndex = 999;

                }

                var temp = [];
                temp = blockItems[blockIndex];

                for (var i=blockIndex; i < blockItems.length-1; i++) {
                    blockItems.splice(i, 1, blockItems[i+1]);
                }

                blockItems[blockItems.length-1] = temp;                

                blockIndex = blockItems.length-1;

                for (var j = blockX; j < mouseX; j++) {
                    mlocX += 1;
                }

                for (var k = blockY; k < mouseY; k++) {
                    mlocY += 1;
                }

                blockItems[blockIndex].setSelect(true);
                console.log(blockItems[blockIndex].getBlockI());

                canvas.addEventListener('mouseleave', mouse.mousemove);
                canvas.addEventListener('mousemove', mouse.mousemove);
                canvas.addEventListener('mouseup', mouse.mouseup);
                
                canvasDraw();

                return;
                
            }
        }

        if (mouseX > canvasWidth - 110 && mouseY < 110 && boxChoice) {
            boxChoice = false;
            for (var i=blockItems.length; i > blockNewIndex; i--) {
                blockItems.pop();
            }
            canvasDraw();
        } else if (mouseX > canvasWidth - 110 && mouseY < 110) {
            if (!boxChoice) {
                boxChoice = true;
                canvasDraw();
            } 
            
        } else if (mouseX < canvasWidth - 330 || mouseY > 250) {
            boxChoice = false;
            for (var i=blockItems.length; i > blockNewIndex; i--) {
                blockItems.pop();
            }
            canvasDraw();

        }

        

    }

    this.mouseleave = function(e) {

        var mouseX = e.layerX, mouseY = e.layerY;

        if (mouseX < 10 || mouseX > canvasWidth - 10 || mouseY < 10 || mouseY > canvasHeight - 10) {

            canvas.removeEventListener('mouseleave', mouse.mousemove);
            canvas.removeEventListener('mousemove', mouse.mousemove);
            canvas.removeEventListener('mouseup', mouse.mouseup);

            boundaryLine(mouseX, mouseY);

            blockItems[blockIndex].setSelect(false);            

            mlocX = 0; mlocY = 0;
        }

    }

    this.mousemove = function(e) {

        var mouseX = e.layerX, mouseY = e.layerY;
        trashChoice = false;

        blockItems[blockIndex].setX(mouseX - mlocX); // 마우스로 이동시킨 객체의 x좌표
        blockItems[blockIndex].setY(mouseY - mlocY);

        if (mouseX < 10 || mouseX > canvasWidth - 10 || mouseY < 10 || mouseY > canvasHeight - 10) {

            canvas.removeEventListener('mouseleave', mouse.mousemove);
            canvas.removeEventListener('mousemove', mouse.mousemove);
            canvas.removeEventListener('mouseup', mouse.mouseup);

            boundaryLine(mouseX, mouseY);

            blockItems[blockIndex].setSelect(false);

            mlocX = 0; mlocY = 0;

        } else if (mouseX - mlocX + blockItems[blockIndex].getWidth() > canvasWidth - 110 && mouseY - mlocY + blockItems[blockIndex].getHeight() > canvasHeight - 110) {
            trashChoice = true;
            
        } else {

            if (!blockOverlabState) {

                for (var i = blockItems.length-1; i >= 0; i--) {
                
                    if (i == blockIndex) {
                        continue;
                    } else if (((blockItems[blockIndex].getX() + blockItems[blockIndex].getWidth() > blockItems[i].getX() && blockItems[blockIndex].getX() + blockItems[blockIndex].getWidth() < blockItems[i].getX() + blockItems[i].getWidth()) || (blockItems[blockIndex].getX() > blockItems[i].getX() && blockItems[blockIndex].getX() < blockItems[i].getX() + blockItems[i].getWidth())) && ((blockItems[blockIndex].getY() + blockItems[blockIndex].getHeight() > blockItems[i].getY() && blockItems[blockIndex].getY() + blockItems[blockIndex].getHeight() < blockItems[i].getY() + blockItems[i].getHeight()) || (blockItems[blockIndex].getY() > blockItems[i].getY() && blockItems[blockIndex].getY() < blockItems[i].getY() + blockItems[i].getHeight()))) { // 선택당하는 블록의 범위
                        blockOverlabState = true;
                        blockOverlabIndex = i;
                        blockItems[blockOverlabIndex].setOverlabReady(true);
                        console.log(blockOverlabIndex);                    
                        break; // 한 블록만 선택하기 위함
                    }
    
                }

            } else if ((blockItems[blockIndex].getX() + blockItems[blockIndex].getWidth() < blockItems[blockOverlabIndex].getX() || blockItems[blockIndex].getX() > blockItems[blockOverlabIndex].getX() + blockItems[blockOverlabIndex].getWidth() || blockItems[blockIndex].getY() + blockItems[blockIndex].getHeight() < blockItems[blockOverlabIndex].getY() || blockItems[blockIndex].getY() > blockItems[blockOverlabIndex].getY() + blockItems[blockOverlabIndex].getHeight()) && blockOverlabState) {
                blockOverlabState = false;
                blockItems[blockOverlabIndex].setOverlabReady(false);
            }

        }

        if (trashChoice) {
            canvasDraw(1);
        } else {
            canvasDraw();
        }
        
    }

    this.mouseup = function(e) { // 유의할 점 + 객체 연결 시 하이어라키

        var mouseX = e.layerX, mouseY = e.layerY;

        canvas.removeEventListener('mouseleave', mouse.mousemove);
        canvas.removeEventListener('mousemove', mouse.mousemove);
        canvas.removeEventListener('mouseup', mouse.mouseup);

        if (blockOverlabState) {
            blockOverlab();            

        } else {
            boundaryLine(mouseX, mouseY);
        }

        for (var i = 0; i<blockItems.length; i++) {            
            blockItems[i].setOverlabReady(false);
        }
        blockOverlabState = false;       

        blockItems[blockIndex].setSelect(false);

        if (trashChoice) {
            blockItems.pop();
        }

        mlocX = 0; mlocY = 0;
        
        canvasDraw();

    }
    
    function boundaryLine(mouseX, mouseY) {

        if (mouseX - mlocX < 10 && mouseY - mlocY < 10) { // 좌상단
            blockItems[blockIndex].setX(10);
            blockItems[blockIndex].setY(10);
        } else if (mouseX - mlocX < 10 && mouseY - mlocY > canvasHeight - blockItems[blockIndex].getHeight() - 10) { // 좌하단
            blockItems[blockIndex].setX(10);
            blockItems[blockIndex].setY(canvasHeight - blockItems[blockIndex].getHeight() - 10);
        } else if ((mouseX - mlocX) > canvasWidth - blockItems[blockIndex].getWidth() - 10 && mouseY - mlocY < 10) { // 우상단
            blockItems[blockIndex].setX(canvasWidth - blockItems[blockIndex].getWidth() - 10);
            blockItems[blockIndex].setY(10);
        } else if ((mouseX - mlocX) > canvasWidth - blockItems[blockIndex].getWidth() - 10 && mouseY - mlocY > canvasHeight - blockItems[blockIndex].getHeight() - 10) { // 우하단
            blockItems[blockIndex].setX(canvasWidth - blockItems[blockIndex].getWidth() - 10);
            blockItems[blockIndex].setY(canvasHeight - blockItems[blockIndex].getHeight() - 10);

        } else if (mouseX - mlocX < 10) { // 좌
            blockItems[blockIndex].setX(10);
        } else if ((mouseX - mlocX) > canvasWidth - blockItems[blockIndex].getWidth() - 10) { // 우
            blockItems[blockIndex].setX(canvasWidth - blockItems[blockIndex].getWidth() - 10);
        } else if (mouseY - mlocY < 10) { // 상
            blockItems[blockIndex].setY(10);
        } else if (mouseY - mlocY > canvasHeight - blockItems[blockIndex].getHeight() - 10) { // 하
            blockItems[blockIndex].setY(canvasHeight - blockItems[blockIndex].getHeight() - 10);
        } else {
            blockItems[blockIndex].setX(mouseX - mlocX);
            blockItems[blockIndex].setY(mouseY - mlocY);
        }

        

    }

    function blockOverlab() {
        
        var overlabX, overlabY;
        overlabX = blockItems[blockOverlabIndex].getX();
        overlabY = blockItems[blockOverlabIndex].getY();
        blockItems[blockIndex].setX(overlabX);
        blockItems[blockIndex].setY(overlabY + blockItems[blockOverlabIndex].getHeight()*1.3);
        blockItems[blockIndex].setBlockParent(blockItems[blockOverlabIndex].getBlockI()); // 새로 들어온 놈의 부모를 정해준다.
        if (blockItems[blockOverlabIndex].getBlockSon() != 0) { // 아들이 있는 지
            var new1 = blockItems[blockOverlabIndex].getBlockSon();
            
            for (var i=0; i < blockItems.length; i++) {
                var new2;
                new2 = blockItems[i].getBlockI();
                if (new1 == new2) { // 아들 녀석이면
                    blockItems[i].setBlockParent(blockItems[blockIndex].getBlockI()); // 아들의 부모를 새로 들어온 아들의 아들로
                    
                    // 하위의 하위까지 밑으로 가는 함수 호출
                    // 임시로
                    blockItems[i].setY(blockItems[i].getY() + blockItems[i].getHeight());

                    blockItems[blockOverlabIndex].setBlockSon(blockItems[blockIndex].getBlockI());
                    break;

                }
            }
        } else {
            blockItems[blockOverlabIndex].setBlockSon(blockItems[blockIndex].getBlockI());
        }
        
    }

}

// Block
function Block(x, y, blockType, blockNew, blockI, name, time) {

    this.x = x;
    this.y = y;
    this.blockType = blockType;
    this.blockNew = blockNew;
    this.blockI = blockI;
    this.name = name;
    this.time = time;

    this.width = 220;
    this.height = 50;

    this.isSelect = false;
    this.isOverlabReady = false;

    this.blockParent = 0;
    this.blockSon = 0;

    this.getBlockI = function() {
        return this.blockI;
    }

    this.setBlockParent = function(newParent) {
        this.blockParent = newParent;
    }

    this.setBlockSon = function(newSon) {
        this.blockSon = newSon;
    }

    this.getBlockParent = function() {
        return this.blockParent;
    }

    this.getBlockSon = function() {
        return this.blockSon;
    }

    this.setX = function(newX) {
        this.x = newX;
    };

    this.setY = function(newY) {
        this.y = newY;
    };

    this.setBlockNew = function(num) {
        this.blockNew = num;
    }

    this.getX = function() {
        return this.x;
    };

    this.getY= function() {
        return this.y;
    };

    this.getWidth = function() {
        return this.width;
    };

    this.getHeight = function() {
        return this.height;
    };

    this.setSelect = function(bool) {
        this.isSelect = bool;
    };

    this.setOverlabReady = function(bool) {
        this.isOverlabReady = bool;
    };

    // draw
    this.draw = function (ctx) {

        ctx.beginPath();

        ctx.save();

        if (this.blockNew != 0 && boxChoice) {
            ctx.globalAlpha = '0.8';
        }

        this.drawStroke(ctx);
        this.drawBackground(ctx);
        this.drawIcon(ctx);
        this.drawTitle(ctx);
        this.drawTime(ctx);
        
        if (this.getBlockSon() != 0) this.drawMove(ctx);     

        ctx.restore();

        ctx.closePath();
        
    };

    this.drawBackground = function(ctx) {

        switch (this.blockType) {
            case 3 :
                if (this.isSelect) ctx.fillStyle = '#CBE3BB';
                else ctx.fillStyle = '#A9D18E';
                break;

            case 2 :
                if (this.isSelect) ctx.fillStyle = '#A9D18E';
                else ctx.fillStyle = '#33A400';
                break;

            case 1 :
                if (this.isSelect) ctx.fillStyle = '#FFD966';
                else ctx.fillStyle = '#FFAC00';
                break;

            case 4 :
                if (this.isSelect) ctx.fillStyle = '#F8D0B5';
                else ctx.fillStyle = '#F4B183';
                break;

            case 5 :
                if (this.isSelect) ctx.fillStyle = '#B5C0CF';
                else ctx.fillStyle = '#8497B0';
                break;

            case 6 :
                if (this.isSelect) ctx.fillStyle = '#8FAADB';
                else ctx.fillStyle = '#4472C4';
                break;
        }
        /*    
        ctx.shadowBlur = 1;
        ctx.shadowColor = 'black';
        */
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        if (this.isOverlabReady == true) {
            
            ctx.fillStyle = 'gray';
            ctx.fillRect(blockItems[blockOverlabIndex].getX() - 10, blockItems[blockOverlabIndex].getY() + this.height + 5, this.width + 20, 10);
        }

    };

    this.drawIcon = function(ctx) {
        if (!iconInit) {
            iconInit = true;

            for (var i=0; i<6;i++) {
                blockIcon.push(new Image);
                blockIcon[i].src = 'image/icon/icon' + (i+1) + '.png';
            }

            setTimeout(function() {
                for (var i = 0; i < blockItems.length; i++) {
                    blockItems[i].draw(ctx);
                }
            }, 100);

        } else {
            
            switch (this.blockType) {
                case 1 :
                    ctx.drawImage(blockIcon[0], this.x + 2, this.y, 50, 50);
                    break;
                case 2 :
                    ctx.drawImage(blockIcon[1], this.x + 2, this.y, 50, 50);
                    break;
                case 3 :
                    ctx.drawImage(blockIcon[2], this.x + 2, this.y, 50, 50);
                    break;
                case 4 :
                    ctx.drawImage(blockIcon[3], this.x + 2, this.y + 2, 26, 26);
                    break;
                case 5 :
                    ctx.drawImage(blockIcon[4], this.x + 2, this.y + 2, 26, 26);
                    break;
                case 6 :
                    ctx.drawImage(blockIcon[5], this.x + 2, this.y + 2, 26, 26);
                    break;
            }
        }

    };

    this.drawTitle = function(ctx) {
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.font = '20px NanumSquareR';
        ctx.textAlign = 'right';
        
        ctx.fillText(this.name, this.x + this.width - 20, this.y + 22);

        ctx.restore();
    };

    this.drawTime = function(ctx) {
        ctx.save();

        ctx.fillStyle = 'white';
        ctx.font = '20px NanumSquareR';
        ctx.textAlign = 'right';
        ctx.fillText(this.time, this.x + this.width - 20, this.y + 44);

        ctx.restore();
    };

    this.drawStroke = function(ctx) {
        ctx.save();
        ctx.shadowBlur = 1;
        ctx.shadowColor = 'black';
        ctx.lineJoin = "round";
        ctx.lineWidth = "20";
        ctx.strokeStyle = "white";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.restore();

        ctx.lineJoin = "round";
        ctx.lineWidth = "20";
        if (this.blockType == 1) {
            ctx.strokeStyle = "#FFAC00";
        } else ctx.strokeStyle = "#33A400";
        
        ctx.strokeRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
    }

    this.drawMove = function(ctx) {
        ctx.save();
        ctx.beginPath();        
        ctx.moveTo(this.x + this.width + 40, this.y + this.height - 15);
        ctx.lineTo(this.x + this.width + 10, this.y + this.height + 5);
        ctx.lineTo(this.x + this.width + 40, this. y + this.height + 30);
        ctx.closePath();

        ctx.shadowBlur = 1;
        ctx.shadowColor = 'black';

        ctx.fillStyle = '#FFFFFF';

        ctx.fill();

        ctx.fillRect(this.x + this.width + 20, this.y + this.height - 25, 135, 65);

        ctx.fillStyle = '#0511F5';

        ctx.fillRect(this.x + this.width + 25, this.y + this.height - 20, 125, 57);

        ctx.drawImage(blockIcon[5], this.x + this.width + 32, this.y + this.height - 19, 55, 55);

        ctx.fillStyle = 'white';
        ctx.font = '25px NanumSquareR';
        ctx.textAlign = 'left';

        if (this.blockType == 1) {
            ctx.fillText('20M', this.x + this.width + 90, this.y + this.height + 18);
            
        } else ctx.fillText('10M', this.x + this.width + 90, this.y + this.height + 18);
        
        ctx.restore();

    }
    
}

function Box(openclose) {

    this.openclose = openclose;
    
    if (!boxInit) {
        boxInit = true;

        box = new Image();
        box.src = 'image/box.png';

        setTimeout(function() {
            ctx.drawImage(box, canvasWidth - 110, 10, 100, 100);
        }, 100);
    } else {        

        if (boxChoice) {
            ctx.save();

            ctx.beginPath();
            ctx.globalAlpha = '0.8';
            ctx.fillStyle = '#FFFFFF';
            
            ctx.lineWidth = "2";
            ctx.strokeStyle = "gray";

            ctx.fillRect(canvasWidth - 330, 10, 320, 250);
            ctx.rect(canvasWidth - 330, 10, 320, 250);
            ctx.stroke();

            ctx.restore();

            blockNewIndex = blockItems.length;

            for (var i = 0; i < 6; i++) {

                var x, y, bt;
        
                x = canvasWidth - 320;
                y = 20 + i*40;
        
                switch (i) {
                    case 0 : 
                        bt = i+1;
                        break;
        
                    case 1 : 
                        bt = i+1;
                        break;
        
                    case 2 : 
                        bt = i+1;
                        break;
        
                    case 3 : 
                        bt = i+1;
                        break;
        
                    case 4 : 
                        bt = i+1;
                        break;
        
                    case 5 : 
                        bt = i+1;
                        break;
        
                    default : bt = 1;
                }
        
                blockItems.push(new Block(x, y, bt, 0, blockInum));
                blockInum++;
            }

            for (var i = blockNewIndex; i < blockItems.length; i++) {
                blockItems[i].draw(ctx);
            }

        } else {
            ctx.drawImage(box, canvasWidth - 110, 10, 100, 100);
        }

    }    

}

function Trash(openclose) {

    this.openclose = openclose;

    if (!trashInit) {
        trashInit = true;

        for (var i = 0; i < 2; i++) {
            trashCan[i] = new Image();
            trashCan[i].src = 'image/trash/trash' + (i+1) + '.png';
        }

        setTimeout(function() {
            ctx.drawImage(trashCan[0], canvasWidth - 110, canvasHeight - 110, 100, 100);
        }, 100);

    } else {
        ctx.drawImage(trashCan[openclose], canvasWidth - 110, canvasHeight - 110, 100, 100);
    }

}

function canvasDraw() {
    
    clear();

    if (arguments.length == 1) {
        Trash(arguments[0]);
    } else {
        Trash(0);
    }    

    for (var i = 0; i < blockItems.length; i++) {
        blockItems[i].draw(ctx);
    }

    Box();

}

function clear() {
    ctx.save();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    ctx.restore();

}