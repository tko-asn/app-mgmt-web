import type { VFC } from 'react';
import styled from 'styled-components';
import HyperLinkList, { MenuList } from '../molecules/HyperLinkList';

export type TeamLinkListProps = {
  maxHeight?: string;
  menuList: MenuList;
  noTeamText: string;
};

const TeamLinkList: VFC<TeamLinkListProps> = ({ maxHeight, menuList, noTeamText }) => {
  return (
    <StyledTeamsWrapper maxHeight={maxHeight}>
      {menuList.length ? (
        <HyperLinkList menuList={menuList} />
      ) : (
        <StyledP>{noTeamText}</StyledP>
      )}
    </StyledTeamsWrapper>
  );
};

const StyledTeamsWrapper = styled.div<Pick<TeamLinkListProps, 'maxHeight'>>`
  background: #e0dfdf;
  border: 1px solid silver;
  border-radius: 5px;
  max-height: ${(props) => (props.maxHeight ? props.maxHeight : 'initial')};
  overflow: hidden;
  overflow-y: scroll;
`;

const StyledP = styled.p`
  text-align: center;
`;

export default TeamLinkList;
