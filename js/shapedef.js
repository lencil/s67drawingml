class ShapeDefinition {
    static add(def) {
        const type = def.tagName,
              shape = this[type] = {};
        
        shape.formula = {};
        Array.from(def.getElementsByTagName('gd')).forEach(gd => {
            let name = gd.getAttribute('name'),
                fmla = gd.getAttribute('fmla').split(' ');
            
            shape.formula[name] = {
                cmd: fmla.shift(1),
                params: fmla
            };
        });
        
        shape.path = Array.from(def.getElementsByTagName('path'))
                          .map(path => Array.from(path.childNodes)
                                            .filter(child => child.nodeType==1)
                                            .map(child => this.buildPathCmd(child))
                              );
    }
    
    static buildPathCmd(el) {
        let ret = { cmd: el.tagName }, c = el.firstElementChild;
        switch(ret.cmd) {
            case 'moveTo':
            case 'lnTo':
                ret.x = c.getAttribute('x');
                ret.y = c.getAttribute('y');
                break;
            case 'quadBezTo':
                ret.x1 = c.getAttribute('x');
                ret.y1 = c.getAttribute('y');
                c = c.nextElementSibling;
                ret.x2 = c.getAttribute('x');
                ret.y2 = c.getAttribute('y');
                break;
            case 'cubicBezTo':
                ret.x1 = c.getAttribute('x');
                ret.y1 = c.getAttribute('y');
                c = c.nextElementSibling;
                ret.x2 = c.getAttribute('x');
                ret.y2 = c.getAttribute('y');
                c = c.nextElementSibling;
                ret.x3 = c.getAttribute('x');
                ret.y3 = c.getAttribute('y');
                break;
            case 'arcTo':
                ret.wR = el.getAttribute('wR');
                ret.hR = el.getAttribute('hR');
                ret.stAng = el.getAttribute('stAng');
                ret.swAng = el.getAttribute('swAng');
                break;
            case 'close':
                break;
            default:
                console.log(ret.cmd);
        }
        return ret;
    }
}