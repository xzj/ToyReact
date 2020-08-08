
export class Component {
    setAttribute(name, v) {
        this[name] = v;
    }
    appendChild(vchild) {
        const vdom = this.render();
        vdom.appendChild(vchild);
    }
    mountTo(parent) {
        console.log("==== this: ", this, " mount to: ", parent);
        const vdom = this.render();
        vdom.mountTo(parent);
    }
}

class ElementWrapper {
    constructor(tag) {
        this.root = document.createElement(tag);
    }
    setAttribute(name, v) {
        this.root.setAttribute(name, v);
    }
    appendChild(vchild) {
            console.log(" ==== append child: ", vchild, " to: ", this);
        this.root.appendChild(vchild);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
    mountTo(parent) {
            console.log(" ==== mount to parent: ", parent);
        parent.appendChild(this.root);
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

        for (let child of children) {
            if (typeof child === "string") {
                // child = document.createTextNode(child);
                child = new TextWrapper(child);
            }
            child.mountTo(e);
            // e.appendChild(child);
        }
        // debugger;
        return e;
    },
    render(vdom, e) {
        vdom.mountTo(e);
    }
}
