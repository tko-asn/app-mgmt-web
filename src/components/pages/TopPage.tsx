import { useLazyQuery } from '@apollo/client';
import { useEffect, useLayoutEffect, useMemo, VFC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import { FETCH_SVCS, FETCH_SVCS_BY_PROFILE_ID } from '../../queries/svc';
import { createAppList } from '../../utils/app';
import { SimpleTeam } from '../../utils/types';
import AppList from '../molecules/AppList';
import SideMenu from '../organisms/SideMenu';
import Template from '../templates/Template';
import { FETCH_TEAMS_BY_MEMBER_ID } from '../../queries/team';
import TeamLinkList from '../organisms/TeamLinkList';
import { SIDE_MENU_ACTIVEBG, SIDE_MENU_LINK } from '../../utils/colors';

const TopPage: VFC = () => {
  const [fetchSvcs, { data: latestAppData }] = useLazyQuery(FETCH_SVCS);
  const [fetchTeamsByMemberId, { data: myTeamData }] = useLazyQuery(FETCH_TEAMS_BY_MEMBER_ID);
  const { profile } = useProfile();
  const [fetchSvcsByProfileId, { data: myAppData }] = useLazyQuery(FETCH_SVCS_BY_PROFILE_ID);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const latestAppList = useMemo(() => (latestAppData?.getSvcs
    ? createAppList(latestAppData?.getSvcs.svcs, navigate)
    : []), [latestAppData?.getSvcs.svcs]);
  const myAppList = useMemo(() => (myAppData?.getSvcsByProfileId
    ? createAppList(myAppData?.getSvcsByProfileId.svcs, navigate)
    : []), [myAppData?.getSvcsByProfileId.svcs]);

  const baseMenuList = [{ name: 'ホーム', to: '/top', color: SIDE_MENU_LINK }];
  const additionalMenus = [
    { name: '自分のアプリ', to: '/top/myapp', color: SIDE_MENU_LINK },
    { name: '自分のチーム', to: '/top/myteam', color: SIDE_MENU_LINK },
  ];

  const hyperLinkListProps = useMemo(() => ({
    activebg: SIDE_MENU_ACTIVEBG,
    menuList: isAuthenticated
      ? baseMenuList.concat(additionalMenus)
      : baseMenuList,
  }), [isAuthenticated]);

  const teams = useMemo(() => (myTeamData?.getTeamsByMemberId
    ? myTeamData?.getTeamsByMemberId.teams.map((team: SimpleTeam) => ({
      color: '#000',
      name: team.teamName,
      handleClick: () => navigate(`/team/${team.id}`),
      height: '40px',
    })) : []), [myTeamData]);

  useLayoutEffect(() => {
    fetchSvcs({ variables: { page: 1 } });
  }, []);

  useEffect(() => {
    const fetchApps = async () => {
      if (isAuthenticated && profile.id) {
        await Promise.all([
          fetchSvcsByProfileId({
            variables: { page: 1, profileId: profile.id },
          }),
          fetchTeamsByMemberId({
            variables: { page: 1, memberId: profile.id },
          }),
        ]);
      }
    };
    fetchApps();
  }, [isAuthenticated, profile.id]);

  return (
    <Template>
      <StyledContainer>
        <StyledWrapper>
          <SideMenu width="25%" maxWidth="250px" hyperLinkListProps={hyperLinkListProps} />
          <StyledContentContainer>
            <StyledContentWrapper>
              <Routes>
                <Route path="" element={<AppList appList={latestAppList} />} />
                <Route
                  path="/myapp"
                  element={<AppList appList={myAppList} />}
                />
                <Route
                  path="/myteam"
                  element={(
                    <TeamLinkList
                      menuList={teams}
                      noTeamText="所属しているチームがありません"
                    />
                  )}
                />
                <Route path="*" element={<Navigate to="" replace />} />
              </Routes>
            </StyledContentWrapper>
          </StyledContentContainer>
        </StyledWrapper>
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex: 1;
  margin-top: 30px;
`;

const StyledContentContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
`;

const StyledContentWrapper = styled.div`
  margin: 50px auto 0;
  width: 80%;
`;

export default TopPage;
