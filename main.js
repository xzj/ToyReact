import {ToyReact, Component} from "./ToyReact.js";

class MyComponent extends Component {
    render() {
        return <div>Hello world!</div>;
    }
}

class C extends Component {
    render() {
        return <div>OK</div>;
    }
}

let a = <MyComponent ><C></C></MyComponent>;

console.log(" ==== okkkkkk");
ToyReact.render(a, document.getElementById('root'));
// document.body.append(a);
