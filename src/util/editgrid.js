export function rowSplit(griddata, rowindex,spliteRate=0.5) {
    if (rowindex>= griddata.length || rowindex< 0){
        return griddata
    }
    if(spliteRate>=1 || spliteRate <=0){
        return griddata
    }
    griddata[rowindex].forEach(function (colum1) {
        colum1.height *= spliteRate
        colum1.v_height *= spliteRate
    })
    // console.log(griddata[rowindex])

    let rowdata2 = JSON.parse(JSON.stringify(griddata[rowindex]));
    rowdata2.forEach(function (colum2) {
      colum2.y += colum2.height
      colum2.v_y += colum2.v_height
      colum2.height *= ((1-spliteRate) /spliteRate)
      colum2.v_height *= ((1-spliteRate) /spliteRate)
      colum2.xindex += 1;
    })

    for (let index = rowindex+1; index < griddata.length; index++) {
        griddata[index].forEach(function (colum) {
            colum.xindex += 1
        })
    }

    griddata.splice(rowindex+1, 0, rowdata2);
    return griddata
}

export function columnSplit(griddata, columindex,spliteRate=0.5) {
    if(spliteRate>=1 || spliteRate <=0){
        return griddata
    }
    griddata.forEach(function (row) {
        if (columindex >= row.length || columindex< 0){
            return griddata
        }
        row[columindex].width *= spliteRate
        row[columindex].v_width *= spliteRate
        let newcolum = {...row[columindex]}
        newcolum.x += row[columindex].width
        newcolum.v_x += row[columindex].v_width
        newcolum.width *=((1-spliteRate) /spliteRate)
        newcolum.v_width *=((1-spliteRate) /spliteRate)
        
        newcolum.yindex += 1
        for (let index = columindex+1; index < row.length; index++) {
            row[index].yindex += 1
        }
        row.splice(columindex+1,0,newcolum);
    });
    return griddata;
}

export function rowJoin(griddata, rowindex,useSecondValue=false) {
    if(rowindex < griddata.length - 1 && rowindex >=0){
        griddata[rowindex].forEach(function (column, i) {
          column.height += griddata[rowindex + 1][i].height
          column.v_height += griddata[rowindex + 1][i].v_height
          if(useSecondValue){
            column.attrs = {...griddata[rowindex + 1][i].attrs}
            column.invalid=griddata[rowindex + 1][i].invalid
          }
          
        })

        for (let index = rowindex + 2; index < griddata.length; index++) {
            griddata[index].forEach(function (column) {
              column.xindex -= 1
            });

        }
        griddata.splice(rowindex + 1, 1);

    }
    return griddata;
}
export function columnJoin(griddata, columindex,useSecondValue=false) {
    griddata.forEach(function (row, i) {
        if(columindex < row.length - 1 && columindex >=0){
            row[columindex].width += row[columindex + 1].width
            row[columindex].v_width += row[columindex + 1].v_width
            if(useSecondValue){
                row[columindex].attrs = {...row[columindex + 1].attrs}
                row[columindex].invalid = row[columindex + 1].invalid
            }
            
            for (let index = columindex + 2; index < row.length; index++) {
                row[index].yindex -= 1
            }
            row.splice(columindex + 1,1);
        }
        else{
            return griddata;
        }
    });
    return griddata;
}

// export function clickOneCell(griddata, xindex, yindex, color) {
//   if (griddata[xindex][yindex].fill){
//     griddata[xindex][yindex].fill = null
//   } else {
//     griddata[xindex][yindex].fill = color
//   }
//   return griddata;
// }