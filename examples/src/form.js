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
    this.setState(prevState => ({
      ...prevState,
      fields: {
        ...prevState.fields,
        [name]: {
          ...prevState.fields.name,
          value,
          valid: false
        }
      }
    }))
  }

  updateField = (name, value, valid) => {
    this.setState(prevState => ({
      ...prevState,
      pristine: false,
      fields: {
        ...prevState.fields,
        [name]: {
          ...prevState.fields.name,
          value,
          valid
        }
      }
    }))
  }

  allFieldsValid = fields => Object.keys(fields).reduce((valid, field) => valid && fields[field].valid, true)

  submit = () => {
    console.log('submitted', this.state)
  }

  render() {
    console.log('form rendering with', {
      submit: this.submit,
      valid: this.allFieldsValid(this.state.fields),
      pristine: this.state.pristine,
      fields: this.state.fields
    })
    return (
      <Provider
        value={{
          updateField: this.updateField,
          register: this.register,
          unregister: this.unregister
        }}
      >
        {this.props.children({
          submit: this.submit,
          valid: this.allFieldsValid(this.state.fields),
          pristine: this.state.pristine,
          fields: this.state.fields
        })}
      </Provider>
    )
  }
}

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
    this.props.form.register(this.state.inputId, this)
  }

  componentWillUnmount() {
    this.props.form.unregister(this.state.inputId, this)
  }

  getFieldState() {
    return this.state;
  }

  getValue() {
    return this.state.value
  }

  isPristine() {
    return this.state.pristine
  }

  isValid(value) {
    return !this.props.validate || this.props.validate(value)
  }

  onChange = (e, parentOnChange) => {
    let value = e.target.value;
    let valid = this.isValid(value)

    this.props.form.updateField(
      this.props.name,
      value,
      valid
    )

    this.setState({
      valid,
      value,
      pristine: false
    }, () => {
      if (this.state.valid && parentOnChange) {
        parentOnChange(this.state.value)
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

// export const withValidation = validate => WrappedComponent => props => (
//   <Validation validate={validate}>
//     {validationProps => (
//       <WrappedComponent {...props} {...validationProps} />
//     )}
//   </Validation>
// )