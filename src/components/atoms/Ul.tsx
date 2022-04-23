import type { VFC } from 'react';
import styled from 'styled-components';

export type UlProps = {
  list: JSX.Element[];
};

const Ul: VFC<UlProps> = ({ list }) => {
  return <StyledUl>{list}</StyledUl>;
};

const StyledUl = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export default Ul;
