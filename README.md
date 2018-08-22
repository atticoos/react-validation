# react-validation

### Example

```js
import {Field} from 'react-validation'

...

<Field
  onChange={value => console.log('valid value:', value)}
  validate={value => value && value.length >= 8}
>
  {({getInputProps, valid, pristine}) => (
    <div>
      <input {...getInputProps()} />
      {!pristine && !valid && 'min length 8'}
    </div>
  )}
</Field>
```
