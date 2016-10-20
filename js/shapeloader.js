const shapeLoader = {
    load: url => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.addEventListener('load', _ => xhr.status==200? resolve(xhr.responseXML) : reject(xhr.statusText));
            xhr.addEventListener('error', _ => reject(xhr.statusText));
            xhr.send(null);
        });
    },
    
    parse: xml => {
        return new Promise((resolve, reject) => {
            const root = xml.firstElementChild;
            if(!root || root.tagName!='presetShapeDefinitons') reject('root tag <presetShapeDefinitons> not found!');
            
            Array.from(root.children)
                 .filter(node => node.nodeType==1)
                 .forEach(def => ShapeDefinition.add(def));
			resolve();
        });
    }
}