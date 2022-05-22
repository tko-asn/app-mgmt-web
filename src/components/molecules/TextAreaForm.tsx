import type { VFC } from 'react';
import Label, { LabelProps } from '../atoms/Label';
import TextArea, { TextAreaProps } from '../atoms/TextArea';

export type TextAreaFormProps = {
  labelProps: LabelProps;
  scalarTypeStateSetter?: (value: string) => void;
  stateKey?: string;
  stateSetter?: (stateKey: string, value: string) => void;
  textAreaProps: Pick<
    TextAreaProps,
    'height' | 'id' | 'placeholder' | 'value' | 'width'
  >;
};

const TextAreaForm: VFC<TextAreaFormProps> = ({
  labelProps,
  scalarTypeStateSetter,
  stateKey,
  stateSetter,
  textAreaProps,
}) => (
  <>
    <Label {...labelProps} />
    {typeof scalarTypeStateSetter === 'function' && (
      <TextArea handleChange={scalarTypeStateSetter} {...textAreaProps} />
    )}
    {stateKey && typeof stateSetter === 'function' && (
      <TextArea
        handleChange={(value: string) => stateSetter(stateKey, value)}
        {...textAreaProps}
      />
    )}
  </>
);

export default TextAreaForm;
