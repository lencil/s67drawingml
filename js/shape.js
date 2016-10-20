class Shape {
    constructor(type) {
        this.type = type;
        this.formula = ShapeDefinition[this.type].formula;
        this.path = ShapeDefinition[this.type].path;
      
        this._dom = null;
        this.offsetLeft = undefined;
        this.offsetTop = undefined;
        this.offsetWidth = undefined;
        this.offsetTop = undefined;
		
        this.top = 0;
        this.left = 0;
        this.width = 216000;
        this.height = 216000;
        this.rotation = 0;
    }
    
    // guide formula handler
    f(v) {
        if(v.match(/^[0-9]+$/)) return v|0;     // numeric
        if(typeof this[v]!="undefined") return this[v];             // reserved
        const gd = this.formula[v];
        if(!gd) console.error(`new formula : ${v}`);
        const cmd = gd.cmd,
              params = gd.params.map(p => this.f(p));
		
        switch(cmd) {
            case 'val': return params[0];
            case '+-':  return params[0] + params[1] - params[2];
            case '*/':  return params[0] * params[1] / params[2];
            case 'min': return Math.min(params[0], params[1]);
            case 'max': return Math.max(params[0], params[1]);
            case 'pin': return Math.max(params[0], Math.min(params[1], params[2]));
            case 'mod': return Math.sqrt(params[0]*params[0] + params[1]*params[1] + params[2]*params[2]);
            case '?:':  return params[0]>0? params[1] : params[2];
            case 'sin': return params[0] * Math.sin(params[1] / 10800000 * Math.PI);
            case 'cos': return params[0] * Math.cos(params[1] / 10800000 * Math.PI);
            case 'tan': return params[0] * Math.tan(params[1] / 10800000 * Math.PI);
            case 'at2': return Math.atan2(params[1], params[0]) * 10800000 / Math.PI;
            case 'sat2':return params[0] * Math.sin(Math.atan2(params[2], params[1]));
            case 'cat2':return params[0] * Math.cos(Math.atan2(params[2], params[1]));
            default:    console.error(`new operator : ${cmd}`);
        }
    } 
    // reserved words
    get t() { return this.top; }
    get l() { return this.left; }
    get b() { return this.top + this.height; }
    get r() { return this.left + this.width; }
    get w() { return this.width; }
    get h() { return this.height; }
    get wd2() { return this.width/2; }
    get hd2() { return this.height/2; }
    get hd3() { return this.height/3; }
    get wd4() { return this.width/4; }
    get hd4() { return this.height/4; }
    get ss() { return Math.min(this.w, this.h); }
    get hc() { return this.l + this.w/2; }
    get vc() { return this.t + this.h/2; }
    
    // general setters
    set t(v) { this.top = v; }
    set l(v) { this.left = v; }
    set w(v) { this.width = v; }
    set h(v) { this.height = v; }
    rotate(a) { this.rotation = a; }
    
    // renderer
	get dom() {
		if(!this._dom) this.render();
		return this._dom
	}
    render() {
		const def = ShapeDefinition[this.type].path;
        let vTop = this.t,
			vLeft = this.l,
			vBottom = this.b,
			vRight = this.r;
		
		if(!this._dom) {
			this._dom = this.SVG('svg');
			def.forEach(p => {
                let path = this.SVG('path');
                path.setAttribute('fill', '#777');
                path.setAttribute('stroke', '#000');
                path.setAttribute('stroke-width', '2160');
                this._dom.appendChild(path);
            });
		}
        
        def.forEach((path, i) => {
            let d = [], x1, x2, y1, y2, lastX, lastY;
            path.forEach(sp => {
                switch(sp.cmd) {
                    case 'moveTo':
                    case 'lnTo':
                        lastX = this.f(sp.x);
                        lastY = this.f(sp.y);
						vTop = Math.min(vTop, lastY);
						vLeft = Math.min(vLeft, lastX);
						vBottom = Math.max(vBottom, lastY);
						vRight = Math.max(vRight, lastX);
                        d.push(`${sp.cmd=='moveTo'? 'M' : 'L'} ${lastX} ${lastY}`);
                        break;
                    case 'quadBezTo':
				        x1 = this.f(sp.x1);
                        y1 = this.f(sp.y1);
                        lastX = this.f(sp.x2);
                        lastY = this.f(sp.y2);
						vTop = Math.min.apply(null, [vTop, y1, lastY]);
						vLeft = Math.min.apply(null, [vLeft, x1, lastX]);
						vBottom = Math.max.apply(null, [vBottom, y1, lastY]);
						vRight = Math.max.apply(null, [vRight, x1, lastX]);
                        d.push(`Q ${x1} ${y1} ${lastX} ${lastY}`);
                        break;
                    case 'cubicBezTo':
						x1 = this.f(sp.x1);
                        x2 = this.f(sp.x2);
                        y1 = this.f(sp.y1);
                        y2 = this.f(sp.y2);
                        lastX = this.f(sp.x3);
                        lastY = this.f(sp.y3);
						vTop = Math.min.apply(null, [vTop, y1, y2, lastY]);
						vLeft = Math.min.apply(null, [vLeft, x1, x2, lastX]);
						vBottom = Math.max.apply(null, [vBottom, y1, y2, lastY]);
						vRight = Math.max.apply(null, [vRight, x1, x2, lastX]);
                        d.push(`C ${x1} ${y1} ${x2} ${y2} ${lastX} ${lastY}`);
                        break;
                    case 'arcTo':
                        let p = this.getArcParamSVG(lastX, lastY, this.f(sp.wR), this.f(sp.hR), this.f(sp.stAng), this.f(sp.swAng));
                        lastX = p.endX;
                        lastY = p.endY;
						vTop = Math.min(vTop, p.cY - p.rY);
						vLeft = Math.min(vLeft, p.cX - p.rX);
						vBottom = Math.max(vBottom, p.cY + p.rY);
						vRight = Math.max(vRight, p.cX + p.rX);
                        d.push(`A ${p.width} ${p.height} 0 ${p.big} ${p.sweep} ${lastX} ${lastY}`);
                        break;
                    case 'close':
                        d.push('Z');
                        break;
                }
            });
            this.offsetLeft = vLeft;
            this.offsetTop = vTop;
            this.offsetWidth = vBottom - vTop;
            this.offsetHeight = vRight - vLeft;
			this._dom.setAttribute('viewBox', `${this.offsetLeft} ${this.offsetTop} ${this.offsetWidth} ${this.offsetHeight}`)
            this._dom.childNodes[i].setAttribute('d', d.join(' '));
        });
    }
    SVG(tag) { return document.createElementNS('http://www.w3.org/2000/svg', tag); }
    getArcParamSVG(lastX, lastY, rX, rY, stAng, swAng) {
        let endAng = stAng + swAng,
            stRad = stAng / 10800000 * Math.PI,
            endRad = endAng / 1080000 * Math.PI,
            dSt = Math.atan2(rX * Math.sin(stRad), rY * Math.cos(stRad)),
            dEnd = Math.atan2(rX * Math.sin(endRad), rY * Math.cos(endRad)),
            
            cX = lastX - Math.cos(dSt) * rX,
            cY = lastY - Math.sin(dSt) * rY,
            
            bBig = swAng >= 10800000 || (swAng < 0 && swAng > -10800000),
            bSweep = swAng > 0;
        
        return {
            width: rX,
            height: rY,
            big: bSweep ^ bBig ^ 1,
            sweep: bSweep ^ 0,
            endX: cX + Math.cos(dEnd) * rX,
            endY: cY + Math.sin(dEnd) * rY,
			rX: rX,
			rY: rY,
			cX: cX,
			cY: cY
        }
    }
}

//export Shape;