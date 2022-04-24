import { useEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import {
  Route,
  Routes,
  useParams,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import AppCardList from '../organisms/AppCardList';
import CardList from '../organisms/CardList';
import Profile from '../organisms/Profile';
import SideMenu from '../organisms/SideMenu';
import Template from '../templates/Template';
import { profileProps } from './props/UserPage';
import { FETCH_PROFILE } from '../../queries/profile';
import { useProfile } from '../../contexts/ProfileContext';
import { FETCH_SVCS_BY_PROFILE_ID } from '../../queries/svc';
import Padding from '../atoms/Padding';
import { Apps } from '../../utils/types';
import TeamLinkList from '../organisms/TeamLinkList';

const UserTemplate: VFC = () => {
  type Team = {
    id: string;
    teamName: string;
  };
  type User = {
    id: string;
    username: string;
    icon: string;
    selfIntro: string;
    inviters: Team[];
    teams: Team[];
  };

  const initialState = {
    id: '',
    username: '',
    icon: '',
    selfIntro: '',
    inviters: [],
    teams: [],
  };
  const {
    profile: { icon, selfIntro },
  } = useProfile();

  // 表示するユーザーのデータ
  const [user, setUser] = useState<User>(initialState);
  const [apps, setApps] = useState<Apps>([]);
  const [fetchProfile] = useLazyQuery(FETCH_PROFILE);
  const [fetchSvcs] = useLazyQuery(FETCH_SVCS_BY_PROFILE_ID);
  const { profileId } = useParams();
  const navigate = useNavigate();

  const hyperLinkListProps = {
    activebg: '#3366CC',
    menuList: [
      { name: 'プロフィール', to: `/user/${profileId}` },
      { name: 'アプリ一覧', to: `/user/${profileId}/apps` },
      { name: '所属チーム', to: `/user/${profileId}/teams` },
      { name: '招待されているチーム', to: `/user/${profileId}/inviters` },
    ],
  };

  const newProfileProps = { ...profileProps };
  newProfileProps.card2Props.to = `/apps/${profileId}`;

  const profileMenuProps = [
    {
      subTextValue: selfIntro,
      textValue: 'プロフィール',
    },
  ];

  const teamsMenuProps = user.teams.map((team) => ({
    color: '#000',
    name: team.teamName,
    to: `/team/${team.id}`,
  }));

  const invitersMenuProps = user.inviters.map((inviter) => ({
    color: '#000',
    name: inviter.teamName,
    to: `/team/${inviter.id}`,
  }));

  const appsMenuProps = apps.map((app) => {
    return {
      appIconProps: {
        initial: app.name[0],
        src: app.icon,
      },
      externalLink: true,
      handleClick: () => navigate(`/app/${app.id}`),
      isButton: true,
      linkProps: {
        to: app.url,
        value: 'アプリを見る',
      },
      textProps: {
        value: app.name,
      },
    };
  });

  useEffect(() => {
    Promise.all([
      fetchProfile({ variables: { id: profileId } }),
      fetchSvcs({ variables: { page: 1, profileId } }),
    ]).then((values) => {
      const profileResult = values[0].data.getProfileById;
      const svcResult = values[1].data.getSvcsByProfileId.svcs;
      setUser({ ...user, ...profileResult });
      setApps(svcResult);
    });
  }, [profileId, icon]); // icon編集時にも自分のプロフィールを再度取得

  return (
    <Template>
      <StyledContainer>
        <Padding top="35px" left="0px" right="0px" bottom="0px">
          <Profile
            icon={user.icon}
            profileId={profileId}
            username={user.username}
            {...profileProps}
          />
        </Padding>
        <StyledWrapper>
          <StyledContentWrapper>
            {/* Outletを用いるとコンポ―ネント独自のpropsを渡せないのでRoutesを使用 */}
            <Routes>
              <Route
                path=""
                element={<CardList cardList={profileMenuProps} />}
              />
              <Route
                path="/apps"
                element={<AppCardList apps={appsMenuProps} />}
              />
              <Route
                path="/teams"
                element={(
                  <StyledTeamWrapper>
                    <TeamLinkList
                      menuList={teamsMenuProps}
                      noTeamText="所属しているチームがありません"
                      width="80%"
                    />
                  </StyledTeamWrapper>
                )}
              />
              <Route
                path="/inviters"
                element={(
                  <StyledTeamWrapper>
                    <TeamLinkList
                      menuList={invitersMenuProps}
                      noTeamText="招待されているチームがありません"
                      width="80%"
                    />
                  </StyledTeamWrapper>
                )}
              />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </StyledContentWrapper>
          <SideMenu hyperLinkListProps={hyperLinkListProps} />
        </StyledWrapper>
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 10px; // 適当なheightを指定してflex: 1で引き延ばし（片側のみスクロール）
`;

const StyledContentWrapper = styled.div`
  flex: 1;
  margin-top: 5px;
  overflow-y: scroll;
`;

const StyledTeamWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export default UserTemplate;
