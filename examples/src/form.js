import React from 'react';

const {Provider, Consumer} = React.createContext();

export default class Form extends React.Component {
  state = {
    pristine: true,
    fields: {}
  }

  register = (id, comp) => {
    this.setState(prevState => ({
      ...prevState,
      fields: {
        ...prevState.fields,
        [id]: comp
      }
    }))
  }

  unregister = (id, comp) => {
    this.setState(prevState => ({
      ...prevState,
      fields: Object.keys(prevState).reduce((fields, field) => {
        if (field !== id) {
          fields[field] = prevState.fields[field]
        }
        return fields
      }, {})
    }))
  }

  registerField = (name, value) => {
    // this.setState(prevState => ({
    //   ...prevState,
    //   fields: {
    //     ...prevState.fields,
    //     [name]: {
    //       ...prevState.fields.name,
    //       value,
    //       valid: false
    //     }
    //   }
    // }))
  }

  updateField = (name, value, valid) => {
    this.forceUpdate()
    // this.setState(prevState => ({
    //   ...prevState,
    //   pristine: false,
    //   fields: {
    //     ...prevState.fields,
    //     [name]: {
    //       ...prevState.fields.name,
    //       value,
    //       valid
    //     }
    //   }
    // }))
  }

  allFieldsValid = fields => Object.keys(fields).reduce((valid, field) => valid && fields[field].getFieldState().valid, true)

  allFieldsPristine = fields => Object.keys(fields).reduce((pristine, field) => pristine && fields[field].getFieldState().pristine, true)

  submit = () => {
    console.log('submitted', this.state)
  }

  render() {
    console.log('form rendering with', {
      submit: this.submit,
      valid: this.allFieldsValid(this.state.fields),
      pristine: this.allFieldsPristine(this.state.fields),
      fields: dataFromFields(this.state.fields)
    })
    return (
      <Provider
        value={{
          updateField: this.updateField,
          register: this.register,
          unregister: this.unregister,
          fields: dataFromFields(this.state.fields)
        }}
      >
        {this.props.children({
          submit: this.submit,
          valid: this.allFieldsValid(this.state.fields),
          pristine: this.allFieldsPristine(this.state.fields),
          fields: dataFromFields(this.state.fields)
        })}
      </Provider>
    )
  }
}

const dataFromFields = fields => Object.keys(fields).reduce((fieldStates, field) => {
  fieldStates[field] = fields[field].getFieldState()
  return fieldStates
}, {})

const withForm = WrappedComponent => props => (
  <Consumer>
    {form => (
      <WrappedComponent {...props} form={form} />
    )}
  </Consumer>
)

export const Field = Form.Field = withForm(class FormField extends React.Component {
  state = {
    valid: this.isValid(this.props.defaultValue || ''),
    pristine: true,
    inputId: `field_${Math.random()}`,
    value: this.props.defaultValue || ''
  }

  componentDidMount() {
    this.props.form.register(this.props.name, this)
  }

  componentWillUnmount() {
    this.props.form.unregister(this.props.name, this)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.form.fields !== prevProps.form.fields) {
      let valid = this.isValid(this.state.value)
      if (valid !== this.state.valid) {
        this.validateAndUpdate(this.state.value)
      }
    }
  }

  validateAndUpdate(value, cb) {
    let valid = this.isValid(value)
    this.setState({
      value,
      valid,
      pristine: false
    }, () => {
      this.props.form.updateField()
      if (cb) {
        cb(valid)
      }
    })
  }

  getFieldState() {
    return {
      ...this.state,
      name: this.props.name
    }
  }

  getValue() {
    return this.state.value
  }

  isPristine() {
    return this.state.pristine
  }

  isValid(value) {
    return !this.props.validate || this.props.validate(value, this.props.form.fields)
  }

  onChange = (e, parentOnChange) => {
    let value = e.target.value;
    this.validateAndUpdate(value, valid => {
      if (valid && parentOnChange) {
        parentOnChange(value)
      }
    })
  }

  getInputProps = (props = {}) => {
    return {
      ...props,
      id: this.state.inputId,
      value: this.state.value,
      onChange: e => this.onChange(e, props.onChange)
    }
  }

  render() {
    return this.props.children({
      valid: this.state.valid,
      pristine: this.state.pristine,
      getInputProps: props => this.getInputProps(props),
      getLabelProps: props => ({
        ...props,
        name: this.props.name,
        htmlFor: this.state.inputId
      })
    })
  }
})