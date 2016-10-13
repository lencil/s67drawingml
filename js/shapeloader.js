// import Shape from 'shape'

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
            
            resolve(Array.from(root.children)
                         .filter(node => node.nodeType==1)
                         .forEach(def => ShapeDefinition.add(def)));
        });
    }
}

//class ShapeLoader extends XMLHttpRequest {
//    constructor(uri) {
//        super();
//        this.SOURCE_URI = uri;
//        
//        this.load().then(this.parse);
//    }
//    
//    load() {
//        return new Promise((resolve, reject) => {
//            this.open('GET', this.SOURCE_URI);
//            this.overrideMimeType('text/xml');
//            this.addEventListener('load', () => this.status>=200 && this.status<300
//                                                    ? resolve(this.responseXML)
//                                                    : reject(this.statusText));
//            
//            this.addEventListener('error', () => reject(this.statusText));
//            this.send(null);
//        });
//    }
//    
//    *shapeDef() {
//        let currentNode = this.responseXML.firstChild.firstElementChild;
//        
//        do {
//            yield new Shape(currentNode);
//        } while(currentNode = currentNode.nextElementSibling);
//    }
//}

//export ShapeLoader;