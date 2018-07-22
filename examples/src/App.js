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


        <div style={{padding: 40}}>
          <Form onSubmit={(...args) => console.log('onSubmit', ...args)}>
            {({submit, valid, fields}) => (
              <React.Fragment>
                <Form.Field
                  name="email"
                  defaultValue="foo@bar.com"
                  validate={value => !!value && value.indexOf('@') > -1}
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

                <Form.Field
                  name="password"
                  validate={value => !!value && value.length > 8}
                  onChange={e => console.log('password changed', e)}
                >
                  {({getLabelProps, getInputProps, valid}) => (
                    <div>
                      <label {...getLabelProps()}>Password</label>
                      <input
                        type="password"
                        {...getInputProps()}
                      />
                      <br/>
                      Valid: {`${valid}`}
                    </div>
                  )}
                </Form.Field>

                <Form.Field
                  name="passwordConfirm"
                  validate={(value, fields) => !fields.password || value === fields.password.value}
                  onChange={e => console.log('password changed', e)}
                >
                  {({getLabelProps, getInputProps, valid}) => (
                    <div>
                      <label {...getLabelProps()}>Password</label>
                      <input
                        type="password"
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
                <pre>
                  {JSON.stringify(fields, null, 2)}
                </pre>
              </React.Fragment>
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
