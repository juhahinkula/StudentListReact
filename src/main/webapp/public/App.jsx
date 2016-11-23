import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import SkyLight from 'react-skylight';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.deleteStudent = this.deleteStudent.bind(this);
      this.createStudent = this.createStudent.bind(this);
      this.state = {
          students: [],
      };
   }
 
  componentDidMount() {
    this.loadStudentsFromServer();
  }
  
  // Load students from database
  loadStudentsFromServer() {
      fetch('http://localhost:8080/api/students') 
      .then((response) => response.json()) 
      .then((responseData) => { 
          this.setState({ 
              students: responseData._embedded.students, 
          }); 
      });
  } 
  
  // Delete student
  deleteStudent(student) {
      fetch (student._links.self.href,
      { method: 'DELETE',})
      .then( 
          res => this.loadStudentsFromServer()
      )
      .then(() => { 
          Alert.success('Student deleted', {
            position: 'bottom-left',
            effect: 'slide'
          });
      })
      .catch( err => cosole.error(err))                
  }  
  
  // Create new student
  createStudent(student) {
      fetch('http://localhost:8080/api/students', 
      {   method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(student)
      })
      .then( 
          res => this.loadStudentsFromServer()
      )
      .catch( err => cosole.error(err))
  }
  
  render() {
    return (
       <div>
          <StudentTable deleteStudent={this.deleteStudent} students={this.state.students}/> 
          <StudentForm createStudent={this.createStudent}/>
          <Alert stack={true} timeout={2000} />
       </div>
    );
  }
}
    	
class StudentTable extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
    var students = this.props.students.map(student =>
        <Student key={student._links.self.href} student={student} deleteStudent={this.props.deleteStudent}/>
    );

    return (
      <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Firstname</th><th>Lastname</th><th>Email</th><th> </th>
          </tr>
        </thead>
        <tbody>{students}</tbody>
      </table>
      </div>);
  }
}
        
class Student extends React.Component {
    constructor(props) {
        super(props);
        this.deleteStudent = this.deleteStudent.bind(this);
    }

    deleteStudent() {
        this.props.deleteStudent(this.props.student);
    } 
 
    render() {
        return (
          <tr>
            <td>{this.props.student.firstname}</td>
            <td>{this.props.student.lastname}</td>
            <td>{this.props.student.email}</td>
            <td>
                <button className="btn btn-danger btn-xs" onClick={this.deleteStudent}>Delete</button>
            </td>
          </tr>
        );
    } 
}

class StudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {firstname: '', lastname: '', email: ''};
        this.handleSubmit = this.handleSubmit.bind(this);   
        this.handleChange = this.handleChange.bind(this);     
    }

    handleChange(event) {
        console.log("NAME: " + event.target.name + " VALUE: " + event.target.value)
        this.setState(
            {[event.target.name]: event.target.value}
        );
    }    
    
    handleSubmit(event) {
        event.preventDefault();
        console.log("Firstname: " + this.state.firstname);
        var newStudent = {firstname: this.state.firstname, lastname: this.state.lastname, email: this.state.email};
        this.props.createStudent(newStudent);    
        this.refs.simpleDialog.hide();    
    }
    
    render() {
        return (
          <div>
            <SkyLight hideOnOverlayClicked ref="simpleDialog">
                <div className="panel panel-default">
                <div className="panel-heading">Create student</div>
                <div className="panel-body">
                <form className="form">
                    <div className="col-md-4">
                        <input type="text" placeholder="Firstname" className="form-control"  name="firstname" onChange={this.handleChange}/>    
                    </div>
                    <div className="col-md-4">       
                        <input type="text" placeholder="Lastname" className="form-control" name="lastname" onChange={this.handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <input type="text" placeholder="Email" className="form-control" name="email" onChange={this.handleChange}/>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-success" onClick={this.handleSubmit}>Save</button>   
                    </div>       
                </form>
                </div>      
                </div>
            </SkyLight>
            <div className="col-md-2">
                <button className="btn btn-success" onClick={() => this.refs.simpleDialog.show()}>New student</button>
            </div>
          </div>   
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root') );