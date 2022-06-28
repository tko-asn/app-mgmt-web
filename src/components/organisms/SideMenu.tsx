import { memo, VFC } from 'react';
import styled from 'styled-components';
import HyperLinkList, { HyperLinkListProps } from '../molecules/HyperLinkList';

export type SideMenuProps = {
  hyperLinkListProps: HyperLinkListProps;
  width?: string;
  maxWidth?: string;
};

const SideMenu: VFC<SideMenuProps> = memo(({ hyperLinkListProps, width, maxWidth }) => {
  return (
    <StyldNav width={width} maxWidth={maxWidth}>
      <HyperLinkList {...hyperLinkListProps} />
    </StyldNav>
  );
});

const StyldNav = styled.nav<Pick<SideMenuProps, 'width' | 'maxWidth'>>`
  background: #e6e6e6;
  border-left: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.width ? props.width : '30%')};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : 'initial')};
`;

export default SideMenu;
