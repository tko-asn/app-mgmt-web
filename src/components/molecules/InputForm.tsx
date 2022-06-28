import { memo, VFC } from 'react';
import Input, { InputProps } from '../atoms/Input';
import Label, { LabelProps } from '../atoms/Label';

export type InputFormProps = {
  inputProps: Pick<
    InputProps,
    'height' | 'id' | 'placeholder' | 'value' | 'width'
  >;
  labelProps: LabelProps;
  scalarTypeStateSetter?: (value: string) => void;
  stateKey?: string;
  stateSetter?: (stateKey: string, value: string) => void;
};

const InputForm: VFC<InputFormProps> = memo(({
  inputProps,
  labelProps,
  scalarTypeStateSetter,
  stateKey,
  stateSetter,
}) => {
  return (
    <>
      <Label {...labelProps} />
      {typeof scalarTypeStateSetter === 'function' && (
        <Input handleChange={scalarTypeStateSetter} {...inputProps} />
      )}
      {stateKey && typeof stateSetter === 'function' && (
        <Input
          handleChange={(value: string) => stateSetter(stateKey, value)}
          {...inputProps}
        />
      )}
    </>
  );
});

export default InputForm;
