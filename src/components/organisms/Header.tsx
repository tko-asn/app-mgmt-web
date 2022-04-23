import { useState, VFC } from 'react';
import styled from 'styled-components';
import DropDownMenu, { DropDownLinks } from '../molecules/DropDownMenu';
import HyperLink from '../atoms/HyperLink';
import Anchor from '../atoms/Anchor';

export type HeaderProps = {
  menuName: string;
  menus: DropDownLinks;
};

const Header: VFC<HeaderProps> = ({ menuName, menus }) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <StyledHeader>
      <StyledContainer>
        <HyperLink
          height="35px"
          name="logo"
          position="center"
          width="80px"
          to="/"
        />
        <StyledMenuWrapper
          onMouseEnter={() => setIsShow(true)}
          onMouseLeave={() => setIsShow(false)}
        >
          <Anchor
            handleClick={() => {}}
            height="35px"
            name={menuName}
            position="center"
            width="100px"
          />
          {isShow && <StyledDropDownMenu links={menus} />}
        </StyledMenuWrapper>
      </StyledContainer>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  background: #000;
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  z-index: 30;
  top: 0;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
`;

const StyledMenuWrapper = styled.div`
  position: relative;
`;

const StyledDropDownMenu = styled(DropDownMenu)`
  position: absolute;
  right: -15px;
  top: 30px;
  z-index: 50;
`;

export default Header;
