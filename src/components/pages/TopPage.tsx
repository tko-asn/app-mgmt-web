import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, VFC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import { FETCH_SVCS, FETCH_SVCS_BY_PROFILE_ID } from '../../queries/svc';
import { createAppList } from '../../utils/app';
import { Apps, SimpleTeam } from '../../utils/types';
import AppList from '../molecules/AppList';
import SideMenu from '../organisms/SideMenu';
import Template from '../templates/Template';
import { FETCH_TEAMS_BY_MEMBER_ID } from '../../queries/team';
import TeamLinkList from '../organisms/TeamLinkList';

const TopPage: VFC = () => {
  const initialState = {
    latestApps: [],
    myApps: [],
    myTeams: [],
  };

  type TopDataState = {
    latestApps: Apps;
    myApps: Apps;
    myTeams: SimpleTeam[];
  };
  const [topData, setTopData] = useState<TopDataState>(initialState);
  const [fetchSvcs] = useLazyQuery(FETCH_SVCS);
  const [fetchTeamsByMemberId] = useLazyQuery(FETCH_TEAMS_BY_MEMBER_ID);
  const { profile } = useProfile();
  const [fetchSvcsByProfileId] = useLazyQuery(FETCH_SVCS_BY_PROFILE_ID);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  const latestAppList = createAppList(topData.latestApps, navigate);
  const myAppList = createAppList(topData.myApps, navigate);

  const hyperLinkListProps = {
    activebg: '#244383',
    menuList: [{ name: 'ホーム', to: '/top' }],
  };

  const getTeamMenu = (teams: SimpleTeam[]) => {
    return teams.map((team: SimpleTeam) => ({
      color: '#000',
      name: team.teamName,
      handleClick: () => navigate(`/team/${team.id}`),
      height: '40px',
    }));
  };

  if (isAuthenticated) {
    const additionalMenus = [
      { name: '自分のアプリ', to: '/top/myapp' },
      { name: '自分のチーム', to: '/top/myteam' },
    ];
    hyperLinkListProps.menuList = (
      hyperLinkListProps.menuList.concat(additionalMenus));
  }

  useEffect(() => {
    const fetchApps = async () => {
      const newTopData = { ...topData };
      if (isAuthenticated && profile.id) {
        const values = await Promise.all([
          fetchSvcsByProfileId({
            variables: { page: 1, profileId: profile.id },
          }),
          fetchTeamsByMemberId({
            variables: { page: 1, memberId: profile.id },
          }),
        ]);
        newTopData.myApps = values[0].data.getSvcsByProfileId.svcs;
        newTopData.myTeams = values[1].data.getTeamsByMemberId.teams;
      }
      const {
        data: {
          getSvcs: { svcs: latestApps },
        },
      } = await fetchSvcs({ variables: { page: 1 } });
      setTopData({ ...newTopData, latestApps }); // 一括で保存
    };
    fetchApps();
  }, [isAuthenticated, profile.id]);

  return (
    <Template>
      <StyledContainer>
        <StyledWrapper>
          <SideMenu width="25%" hyperLinkListProps={hyperLinkListProps} />
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
                      menuList={getTeamMenu(topData.myTeams)}
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
