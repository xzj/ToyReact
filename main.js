import {ToyReact, Component} from "./ToyReact.js";

class MyComponent extends Component {
    render() {
        return <div>Hello world!</div>;
    }
}

class C extends Component {
    render() {
        return <span>OK</span>;
    }
}

let a = <MyComponent ><div><C></C></div></MyComponent>;

console.log(" ==== okkkkkk");
ToyReact.render(a, document.getElementById('root'));
// document.body.append(a);
