import type { VFC } from 'react';
import styled from 'styled-components';
import Anchor, { AnchorProps } from '../atoms/Anchor';
import HyperLink, { HyperLinkProps } from '../atoms/HyperLink';

export type DropDownLinks = (HyperLinkProps | AnchorProps)[];

export type DropDownMenuProps = {
  className?: string;
  links: DropDownLinks;
};

const DropDownMenu: VFC<DropDownMenuProps> = ({ className, links }) => {
  const menus = links.map((link) => {
    if ('to' in link) {
      return (
        <StyledLi key={link.name}>
          <HyperLink
            background="#fff"
            color="#000"
            fontSize="0.9em"
            height="30px"
            {...link}
          />
        </StyledLi>
      );
    }
    return (
      <StyledLi key={link.name}>
        <Anchor
          background="#fff"
          color="#000"
          fontSize="0.9em"
          height="30px"
          {...link}
        />
      </StyledLi>
    );
  });
  return <StyledUl className={className}>{menus}</StyledUl>;
};

const StyledLi = styled.li`
  padding: 0 5px;
  + li {
    border-top: 1px solid gray;
  }
`;

const StyledUl = styled.ul`
  background: #fff;
  border: 1px solid gray;
  border-radius: 3px;
  list-style: none;
  margin: 0;
  min-width: 120px;
  overflow: hidden;
  padding: 0;
`;

export default DropDownMenu;
