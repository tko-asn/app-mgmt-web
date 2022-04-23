import type { VFC } from 'react';
import styled from 'styled-components';
import AppIcon, { AppIconProps } from '../atoms/AppIcon';
import Padding from '../atoms/Padding';

type AppIcons = {
  id: string;
} & AppIconProps;

export type AppListProps = {
  appList: AppIcons[];
};

const AppList: VFC<AppListProps> = ({ appList }) => {
  const apps = appList.map((app) => (
    // keyを一意の値に変更する
    <Padding bottom="30px" key={app.id} top="0">
      <li>
        <AppIcon {...app} />
      </li>
    </Padding>
  ));
  return <StyledUl>{apps}</StyledUl>;
};

const StyledUl = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
`;

export default AppList;
