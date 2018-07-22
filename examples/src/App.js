import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Form from './form'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>

        <Form onSubmit={(...args) => console.log('onSubmit', ...args)}>
          {({submit, valid}) => (
            <React.Fragment>
              <Form.Field
                name="email"
                validate={value => value.indexOf('@') > -1}
                onChange={e => console.log('onChange', e)}
              >
                {({getLabelProps, getInputProps, valid}) => (
                  <div>
                    <label {...getLabelProps()}>Email</label>
                    <input
                      type="text"
                      {...getInputProps()}
                    />
                    <br/>
                    Valid: {`${valid}`}
                  </div>
                )}
              </Form.Field>

              <div>
                <button onClick={submit} disabled={!valid}>Submit</button>
              </div>
            </React.Fragment>
          )}
        </Form>
      </div>
    );
  }
}

export default App;
