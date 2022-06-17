import type { VFC } from 'react';
import styled from 'styled-components';
import Anchor, { AnchorProps } from '../atoms/Anchor';
import HyperLink, { HyperLinkProps } from '../atoms/HyperLink';
import Ul from '../atoms/Ul';

type HL = Pick<
  HyperLinkProps,
  | 'background'
  | 'color'
  | 'height'
  | 'name'
  | 'position'
  | 'to'
  | 'width'
>;

type A = Pick<
  AnchorProps,
  | 'background'
  | 'color'
  | 'handleClick'
  | 'height'
  | 'name'
  | 'position'
  | 'width'
>;

export type MenuList = (HL | A)[];

export type HyperLinkListProps = {
  activebg?: string;
  menuList: MenuList;
};

const HyperLinkList: VFC<HyperLinkListProps> = ({ activebg, menuList }) => {
  const menus = menuList.map((menu) => {
    if ('to' in menu) {
      return (
        <StyledLi key={menu.name}>
          <HyperLink activebg={activebg} {...menu} />
        </StyledLi>
      );
    }
    return (
      <StyledLi key={menu.name}>
        <Anchor activebg={activebg} {...menu} />
      </StyledLi>
    );
  });
  return <Ul>{menus}</Ul>;
};

const StyledLi = styled.li`
  border-bottom: 1px solid #fff;
`;

export default HyperLinkList;
