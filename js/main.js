//import Shape from 'shape';
//import ShapeLoader from 'shapeloader';

shapeLoader.load('./res/presetShapeDefinitions.xml')
    .then(xml => shapeLoader.parse(xml))
    .catch(msg => console.error(msg));
//const loader = new ShapeLoader('./presetShapeDefinitions.xml');
//const  = loader.load();
//
//pro.then(xml => console.log(xml.firstChild.children))
//   .catch(msg => console.log(msg));
//
//pro.then(xml => loader.parse());