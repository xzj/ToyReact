
export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
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
                if (typeof newState[p] === 'object') {
                    if (typeof oldState[p] !== 'object') {
                        oldState[p] = {};
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
        const placeholder = document.createComment("placeholder");
        const range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder);

        this.range.deleteContents();
        const vdom = this.render();
        vdom.mountTo(this.range);
    }
}

class ElementWrapper {
    constructor(tag) {
        this.root = document.createElement(tag);
    }
    setAttribute(name, v) {
        if (name.match(/^on(.+)$/)) {
            const eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
            this.root.addEventListener(eventName, v);
        }
        if (name === "className") {
            name = 'class';
        }
        this.root.setAttribute(name, v);
    }
    appendChild(vchild) {
        console.log(" ==== append child: ", vchild, " to: ", this);
        // this.root.appendChild(vchild);
        // vchild.mountTo(this.root);
        mountVdomToElement(vchild, this.root);
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
        // parent.appendChild(this.root);
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
        // parent.appendChild(this.root);
    }
}

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
