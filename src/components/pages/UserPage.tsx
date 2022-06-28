import { useEffect, useLayoutEffect, useMemo, VFC } from 'react';
import styled from 'styled-components';
import {
  Route,
  Routes,
  useParams,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import CardList from '../organisms/CardList';
import Profile from '../organisms/Profile';
import SideMenu from '../organisms/SideMenu';
import Template from '../templates/Template';
import { FETCH_PROFILE } from '../../queries/profile';
import { useProfile } from '../../contexts/ProfileContext';
import { FETCH_SVCS_BY_PROFILE_ID } from '../../queries/svc';
import Padding from '../atoms/Padding';
import { App, SimpleTeam } from '../../utils/types';
import TeamLinkList from '../organisms/TeamLinkList';
import { SIDE_MENU_ACTIVEBG, SIDE_MENU_LINK } from '../../utils/colors';
import Ul from '../atoms/Ul';
import AppCard, { AppCardProps } from '../molecules/AppCard';
import { getDatetime } from '../../utils/app';
import { PROFILE_NOT_FOUND } from '../../utils/errors';

const UserTemplate: VFC = () => {
  type AppLi = {
    id: string;
    appCardProps: AppCardProps;
  };

  const {
    profile: { icon },
  } = useProfile();
  const [
    fetchProfile,
    { data: profileData, error: fetchProfileError },
  ] = useLazyQuery(FETCH_PROFILE);
  const [fetchSvcs, { data: appsData }] = useLazyQuery(
    FETCH_SVCS_BY_PROFILE_ID,
  );
  const { profileId } = useParams();
  const navigate = useNavigate();

  const profileProps = useMemo(() => ({
    icon: profileData?.getProfileById.icon,
    profileId,
    username: profileData?.getProfileById.username,
    card1Props: {
      to: '/edit/profile',
    },
    card2Props: {
      subTextValue: '0',
      textValue: 'アプリ',
      to: '/apps',
    },
    iconFormProps: {
      className: '',
      iconProps: {
        imageSize: '150px',
      },
    },
  }), [profileData, profileId]);

  const hyperLinkListProps = useMemo(
    () => ({
      activebg: SIDE_MENU_ACTIVEBG,
      menuList: [
        { name: 'プロフィール', to: `/user/${profileId}`, color: SIDE_MENU_LINK },
        { name: 'アプリ一覧', to: `/user/${profileId}/apps`, color: SIDE_MENU_LINK },
        { name: '所属チーム', to: `/user/${profileId}/teams`, color: SIDE_MENU_LINK },
        { name: '招待されているチーム', to: `/user/${profileId}/inviters`, color: SIDE_MENU_LINK },
      ],
    }),
    [profileId],
  );

  const newProfileProps = { ...profileProps };
  newProfileProps.card2Props.to = `/apps/${profileId}`;

  const profileMenuProps = useMemo(() => {
    if (profileData) {
      const { selfIntro, createdAt } = profileData.getProfileById;
      return [
        {
          subTextValue: selfIntro || '自己紹介は未記入です。',
          textValue: 'プロフィール',
        },
        {
          subTextValue: getDatetime(createdAt),
          textValue: 'アカウント開設日',
        },
      ];
    }
    return [];
  }, [profileData]);

  const teamsMenuProps = useMemo(
    () => (
      profileData?.getProfileById.teams
        ? profileData?.getProfileById.teams.map((team: SimpleTeam) => ({
          color: '#000',
          name: team.teamName,
          to: `/team/${team.id}`,
        }))
        : []),
    [profileData?.getProfileById.teams],
  );

  const invitersMenuProps = useMemo(
    () => (
      profileData?.getProfileById.inviters
        ? profileData?.getProfileById.inviters.map((inviter: SimpleTeam) => ({
          color: '#000',
          name: inviter.teamName,
          to: `/team/${inviter.id}`,
        }))
        : []),
    [profileData?.getProfileById.inviters],
  );

  const appCards = appsData?.getSvcsByProfileId.svcs
    ? appsData?.getSvcsByProfileId.svcs.map((app: App) => {
      return {
        id: app.id,
        appCardProps: {
          appIconProps: {
            initial: app.name[0],
            src: app.icon,
          },
          externalLink: true,
          handleClick: () => navigate(`/app/${app.id}`),
          isButton: true,
          textProps: {
            value: app.name,
          },
        },
      };
    })
    : [];

  useEffect(() => {
    if (fetchProfileError) {
      if (fetchProfileError.message === PROFILE_NOT_FOUND) {
        navigate('/error/notFound');
      } else {
        navigate('/error');
      }
    }
  }, [fetchProfileError]);

  useLayoutEffect(() => {
    Promise.all([
      fetchProfile({ variables: { id: profileId } }),
      fetchSvcs({ variables: { page: 1, profileId } }),
    ]);
  }, [profileId, icon]); // icon編集時にも自分のプロフィールを再度取得

  return (
    <Template>
      <StyledContainer>
        <Padding top="35px" left="0px" right="0px" bottom="0px">
          <Profile {...profileProps} />
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
                element={(
                  <Ul>
                    {appCards.map((appCard: AppLi) => (
                      <li key={appCard.id}>
                        <AppCard {...appCard.appCardProps} />
                      </li>
                    ))}
                  </Ul>
                )}
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
          <SideMenu maxWidth="250px" hyperLinkListProps={hyperLinkListProps} />
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
