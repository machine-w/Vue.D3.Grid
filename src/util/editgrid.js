export default {
    rowSplit(griddata, rowindex) {
        griddata[rowindex].forEach(function (colum1) {
            colum1.height /= 2
        });
    
        let rowdata2 = JSON.parse(JSON.stringify(griddata[rowindex]));
        rowdata2.forEach(function (colum2) {
          colum2.y += colum2.height;
          colum2.xindex += 1;
        });
    
        for (let index = rowindex+1; index < griddata.length; index++) {
            griddata[index].forEach(function (colum) {
                colum.xindex += 1
            });
        }
    
        griddata.splice(rowindex+1, 0, rowdata2);
        return griddata;
    },
    columnSplit(griddata, columindex) {
        griddata.forEach(function (row) {
            row[columindex].width /= 2
            let newcolum = {...row[columindex]}
            newcolum.x += newcolum.width
            newcolum.yindex += 1
            for (let index = columindex+1; index < row.length; index++) {
                row[index].yindex += 1
            }
            row.splice(columindex+1,0,newcolum);
        });
        return griddata;
    },
    columnSplit(griddata, columindex) {
        griddata.forEach(function (row) {
            row[columindex].width /= 2
            let newcolum = {...row[columindex]}
            newcolum.x += newcolum.width
            newcolum.yindex += 1
            for (let index = columindex+1; index < row.length; index++) {
                row[index].yindex += 1
            }
            row.splice(columindex+1,0,newcolum);
        });
        return griddata;
    },
    columnJoin(griddata, columindex) {
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
    },
    clickOneCell(griddata, xindex, yindex, color) {
        if (griddata[xindex][yindex].fill){
          griddata[xindex][yindex].fill = null
        } else {
          griddata[xindex][yindex].fill = color
        }
        return griddata;
    }

}