shapeLoader.load('./res/presetShapeDefinitions.xml')
    .then(xml => shapeLoader.parse(xml))
	.then(_ => {
		let sb = document.getElementById('shapetypes');
        Object.keys(ShapeDefinition).forEach(type => {
            let opt = document.createElement('option');
            opt.setAttribute('value', type);
            opt.innerHTML = type;
            sb.appendChild(opt);
        });
	
		playground.addEventListener('click', e => {
			let type = sb.value,
				shape = new Shape(type),
				div = document.createElement('div');
			
			shape.l = px2emu(e.layerX);
			shape.t = px2emu(e.layerY);
			console.log(shape.l, shape.t);
			shape.dom.style.position = 'absolute';
			shape.dom.style.top = emu2px(shape.offsetTop * -1);
			shape.dom.style.left = emu2px(shape.offsetLeft * -1);
			
			div.style.position = 'absolute';
			div.style.top = emu2px(shape.t);
			div.style.left = emu2px(shape.l);
			div.style.width = emu2px(shape.w);
			div.style.height = emu2px(shape.h);
			div.appendChild(shape.dom);
			
			playground.appendChild(div);
		});
	})
    .catch(msg => console.error(msg));
	
let emu2px = emu => emu/12700 + 'px';
let px2emu = px => parseInt(px)*12700;