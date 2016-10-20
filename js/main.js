shapeLoader.load('./res/presetShapeDefinitions.xml')
    .then(xml => shapeLoader.parse(xml))
	.then(_ => {
		let sb = document.getElementById('shapetypes');
	})
    .catch(msg => console.error(msg));
