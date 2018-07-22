function emailValidator (value) {
  return value && value.indexOf('@') > -1;
}

class YourForm extends React.Component {
  passwordRef = React.createRef()

  render() {
    return (
      <Form>

        <FormField>
          <label>Email</label>
          <Validation validate={emailValidator}>
            {({valid, pristine, getInputProps}) => (
              <div>
                <input
                  type="text"
                  {...getInputProps({
                    onChange: e => console.log('email changed', e.target.value)
                  })}
                />
                {!pristine && !valid && (
                  <span>Invalid email address</span>
                )}
              </div>
            )}
          </Validation>
        </FormField>

        <FormField>
          <label>Password</label>
          <Validation validate={passwordValidator} ref={passwordRef}>
            {({valid, pristine, getInputProps}) => (
              <div>
                <input
                  type="password"
                  {...getInputProps({
                    onChange: e => console.log('password changed', e.target.value)
                  })}
                />
                {!pristine && !valid && (
                  <span>Invalid password</span>
                )}
              </div>
            )}
          </Validation>
        </FormField>



        <FormField>
          <label>Confirm Password</label>
          <Validation validate={value => isEqual(value, passwordRef.getValue())}>
            {({valid, pristine, getInputProps}) => (
              <div>
                <input
                  type="password"
                  {...getInputProps({
                    onChange: e => console.log('password changed', e.target.value)
                  })}
                />
                {!pristine && !valid && (
                  <span>Password does not match</span>
                )}
              </div>
            )}
          </Validation>
        </FormField>
      </Form>
    )
  }
}