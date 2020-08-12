
export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    get type() {
        return this.constructor.name;
    }
    setAttribute(name, v) {
        this.props[name] = v;
        this[name] = v;
    }
    appendChild(vchild) {
        // const vdom = this.render();
        // vdom.appendChild(vchild);
        this.children.push(vchild);
    }
    setState(state) {
        const merge = (oldState, newState) => {
            for (let p in newState) {
                if ((typeof newState[p] === 'object') && (newState[p] !== null)) {
                    if (typeof oldState[p] !== 'object') {
                        if (newState[p] instanceof Array) {
                            oldState[p] = [];
                        }
                        else {
                            oldState[p] = {};
                        }
                    }
                    merge(oldState[p], newState[p]);
                }
                else {
                    oldState[p] = newState[p];
                }
            }
        }
        if (!this.state && state) {
            this.state = {};
        }
        merge(this.state, state);
        this.update();
    }
    mountTo(range) {
        console.log("==== this: ", this, " mount to: ", range);
        // range.deleteContents();
        // const vdom = this.render();
        // vdom.mountTo(range);
        this.range = range;
        this.update();
    }
    update() {
        const vdom = this.render();
        if (this.vdom) {
            const isSameNode = (node1, node2) => {
                if (node1.type !== node2.type) {
                    return false;
                }
                for (let name of node1.props) {
                    if (node1.props[name] !== node2.props[name]) {
                        return false;
                    }
                }
                if (Object.keys(node1.props).length !== Object.keys(node2.props).length) {
                    return false;
                }
                return true;
            }
            const isSameTree = (node1, node2) => {
                if (!isSameNode(node1, node2)) {
                    return false;
                }
                if (node1.children.length !=== node2.children.length) {
                    return fasle;
                }
                for (let i = 0; i < node1.children.length; ++i) {
                    if (!isSameNode(node1.children[i], node2.children[i])) {
                        return false;
                    }
                }
                return true;
            }
            if (isSameTree(vdom, this.vdom)) {
                return;
            }

            console.log("new: ", vdom);
            console.log("old: ", this.vdom);
        }
        else {
            vdom.mountTo(this.range);
        }

        this.vdom = vdom;
    }
}

class ElementWrapper {
    constructor(type) {
        this.type = type;
        this.props = Object.create(null);
        this.children = [];
    }
    setAttribute(name, v) {
        this.props[name] = v;
    }
    appendChild(vchild) {
        this.children.push(vchild);
    }
    mountTo(range) {
        range.deleteContents();
        const element = document.createElement(this.type);

        for (let name in this.props) {
            const v = this.props[name];
            if (name.match(/^on(.+)$/)) {
                const eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
                element.addEventListener(eventName, v);
            }
            if (name === "className") {
                element.setAttribute("class", v);
            }
            element.setAttribute(name, v);
        }

        for (let child of this.children) {
            mountVdomToElement(child, element);
        }

        range.insertNode(element);
    }
}

class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
        this.type = "#text";
        this.props = Object.create(null);
        this.children = [];
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
        // parent.appendChild(this.root);
    }
}

// export class Component {
//     constructor() {
//         this.children = [];
//         this.props = Object.create(null);
//     }
//     setAttribute(name, v) {
//         this.props[name] = v;
//         this[name] = v;
//     }
//     appendChild(vchild) {
//         // const vdom = this.render();
//         // vdom.appendChild(vchild);
//         this.children.push(vchild);
//     }
//     setState(state) {
//         const merge = (oldState, newState) => {
//             for (let p in newState) {
//                 if ((typeof newState[p] === 'object') && (newState[p] !== null)) {
//                     if (typeof oldState[p] !== 'object') {
//                         if (newState[p] instanceof Array) {
//                             oldState[p] = [];
//                         }
//                         else {
//                             oldState[p] = {};
//                         }
//                     }
//                     merge(oldState[p], newState[p]);
//                 }
//                 else {
//                     oldState[p] = newState[p];
//                 }
//             }
//         }
//         if (!this.state && state) {
//             this.state = {};
//         }
//         merge(this.state, state);
//         this.update();
//     }
//     mountTo(range) {
//         console.log("==== this: ", this, " mount to: ", range);
//         // range.deleteContents();
//         // const vdom = this.render();
//         // vdom.mountTo(range);
//         this.range = range;
//         this.update();
//     }
//     update() {
//         const placeholder = document.createComment("placeholder");
//         const range = document.createRange();
//         range.setStart(this.range.endContainer, this.range.endOffset);
//         range.setEnd(this.range.endContainer, this.range.endOffset);
//         range.insertNode(placeholder);

//         this.range.deleteContents();
//         const vdom = this.render();
//         vdom.mountTo(this.range);
//     }
// }

// class ElementWrapper {
//     constructor(tag) {
//         this.root = document.createElement(tag);
//     }
//     setAttribute(name, v) {
//         if (name.match(/^on(.+)$/)) {
//             const eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
//             this.root.addEventListener(eventName, v);
//         }
//         if (name === "className") {
//             name = 'class';
//         }
//         this.root.setAttribute(name, v);
//     }
//     appendChild(vchild) {
//         console.log(" ==== append child: ", vchild, " to: ", this);
//         // this.root.appendChild(vchild);
//         // vchild.mountTo(this.root);
//         mountVdomToElement(vchild, this.root);
//     }
//     mountTo(range) {
//         range.deleteContents();
//         range.insertNode(this.root);
//         // parent.appendChild(this.root);
//     }
// }
// class TextWrapper {
//     constructor(content) {
//         this.root = document.createTextNode(content);
//     }
//     mountTo(range) {
//         range.deleteContents();
//         range.insertNode(this.root);
//         // parent.appendChild(this.root);
//     }
// }

export let ToyReact = {
    createElement(type, attributes, ...children) {
        console.log(" ---- create element: ", arguments);
        let e = null;
        if (typeof type === "string") {
            e = new ElementWrapper(type);
        }
        else {
            e = new type;
        }
        // const e = document.createElement(type);

        for (let k in attributes) {
            e.setAttribute(k, attributes[k]);
        }

        const insertChildren = (children) => {
            for (let child of children) {
                if((typeof child === "object") && (child instanceof Array)) {
                    insertChildren(child);
                }
                else {
                    if ((child === null) || (child === void 0)) {
                        child = "";
                    }
                    if(!((child instanceof Component) || (child instanceof ElementWrapper) || (child instanceof TextWrapper))) {
                        child = String(child);
                    }
                    if (typeof child === "string") {
                        // child = document.createTextNode(child);
                        child = new TextWrapper(child);
                    }
                    // child.mountTo(e);
                    e.appendChild(child);
                }
            }
        }
        insertChildren(children);
        // debugger;
        return e;
    },
    render(vdom, e) {
        mountVdomToElement(vdom, e);
    }
}

function mountVdomToElement(vdom, e) {
    const range = document.createRange();
    if(e.children.length) {
        range.setStartAfter(e.lastChild);
        range.setEndAfter(e.lastChild);
    }
    else {
        range.setStart(e, 0);
        range.setEnd(e, 0);
    }
    vdom.mountTo(range);
}
