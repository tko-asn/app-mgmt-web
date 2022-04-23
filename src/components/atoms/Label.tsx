import type { VFC } from 'react';
import styled from 'styled-components';

export type LabelProps = {
  fontSize?: string;
  fontWeight?: string;
  htmlFor?: string;
  value: string;
};

const Label: VFC<LabelProps> = ({ fontSize, fontWeight, htmlFor, value }) => {
  return (
    <StyledLabel fontSize={fontSize} fontWeight={fontWeight} htmlFor={htmlFor}>
      {value}
    </StyledLabel>
  );
};

const StyledLabel = styled.label<Pick<LabelProps, 'fontSize' | 'fontWeight'>>`
  color: #555;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '0.9em')};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 'normal')};
`;

export default Label;
