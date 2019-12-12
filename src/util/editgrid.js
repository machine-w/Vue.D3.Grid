export function rowSplit(griddata, rowindex) {
    griddata[rowindex].forEach(function (colum1) {
        colum1.height /= 2
        colum1.v_height /= 2
    })
    // console.log(griddata[rowindex])

    let rowdata2 = JSON.parse(JSON.stringify(griddata[rowindex]));
    rowdata2.forEach(function (colum2) {
      colum2.y += colum2.height;
      colum2.v_y += colum2.v_height;
      colum2.xindex += 1;
    })

    for (let index = rowindex+1; index < griddata.length; index++) {
        griddata[index].forEach(function (colum) {
            colum.xindex += 1
        })
    }

    griddata.splice(rowindex+1, 0, rowdata2);
    return griddata;
}

export function columnSplit(griddata, columindex) {
    griddata.forEach(function (row) {
        row[columindex].width /= 2
        row[columindex].v_width /= 2
        let newcolum = {...row[columindex]}
        newcolum.x += newcolum.width
        newcolum.v_x += newcolum.v_width
        newcolum.yindex += 1
        for (let index = columindex+1; index < row.length; index++) {
            row[index].yindex += 1
        }
        row.splice(columindex+1,0,newcolum);
    });
    return griddata;
}

export function rowJoin(griddata, rowindex) {
    if(rowindex < griddata.length - 1){
        griddata[rowindex].forEach(function (column, i) {
          column.height += griddata[rowindex + 1][i].height
        });

        for (let index = rowindex + 2; index < griddata.length; index++) {
            griddata[index].forEach(function (column) {
              column.xindex -= 1
            });

        }
        griddata.splice(rowindex + 1, 1);

    }
    return griddata;
}
export function columnJoin(griddata, columindex) {
    griddata.forEach(function (row, i) {
        if(columindex < row.length - 1){
            row[columindex].width += row[columindex + 1].width

            for (let index = columindex + 2; index < row.length; index++) {
                row[index].yindex -= 1
            }
            row.splice(columindex + 1,1);
        }
        else{
            return;
        }
    });
    return griddata;
}

export function clickOneCell(griddata, xindex, yindex, color) {
  if (griddata[xindex][yindex].fill){
    griddata[xindex][yindex].fill = null
  } else {
    griddata[xindex][yindex].fill = color
  }
  return griddata;
}