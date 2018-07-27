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
  }

  allFieldsValid = fields => Object.keys(fields).reduce((valid, field) => valid && fields[field].getFieldState().valid, true)

  allFieldsPristine = fields => Object.keys(fields).reduce((pristine, field) => pristine && fields[field].getFieldState().pristine, true)

  submit = () => {
    this.props.onSubmit(this.getForm())
  }

  getForm() {
    return {
      fields: dataFromFields(this.state.fields),
      valid: this.allFieldsValid(this.state.fields),
      pristine: this.allFieldsPristine(this.state.fields)
    }
  }

  render() {
    let form = this.getForm()
    console.log('form rendering with', {
      submit: this.submit,
      ...form
    })
    return (
      <Provider
        value={{
          updateField: this.updateField,
          register: this.register,
          unregister: this.unregister,
          fields: form.fields
        }}
      >
        {this.props.children({
          submit: this.submit,
          ...form
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
    valid: this.areValidationsValid(this.validate(this.props.defaultValue || '')),
    validations: this.validate(this.props.defaultValue || ''),
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
      let validations = this.validate(this.state.value)
      let valid = this.areValidationsValid(validations)
      let prevValidationValues = Object.values(this.state.validations)
      let nextValidationValues = Object.values(validations)
      let areEqual = prevValidationValues.filter((v, i) => v !== nextValidationValues[i]).length === 0
      console.log('difference', {prevValidationValues, nextValidationValues, areEqual})

      if (!areEqual) {
        this.update(this.state.value, validations, valid)
      }
    }
  }

  update(value, validations, valid, cb = () => {}) {
    this.setState({
      value,
      validations,
      valid,
      pristine: false
    }, () => {
      this.props.form.updateField()
      cb(value, validations, valid)
    });
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

  validate(value) {
    let validations = this.props.validate ? this.props.validate(value, this.props.form.fields) : true;

    if (typeof validations === 'object') {
      return validations
    }
    return {
      default: validations
    }
  }

  areValidationsValid(validations) {
    return Object.keys(validations).reduce((valid, validation) => valid && !!validations[validation], true)
  }

  onChange = (e, parentOnChange) => {
    let value = e.target.value;

    let validations = this.validate(value)
    let valid = this.areValidationsValid(validations)

    this.update(value, validations, valid, () => {
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
      validations: this.state.validations,
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
