import type { MouseEvent, VFC } from 'react';
import styled from 'styled-components';

export type ButtonProps = {
  background?: string;
  color?: string;
  disabled?: boolean;
  fontSize?: string;
  handleClick: (event: MouseEvent<HTMLButtonElement>) => void;
  height?: string;
  title: string;
  width?: string;
};

const Button: VFC<ButtonProps> = ({
  background,
  color,
  disabled,
  fontSize,
  handleClick,
  height,
  title,
  width,
}) => {
  return (
    <StyledButton
      background={background}
      color={color}
      disabled={disabled}
      fontSize={fontSize}
      height={height}
      onClick={handleClick}
      width={width}
    >
      {title}
    </StyledButton>
  );
};

const StyledButton = styled.button<
  Pick<ButtonProps, 'background' | 'fontSize' | 'height' | 'width'>
>`
  background: ${(props) => (props.background ? props.background : 'green')};
  border: none;
  border-radius: 5px;
  color: ${(props) => (props.color ? props.color : '#fff')};
  display: block;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '1.1em')};
  height: ${(props) => (props.height ? props.height : '35px')};
  width: ${(props) => (props.width ? props.width : '100%')};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  &:disabled {
    cursor: initial;
    opacity: 0.4;
  }
`;

export default Button;
