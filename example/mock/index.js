// 引入mock
import Mock from 'mockjs'
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0
            break; 
    } 
} 
let getRandomColor = function(){
    return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function oriGridDataRow(width,height,startx,starty,xcount,ycount){

    // let marginTop = 50;
    // let marginLeft = 50;
    let data = new Array()
    let points =new Array()
    let xpos = startx
    let ypos = starty

    // iterate for rows
    for (let row = 0; row < ycount; row ++){
    data.push(new Array())

    //iterate for cells/columns inside rows
    for (let column = 0; column < xcount; column ++){
        
        data[row].push({
        xindex:row,
        yindex:column,
        x: xpos,
        y: randomNum(ypos-30,ypos+30),
        width: width,
        height: height,
        click: 0,
        attrs:{initHead:{zone:1,values:[1.2,1.0,3],color:getRandomColor()},
               initnormality:{zone:2,values:[1.2,1.0,3],color:getRandomColor()}
              }
        })

        if(row > 0){
        data[row-1][column].height= data[row][column].y -data[row-1][column].y
        }
        

        // increment the x position
        xpos += width
    }

    // reset the x position after a row is complete
    xpos = startx;
    // increment the y position for the next row;
    ypos +=  height;
    }
    //points
    for (let i = 0; i < 100; i ++){
        points.push({
            x: randomNum(startx,startx+xcount*width),
            y: randomNum(starty,starty+ycount*height),
            radius:randomNum(0,width>height?height:width),
            color:getRandomColor(),
            core_color:getRandomColor(),
            attrs:{ z: randomNum(1,100),
                    initHead: {zone:1,values:[1.2,1.0,3],color:getRandomColor()},
                    initnormality: {zone:2,values:[1.2,1.0,3],color:getRandomColor()}
                }
            }) 
    }
    let res={grid:data,startposX:startx,startposY:starty,endposY:starty+ycount*height,endposX:startx+xcount*width,height:height,ycount:ycount,width:width,xcount:xcount,points:points}

    return res;
}
function oriGridData(width,height,startx,starty,xcount,ycount){

    // let marginTop = 50;
    // let marginLeft = 50;
    let data = new Array()
    let points =new Array()
    let xpos = startx
    let ypos = starty

    // iterate for rows
    for (let row = 0; row < ycount; row ++){
    data.push(new Array())

    //iterate for cells/columns inside rows
    for (let column = 0; column < xcount; column ++){
        
        data[row].push({
        xindex:row,
        yindex:column,
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        attrs:{initHead:{zone:1,values:[1.2,1.0,3],color:getRandomColor()},
               initnormality:{zone:2,values:[1.2,1.0,3],color:getRandomColor()}
              }
        });
    
        // increment the x position
        xpos += width
    }

    // reset the x position after a row is complete
    xpos = startx
    // increment the y position for the next row;
    ypos +=  height
    }

    //points
    for (let i = 0; i < 100; i ++){
        points.push({
            x: randomNum(startx,startx+xcount*width),
            y: randomNum(starty,starty+ycount*height),
            radius:randomNum(0,width>height?height:width),
            color:getRandomColor(),
            core_color:getRandomColor(),
            attrs:{ z: randomNum(1,100),
                    initHead: {zone:1,values:[1.2,1.0,3],color:getRandomColor()},
                    initnormality: {zone:2,values:[1.2,1.0,3],color:getRandomColor()}
                  }
            }) 
    }
    let res={grid:data,startposX:startx,startposY:starty,height:height,ycount:ycount,width:width,xcount:xcount,endposY:starty+ycount*height,endposX:startx+xcount*width,points:points}

    return res
}
Mock.mock('/api/getGridDataRow','get',oriGridDataRow(100,100,1234000,100343400,100,30))
Mock.mock('/api/getGridDataColum','get',oriGridDataRow(300,700,50,50,10,100))
Mock.mock('/api/getGridDataLayer','get',oriGridData(100,100,0,0,100,100))
