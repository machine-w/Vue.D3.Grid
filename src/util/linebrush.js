import * as d3 from 'd3'
(function(d3) {
    d3.linebrush = function() {
        var dispatch = d3.dispatch("start", "brush", "end"),
            el = null,
            x = null,
            y = null,
            extent = [],
            firstClick = true,
            firstTime = true,
            wasDragged = false,
            origin = null,
            line = d3.line()
            .x(function(d) {
                return d[0];
            })
            .y(function(d) {
                return d[1];
            });
        var brush = function(g) {
            el = g;
            g.each(function() {
                var bg, e, fg;
                g = d3.select(this)
                    .style("pointer-events", "all")
                    .on("click.brush", addAnchor);
                bg = g.selectAll(".background")
                    .data([0]).enter()
                    .append("rect")
                    .attr("class", "background")
                    .style("visibility", "hidden")
                    .style("cursor", "crosshair");
                fg = g.selectAll(".extent")
                    .data([extent]).enter()
                    .append("path")
                    .attr("class", "extent")
                    .style("cursor", "move")
                    .style("fill","None");
                if (x) {
                    e = scaleExtent(x.range());
                    bg.attr("x", e[0]).attr("width", e[1] - e[0]);
                }
                if (y) {
                    e = scaleExtent(y.range());
                    bg.attr("y", e[0]).attr("height", e[1] - e[0]);
                }
            });
        };
        var drawPath = function() {
            return el.each(function() {
                d3.select(this)
                    .selectAll("g path").attr("d", function(d) {
                        return line(d);
                    });
            });
        };
        var scaleExtent = function(domain) {
            var start, stop;
            start = domain[0];
            stop = domain[domain.length - 1];
            if (start < stop) {
                return [start, stop];
            } else {
                return [stop, start];
            }
        };
        var withinBounds = function(point) {
            var rangeX, rangeY, _x, _y;
            rangeX = scaleExtent(x.range());
            rangeY = scaleExtent(y.range());
            _x = Math.max(rangeX[0], Math.min(rangeX[1], point[0]));
            _y = Math.max(rangeY[0], Math.min(rangeY[1], point[1]));
            return point[0] === _x && point[1] === _y;
        };
        var moveAnchor = function(target) {
            var moved, point;
            point = d3.mouse(target);
            if (firstTime) {
                extent.push(point);
                firstTime = false;
            } else {
                if (withinBounds(point)) {
                    extent.splice(extent.length - 1, 1, point);
                }
                drawPath();
                dispatch.call("brush", this);
            }
        };
        var closePath = function() {
            var w;
            w = d3.select(window);
            w.on("dblclick.brush", null).on("mousemove.brush", null);
            firstClick = true;
            if (extent.length === 2 && extent[0][0] === extent[1][0] && extent[0][1] === extent[1][1]) {
                extent.splice(0, extent.length);
            }
            d3.select(".extent").on("mousedown.brush", moveExtent);
            return dispatch.call("end", this);
        };
        var addAnchor = function() {
            var g, w,
                _this = this;
            g = d3.select(this);
            w = d3.select(window);
            firstTime = true;
            if (wasDragged) {
                wasDragged = false;
                return;
            }
            if (firstClick) {
                extent.splice(0, extent.length);
                firstClick = false;
                d3.select(".extent").on("mousedown.brush", null);
                w.on("mousemove.brush", function() {
                    return moveAnchor(_this);
                }).on("dblclick.brush", closePath);
                dispatch.call("start", this);
            }
            if (extent.length > 1) {
                extent.pop();
            }
            extent.push(d3.mouse(this));
            return drawPath();
        };
        var dragExtent = function(target) {
            var checkBounds, fail, p, point, scaleX, scaleY, updateExtentPoint, _i, _j, _len, _len1;
            point = d3.mouse(target);
            scaleX = point[0] - origin[0];
            scaleY = point[1] - origin[1];
            fail = false;
            origin = point;
            updateExtentPoint = function(p) {
                p[0] += scaleX;
                p[1] += scaleY;
            };
            for (_i = 0, _len = extent.length; _i < _len; _i++) {
                p = extent[_i];
                updateExtentPoint(p);
            }
            checkBounds = function(p) {
                if (!withinBounds(p)) {
                    fail = true;
                }
                return fail;
            };
            for (_j = 0, _len1 = extent.length; _j < _len1; _j++) {
                p = extent[_j];
                checkBounds(p);
            }
            if (fail) {
                return;
            }
            drawPath();
            return dispatch.call("brush", this, {
                mode: "move"
            });
        };
        var dragStop = function() {
            var w;
            w = d3.select(window);
            w.on("mousemove.brush", null).on("mouseup.brush", null);
            wasDragged = true;
            return dispatch.call("end", this);
        };
        var moveExtent = function() {
            var _this = this;
            d3.event.stopPropagation();
            d3.event.preventDefault();
            if (firstClick && !brush.empty()) {
                d3.select(window).on("mousemove.brush", function() {
                    return dragExtent(_this);
                }).on("mouseup.brush", dragStop);
                origin = d3.mouse(this);
            }
        };
        //计算向量叉乘  
        var crossMul=function(v1,v2){  
            return   v1[0]*v2[1]-v1[1]*v2[0];  
        };  
        //判断两条线段是否相交  
        var checkCross=function(p1,p2,p3,p4){
            console.log(p1,p2,p3,p4);
            var v1={x:p1[0]-p3[0],y:p1[1]-p3[1]},  
            v2={x:p2[0]-p3[0],y:p2[1]-p3[1]},  
            v3={x:p4[0]-p3[0],y:p4[1]-p3[1]},  
            v=crossMul(v1,v3)*crossMul(v2,v3)  
            v1={x:p3[0]-p1[0],y:p3[1]-p1[1]}  
            v2={x:p4[0]-p1[0],y:p4[1]-p1[1]}  
            v3={x:p2[0]-p1[0],y:p2[1]-p1[1]} 
            console.log((v<=0&&crossMul(v1,v3)*crossMul(v2,v3)<=0)?true:false );
            return (v<=0&&crossMul(v1,v3)*crossMul(v2,v3)<=0)?true:false 
        };
        var checkCross2 = function(p1,p2,p3,p4)
        {
            var x1=p1[0],y1=p1[1],x2=p2[0],y2=p2[1],x3=p3[0],y3=p3[1],x4=p4[0],y4=p4[1];
            //快速排斥：
            //两个线段为对角线组成的矩形，如果这两个矩形没有重叠的部分，那么两条线段是不可能出现重叠的

            //这里的确如此，这一步是判定两矩形是否相交
            //1.线段ab的低点低于cd的最高点（可能重合）
            //2.cd的最左端小于ab的最右端（可能重合）
            //3.cd的最低点低于ab的最高点（加上条件1，两线段在竖直方向上重合）
            //4.ab的最左端小于cd的最右端（加上条件2，两直线在水平方向上重合）
            //综上4个条件，两条线段组成的矩形是重合的
            //特别要注意一个矩形含于另一个矩形之内的情况

            if(!(Math.min(x1,x2)<=Math.max(x3,x4) && Math.min(y3,y4)<=Math.max(y1,y2)&&Math.min(x3,x4)<=Math.max(x1,x2) && Math.min(y1,y2)<=Math.max(y3,y4)))
                return false;

            //跨立实验：
            //如果两条线段相交，那么必须跨立，就是以一条线段为标准，另一条线段的两端点一定在这条线段的两段
            //也就是说a b两点在线段cd的两端，c d两点在线段ab的两端
            var u,v,w,z
            u=(x3-x1)*(y2-y1)-(x2-x1)*(y3-y1);
            v=(x4-x1)*(y2-y1)-(x2-x1)*(y4-y1);
            w=(x1-x3)*(y4-y3)-(x4-x3)*(y1-y3);
            z=(x2-x3)*(y4-y3)-(x4-x3)*(y2-y3);
            return (u*v<=0.00000001 && w*z<=0.00000001);
        }
        brush.isWithinExtent = function(o,x1,y1,x2,y2) {

            // var len = extent.length;
            // // console.log(x1,y1,x2,y2);
            // if (len > 1) {
            //     var endPoint = extent[len-1];
            //     var startPoint = extent[len-2];
                
            //     var min_x=Math.min(endPoint[0],startPoint[0]),max_x=Math.max(endPoint[0],startPoint[0]);
            //     var min_y=Math.min(endPoint[1],startPoint[1]),max_y=Math.max(endPoint[1],startPoint[1]);

            //     if(min_x>=x1 && max_x<=x2 && min_y>=y1 && max_y<=y2){//线段在矩形里面
            //         o._linebrushflag=true;
            //         return true;
            //     }
            //     else
            //     {
            //         var p1=[x1,y1],p2=[x1,y2],p3=[x2,y2],p4=[x2,y1];
            //         if(checkCross2(endPoint,startPoint,p1,p2)) {o._linebrushflag=true;return true;} 
            //         if(checkCross2(endPoint,startPoint,p2,p3)) {o._linebrushflag=true;return true;} 
            //         if(checkCross2(endPoint,startPoint,p3,p4)) {o._linebrushflag=true;return true;} 
            //         if(checkCross2(endPoint,startPoint,p4,p1)) {o._linebrushflag=true;return true;}
            //         o._linebrushflag=false;
            //     }
            // }
            // return false;

            var i,len, endPoint, startPoint, ret;
            len = extent.length;
            ret = false;
            for (i = 0; i < len; i += 1) {
                
                endPoint = extent[i];
                startPoint = (i===0)?extent[0]:extent[i-1];     
                var min_x=Math.min(endPoint[0],startPoint[0]),max_x=Math.max(endPoint[0],startPoint[0]);
                var min_y=Math.min(endPoint[1],startPoint[1]),max_y=Math.max(endPoint[1],startPoint[1]);
                if(min_x>=x1 && max_x<=x2 && min_y>=y1 && max_y<=y2){//线段在矩形里面
                    o._linebrushflag=true;
                    return true;
                }
                else
                {
                    var p1=[x1,y1],p2=[x1,y2],p3=[x2,y2],p4=[x2,y1];
                    if(checkCross2(endPoint,startPoint,p1,p2)) return true;
                    if(checkCross2(endPoint,startPoint,p2,p3)) return true;
                    if(checkCross2(endPoint,startPoint,p3,p4)) return true;
                    if(checkCross2(endPoint,startPoint,p4,p1)) return true;
                }
            }
            return ret;
        };
        brush.x = function(z) {
            if (!arguments.length) {
                return x;
            }
            x = z;
            return brush;
        };
        brush.y = function(z) {
            if (!arguments.length) {
                return y;
            }
            y = z;
            return brush;
        };
        brush.extent = function(z) {
            if (!arguments.length) {
                return extent;
            }
            extent = z;
            return brush;
        };
        brush.clear = function() {
            extent.splice(0, extent.length);
            return brush;
        };
        brush.empty = function() {
            return extent.length === 0;
        };

        brush.on = function(typename, callback) {
            dispatch.on(typename, callback);
            return brush;
        };

        return brush;
    };
})(d3)