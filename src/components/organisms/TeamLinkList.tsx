import { memo, VFC } from 'react';
import styled from 'styled-components';
import HyperLinkList, { MenuList } from '../molecules/HyperLinkList';

export type TeamLinkListProps = {
  maxHeight?: string;
  menuList: MenuList;
  noTeamText: string;
  width?: string;
};

const TeamLinkList: VFC<TeamLinkListProps> = memo(({ maxHeight, menuList, noTeamText, width }) => {
  const menuListWithColor = menuList.map((menu) => ({ ...menu, color: '#666666' }));
  return (
    <StyledTeamsWrapper maxHeight={maxHeight} width={width}>
      {menuList.length ? (
        <HyperLinkList menuList={menuListWithColor} />
      ) : (
        <StyledP>{noTeamText}</StyledP>
      )}
    </StyledTeamsWrapper>
  );
});

const StyledTeamsWrapper = styled.div<Pick<TeamLinkListProps, 'maxHeight' | 'width'>>`
  background: #e0dfdf;
  border: 1px solid silver;
  border-radius: 5px;
  max-height: ${(props) => (props.maxHeight ? props.maxHeight : 'initial')};
  overflow: hidden;
  overflow-y: scroll;
  width: ${(props) => (props.width ? props.width : 'initial')}
`;

const StyledP = styled.p`
  text-align: center;
`;

export default TeamLinkList;
