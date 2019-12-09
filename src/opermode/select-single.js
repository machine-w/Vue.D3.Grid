import { OverColor } from ".";

export default {
    MouseOver (target,d, i,v) {
        target.transition().style("fill",OverColor);
    },
    MouseOut (target,d, i,v) {
        target.transition().style("fill",d.attrs[v.currentAttr].color);
    }
}