function emailValidator (value) {
  return value && value.indexOf('@') > -1;
}

class YourForm extends React.Component {
  passwordRef = React.createRef()

  state = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  onSubmit = (e, data, valid) => {
    console.log('onsubmit', {e, data, valid})
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        {({submit, valid, pristine, validations}) => (
          <React.Fragment>
            <Form.Field
              name="email"
              validate={value => value && value.length > 8}
              defaultValue={this.state.email}
              onChange={value => console.log('email field changed', value)}
            >
              {({getLabelProps, getInputProps, valid, validations: fieldValidations, pristine}) => (
                <React.Fragment>
                  <label {...getLabelProps()}>Email</label>
                  <input
                    type="email"
                    {...getInputProps()}
                  />
                  {!pristine && !valid && (
                    <span>Invalid email address</span>
                  )}
                </React.Fragment>
              )}
            </Form.Field>


            <div>
              <button disabled={!valid} onClick={submit}>Submit</button>
            </div>
          </React.Fragment>
        )}
      </Form>
    )
  }
}