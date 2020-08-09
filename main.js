import {ToyReact, Component} from "./ToyReact.js";

class Square extends Component {
  render() {
      return (
            <button className="square">
                        {this.props.value}
                              </button>
                                  );
    }
}

class Board extends Component {
    renderSquare(i) {
        return <Square value={i} />;
    }
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
            );
    }
}

// class C extends Component {
//     render() {
//         return <span>OK</span>;
//     }
// }

// let a = <MyComponent ><div><C></C></div></MyComponent>;
let a = <Board />;
console.log(" ++++ a: ", a);

console.log(" ==== okkkkkk");
ToyReact.render(a, document.getElementById('root'));
// document.body.append(a);
