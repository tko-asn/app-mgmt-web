import type { ChangeEvent, VFC } from 'react';
import styled from 'styled-components';

export type InputProps = {
  handleChange: (value: string) => void;
  height?: string;
  id: string;
  placeholder: string;
  value?: string;
  width?: string;
};

const Input: VFC<InputProps> = ({
  handleChange,
  height,
  id,
  placeholder,
  value,
  width,
}) => {
  return (
    <StyledInput
      height={height}
      id={id}
      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
      width={width}
    />
  );
};

const StyledInput = styled.input<Pick<InputProps, 'height' | 'width'>>`
  border: 1px solid silver;
  border-radius: 5px;
  box-sizing: border-box;
  display: block;
  height: ${(props) => (props.height ? props.height : '35px')};
  padding: 0 5px;
  width: ${(props) => (props.width ? props.width : '100%')};
`;

export default Input;
