import React, { Component } from 'react';
import './style.css';

class App extends Component{
  constructor(){
    super();
    this.state={
      name:"",
      salary:"",
      age:""
    }
  }
  submit(){
    let url="https://drive.google.com/file/d/1M-f5YMOfg5DVZpzjaDuBD-nR3-Tg1dyH/view";
    let data=this.state;
    fetch(url,{
      method:'POST',
      headers:{
        "Content-type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringfy(data)
    }).then((result)=>{
      result.json().then((resp)=>{
        console.warn("resp",resp)
      })
    })
  }
  submit(){
    console.log(this.state);
  }
  render(){
    return(
      <div>
          <h1>post</h1>
            <input type="text" value={this.state.line} name="name" onChange={(data)=>{this.setState({name:data.target.value})}} /> <br/>
            <input type="text" value={this.state.coordinatesy} name="salary" onChange={(data)=>{this.setState({name:data.target.value})}} /> 
            <br/> <br/>
            <button onClick={()=>{this.submit()}}>submitData</button>
            
      </div>
    )
  }
}
export default App;