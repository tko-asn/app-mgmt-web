import type { ChangeEvent, VFC } from 'react';
import styled from 'styled-components';

export type TextAreaProps = {
  handleChange: (value: string) => void;
  height?: string;
  id: string;
  placeholder: string;
  value?: string;
  width?: string;
};

const TextArea: VFC<TextAreaProps> = ({
  handleChange,
  height,
  id,
  placeholder,
  value,
  width,
}) => {
  return (
    <StyledTextArea
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange(e.target.value)}
      height={height}
      id={id}
      placeholder={placeholder}
      value={value}
      width={width}
    />
  );
};

const StyledTextArea = styled.textarea<Pick<TextAreaProps, 'height' | 'width'>>`
  border-color: silver;
  border-radius: 5px;
  box-sizing: border-box;
  display: block;
  height: ${(props) => (props.height ? props.height : '150px')};
  padding: 0 5px;
  resize: none;
  width: ${(props) => (props.width ? props.width : '100%')};
`;

export default TextArea;
