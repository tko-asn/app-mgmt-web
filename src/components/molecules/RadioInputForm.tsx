import type { VFC } from 'react';
import Label, { LabelProps } from '../atoms/Label';
import RadioInput, { RadioInputProps } from '../atoms/RadioInput';

export type RadioInputFormProps = {
  labelProps: LabelProps;
  radioInputProps: RadioInputProps;
};

const RadioInputForm: VFC<RadioInputFormProps> = ({
  labelProps,
  radioInputProps,
}) => {
  return (
    <>
      <RadioInput {...radioInputProps} />
      <Label {...labelProps} />
    </>
  );
};

export default RadioInputForm;
