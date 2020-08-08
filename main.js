import {ToyReact, Component} from "./ToyReact.js";

class MyComponent extends Component {
    render() {
        return <div>Hello world!</div>;
    }
}

let a = <MyComponent />;

console.log(" ==== okkkkkk");
ToyReact.render(a, document.getElementById('root'));
// document.body.append(a);
