import { memo, VFC } from 'react';
import Label from '../atoms/Label';
import RadioInputForm, {
  RadioInputFormProps,
} from '../molecules/RadioInputForm';

export type RadioInputFormListProps = {
  fontSize?: string;
  fontWeight?: string;
  radioInputForms: RadioInputFormProps[];
  title: string;
};

const RadioInputFormList: VFC<RadioInputFormListProps> = memo(({
  fontSize,
  fontWeight,
  radioInputForms,
  title,
}) => {
  const forms = radioInputForms.map((form) => (
    <RadioInputForm key={form.labelProps.value} {...form} />
  ));
  return (
    <>
      <div>
        <Label fontSize={fontSize} fontWeight={fontWeight} value={title} />
      </div>
      {forms}
    </>
  );
});

export default RadioInputFormList;
