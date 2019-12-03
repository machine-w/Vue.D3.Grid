// 引入mock
import Mock from 'mockjs'
// 引入mock数据
import orders from './orders'


function randomNum(minNum,maxNum){ 
switch(arguments.length){ 
    case 1: 
        return parseInt(Math.random()*minNum+1,10); 
    break; 
    case 2: 
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
    break; 
        default: 
            return 0; 
        break; 
} 
} 

function oriGridDataRow(width,height){

    let marginTop = 50;
    let marginLeft = 50;
    var data = new Array();
    let xpos = marginLeft;
    let ypos = marginTop;

    // iterate for rows
    for (var row = 0; row < 3; row ++){
    data.push(new Array());

    //iterate for cells/columns inside rows
    for (var column = 0; column < 100; column ++){
        
        data[row].push({
        xindex:row,
        yindex:column,
        x: xpos,
        y: randomNum(ypos-50,ypos+50),
        width: width,
        height: height,
        click: 0,
        attrs:{initHead:{zone:1,values:[1.2,1.0,3]}}
        });

        if(row > 0){
        data[row-1][column].height= data[row][column].y -data[row-1][column].y;
        }
        

        // increment the x position
        xpos += width;
    }

    // reset the x position after a row is complete
    xpos = marginLeft;
    // increment the y position for the next row;
    ypos +=  height;
    }

    return data;
}
function oriGridData(width,height){

    let marginTop = 50;
    let marginLeft = 50;
    var data = new Array();
    let xpos = marginLeft;
    let ypos = marginTop;

    // iterate for rows
    for (var row = 0; row < 100; row ++){
    data.push(new Array());

    //iterate for cells/columns inside rows
    for (var column = 0; column < 100; column ++){
        
        data[row].push({
        xindex:row,
        yindex:column,
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        click: 0,
        attrs:{initHead:{zone:1,values:[1.2,1.0,3]}}
        });
        

        // increment the x position
        xpos += width;
    }

    // reset the x position after a row is complete
    xpos = marginLeft;
    // increment the y position for the next row;
    ypos +=  height;
    }

    return data;
}


Mock.mock('/api/getGridDataRow','get',{grid:oriGridData(10,10)});
Mock.mock('/api/getGridDataColum','get',{grid:oriGridDataRow(30,70)});
Mock.mock('/api/getGridDataLayer','get',{grid:oriGridData(30,30)});
