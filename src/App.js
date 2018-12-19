import React, { Component } from 'react';
import PatientFormComponent from './components/PatientFormComponent';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className='container'>
          <PatientFormComponent />
        </div>
      </div>
    );
  }
}

export default App;
