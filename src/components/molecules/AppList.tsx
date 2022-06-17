import { memo, VFC } from 'react';
import styled from 'styled-components';
import AppIcon, { AppIconProps, DEFAULT_SIZE } from '../atoms/AppIcon';
import Padding from '../atoms/Padding';

type App = {
  id: string;
  appName?: string;
} & AppIconProps;

export type AppListProps = {
  appList: App[];
};

const AppList: VFC<AppListProps> = memo(({ appList }) => {
  const apps = appList.map((app) => {
    const { id, appName, ...appIconProps } = app;
    return (
      // keyを一意の値に変更する
      <Padding bottom="30px" key={id} top="0">
        <StyledLi width={appIconProps.width}>
          <AppIcon {...appIconProps} />
          <StyledAppName>{appName}</StyledAppName>
        </StyledLi>
      </Padding>
    );
  });
  return <StyledUl>{apps}</StyledUl>;
});

const StyledUl = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
`;

const StyledLi = styled.li<Pick<App, 'width'>>`
  width: ${(props) => (props.width ? props.width : DEFAULT_SIZE)};
`;

const StyledAppName = styled.p`
  text-align: center;
  color: #666666;
  margin: 5px 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export default AppList;
