import type { VFC } from 'react';
import styled from 'styled-components';

export type UlProps = {
  children: JSX.Element[];
};

const Ul: VFC<UlProps> = ({ children }) => {
  return <StyledUl>{children}</StyledUl>;
};

const StyledUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export default Ul;
