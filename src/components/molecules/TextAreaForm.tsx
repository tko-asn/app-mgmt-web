import type { VFC } from 'react';
import Label, { LabelProps } from '../atoms/Label';
import TextArea, { TextAreaProps } from '../atoms/TextArea';

export type TextAreaFormProps = {
  labelProps: LabelProps;
  stateKey: string;
  stateSetter: (stateKey: string, value: string) => void;
  textAreaProps: Pick<
    TextAreaProps,
    'height' | 'id' | 'placeholder' | 'value' | 'width'
  >;
};

const TextAreaForm: VFC<TextAreaFormProps> = ({
  labelProps,
  stateKey,
  stateSetter,
  textAreaProps,
}) => {
  const handleChange = (value: string) => stateSetter(stateKey, value);

  return (
    <>
      <Label {...labelProps} />
      <TextArea handleChange={handleChange} {...textAreaProps} />
    </>
  );
};

export default TextAreaForm;
