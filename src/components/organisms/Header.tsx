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
  const [showsDropDownMenu, setShowsDropDownMenu] = useState(false);

  return (
    <StyledHeader>
      <StyledContainer>
        <HyperLink
          height="35px"
          name="AppMGMT"
          width="150px"
          to="/top"
        />
        <StyledMenuWrapper
          onMouseEnter={() => setShowsDropDownMenu(true)}
          onMouseLeave={() => setShowsDropDownMenu(false)}
        >
          <Anchor
            handleClick={() => {}}
            height="35px"
            name={menuName}
            position="right"
            width="100px"
          />
          {showsDropDownMenu && <StyledDropDownMenu links={menus} />}
        </StyledMenuWrapper>
      </StyledContainer>
    </StyledHeader>
  );
};

const StyledHeader = styled.header`
  background: #000080;
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 30;
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
