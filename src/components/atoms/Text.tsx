import type { VFC } from 'react';
import styled from 'styled-components';

export type TextProps = {
  className?: string;
  color?: string;
  size?: string;
  value: string;
  weight?: string;
};

const Text: VFC<TextProps> = ({ className, color, size, value, weight }) => {
  return (
    <StyledP className={className} color={color} size={size} weight={weight}>
      {value}
    </StyledP>
  );
};

const StyledP = styled.p<Pick<TextProps, 'size' | 'weight'>>`
  color: ${(props) => (props.color ? props.color : 'initial')};
  font-size: ${(props) => (props.size ? props.size : '1em')};
  font-weight: ${(props) => (props.weight ? props.weight : 'normal')};
  margin: 0;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

export default Text;
