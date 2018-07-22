import React from 'react';

export class Validation extends React.Component {
  state = {
    valid: true,
    pristine: true,
    value: ''
  }

  getValue() {
    return this.state.value
  }

  isValid() {
    return this.state.valid
  }

  isPristine() {
    return this.state.pristine
  }

  onChange = (e, parentOnChange) => {
    let value = e.target.value;
    let valid = this.props.validate(value)

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

  getInputProps = props => {
    return {
      ...props,
      value: this.state.value,
      onChange: e => this.onChange(e, props.onChange)
    }
  }

  render() {
    return this.props.children({
      valid: this.state.valid,
      pristine: this.state.pristine,
      getInputProps: props => this.getInputProps(props)
    })
  }
}

export const withValidation = validate => WrappedComponent => props => (
  <Validation validate={validate}>
    {validationProps => (
      <WrappedComponent {...props} {...validationProps} />
    )}
  </Validation>
)