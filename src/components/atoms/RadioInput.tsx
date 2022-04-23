import type { ChangeEvent, VFC } from 'react';
import styled from 'styled-components';

export type RadioInputProps = {
  checked: boolean;
  id: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const RadioInput: VFC<RadioInputProps> = ({ checked, handleChange, id }) => {
  return (
    <StyledInput
      type="radio"
      id={id}
      checked={checked}
      onChange={handleChange}
    />
  );
};

const StyledInput = styled.input`
  margin-top: 0;
  vertical-align: middle;
`;

export default RadioInput;
