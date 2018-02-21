import React, { Component } from 'react';
import mySocket from 'socket.io-client';

class Test extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            screen:0,
            host:null,
            qobj:{q:null, o1:null, o2:null}
        }
    }
    
    componentDidMount(){
        this.socket = mySocket("http://localhost:10000");
        
        this.socket.on("newq", (data)=>{
            this.setState({
                qobj:data
            })
        });
        
        this.socket.on("result", (data)=>{
            alert(data);
        });
    }
    
    handleRoom=(roomStr)=>{
        this.setState({
            screen:1
        });
        
        this.socket.emit("joinroom", roomStr);
    }
    
    handleHost=(isHost)=>{
        this.setState({
            screen:2,
            host:isHost
        });
    }
    
    handleQ=()=>{
        var obj = {
            q:this.refs.q.value,
            o1:this.refs.o1.value,
            o2:this.refs.o2.value,
            a:this.refs.a.value
        };
        
        this.socket.emit("qsubmit", obj);
    }
    
    handleA=(optionNum)=>{
        this.socket.emit("answer", optionNum)
    }
    
    render() {
        
        var comp = null;
        
        if(this.state.screen === 0){
            comp = (
                <div>
                    <button onClick={this.handleRoom.bind(this, "room1")}>Room 1</button>
                    <button onClick={this.handleRoom.bind(this, "room2")}>Room 2</button>
                </div>
            )
        } else if(this.state.screen === 1){
            comp = (
                <div>
                    <button onClick={this.handleHost.bind(this, true)}>Host</button>
                    <button onClick={this.handleHost.bind(this, false)}>Player</button>
                </div>
            )
        } else if(this.state.screen === 2){
            if(this.state.host === true){
                comp = (
                    <div>
                        <input ref="q" type="text" placeholder="Ask a question" />
                        <input ref="o1" type="text" placeholder="Option 1" />
                        <input ref="o2" type="text" placeholder="Option 2" />
                        <select ref="a">
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                        </select>
                        <button onClick={this.handleQ}>Submit the Q</button>
                    </div>
                )
            } else if(this.state.host === false){
                comp = (
                    <div>
                        <div>{this.state.qobj.q}</div>
                        <button onClick={this.handleA.bind(this, "1")}>{this.state.qobj.o1}</button>
                        <button onClick={this.handleA.bind(this, "2")}>{this.state.qobj.o2}</button>
                    </div>
                )
            }
        }
        
        return (
            <div>
                {comp}
            </div>
        );
    }
}

export default Test;
