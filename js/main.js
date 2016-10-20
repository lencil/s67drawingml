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
	})
    .catch(msg => console.error(msg));
