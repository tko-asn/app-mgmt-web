import type { VFC } from 'react';
import styled from 'styled-components';
import HyperLinkList, { HyperLinkListProps } from '../molecules/HyperLinkList';

export type SideMenuProps = {
  hyperLinkListProps: HyperLinkListProps;
  width?: string;
};

const SideMenu: VFC<SideMenuProps> = ({ hyperLinkListProps, width }) => {
  return (
    <StyldNav width={width}>
      <HyperLinkList {...hyperLinkListProps} />
    </StyldNav>
  );
};

const StyldNav = styled.nav<Pick<SideMenuProps, 'width'>>`
  background: #3399CC;
  box-shadow: 2px 0 2px silver, -2px 0 2px silver;
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.width ? props.width : '30%')};
`;

export default SideMenu;
