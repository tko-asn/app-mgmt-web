import type { VFC } from 'react';
import styled from 'styled-components';
import Padding from '../atoms/Padding';
import Title, { TitleProps } from './Title';

export type FormCardProps = {
  children: JSX.Element;
  titleProps: TitleProps;
  width?: string;
};

const FormCard: VFC<FormCardProps> = ({ children, titleProps, width }) => {
  return (
    <StyledPadding width={width}>
      <Title position="center" {...titleProps} />
      {children}
    </StyledPadding>
  );
};

const StyledPadding = styled(Padding)<Pick<FormCardProps, 'width'>>`
  background: #fff;
  border: 2px solid gray;
  border-radius: 3px;
  max-width: 450px;
  width: ${(props) => (props.width ? props.width : '50%')};
`;

export default FormCard;
