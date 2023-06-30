import React,{Component} from "react";
import './App.css';
import Modal from "./components/Modal";
import axios from 'axios';  
//const tasks=[
//  {id:1,title:"Buy milk",description:"hiii",completed:false},
//  {id:2,title:"Go to the gym", description:"hello",completed: false },
//]

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
//      modal:false,
      viewCompleted:false,
//    taskList:tasks,
      activeItem:{
        title:"",
        description:"",
        completed:false
      },
  //    taskList:tasks,
      todoList:[],
    };
  }

  componentDidMount(){
    this.refreshList();
  }

  refreshList=()=>{
    axios
      .get("http://localhost:8000/api/tasks/")
      .then(res=> this.setState({ todoList : res.data}))
      .catch(err=>console.log(err));
  };

//create toggle property
  toggle=()=>{
    this.setState({modal:!this.state.modal});
  };
  handleSubmit=item=>{
    this.toggle();
//  alert("Saved!" + JSON.stringify(item));
    if (item.id){
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`,item)
        .then(res =>this.refreshList());
      return;
    }
    axios
      .post("http://localhost:8000/api/tasks/",item)
      .then(res=>this.refreshList())
  };
  handleDelete=item=>{
//  alert("Deleted!" + JSON.stringify(item));
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then(res=>this.refreshList())
  };
  createItem=()=>{
    const item={title:"",description: "", completed: false};
    this.setState ({activeItem:item,modal:!this.state.modal});
  };
  editItem=item=>{
    this.setState({activeItem:item,modal:!this.state.modal})
  };




  displayCompleted=status=>{
    if(status){
      return this.setState({viewCompleted:true});
    }
    return this.setState({viewCompleted:false});

  };
  renderTabList=()=>{
    return(
      <div className="my-5 tab-list">
        <span
          onClick={()=>this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          Completed
        </span>
        <span
          onClick={()=>this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
        </span>
      </div>
    );
  };
//rendering items in the list completed or Incompleted
  renderItems=()=>{
    const {viewCompleted}=this.state;
    const newItems =this.state.todoList.filter(
      item=>item.completed===viewCompleted
    );

    return newItems.map(item=>(
      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}
          title={item.description}>
          {item.title}

        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>



    ));

  };
  









  render(){
    return(
      <main className="content p-3 mb-2 bg-info">
        <h1 className="text-black text-uppercase text-center my-4">Task Manager</h1>
        <div className="row">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button onClick={this.createItem} className="btn btn-warning">Add Task</button>
              </div>
              
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-3 mb-2 bg-info text-white text-center"> Ananya Basireddy</footer>
        {this.state.modal ? (
          <Modal activeItem={this.state.activeItem} 
          toggle={this.toggle} 
          onSave={this.handleSubmit}/>
        ): null} 
      </main>
    );
  }
}

export default App;
