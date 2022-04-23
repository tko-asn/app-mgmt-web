import { useEffect, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import styled from 'styled-components';
import { FETCH_PROFILE } from '../../queries/profile';
import CenterContainer from '../atoms/CenterContainer';
import Template from '../templates/Template';
import { FETCH_SVCS_BY_PROFILE_ID } from '../../queries/svc';
import Card from '../molecules/Card';
import Padding from '../atoms/Padding';
import AppList from '../molecules/AppList';
import { Apps } from '../../utils/types';
import { createAppList } from '../../utils/app';

const AppsPage: VFC = () => {
  const initialState = {
    icon: '',
    username: '',
  };
  type AppsState = Apps;

  const [user, setUser] = useState(initialState);
  const { profileId } = useParams();
  const [fetchProfile] = useLazyQuery(FETCH_PROFILE);
  const [apps, setApps] = useState<AppsState>([]);
  const [fetchSvcs] = useLazyQuery(FETCH_SVCS_BY_PROFILE_ID);
  const navigate = useNavigate();

  const cardProps = {
    linkValue: 'ユーザーを見る',
    src: user.icon,
    textValue: user.username,
    to: `/user/${profileId}`,
  };

  const appList = createAppList(apps, navigate);

  useEffect(() => {
    Promise.all([
      fetchProfile({ variables: { id: profileId } }),
      fetchSvcs({ variables: { page: 1, profileId } }),
    ]).then((values) => {
      const profileResult = values[0].data.getProfileById;
      const svcResult = values[1].data.getSvcsByProfileId.svcs;
      setUser(profileResult);
      setApps(svcResult);
    });
  }, [profileId]);

  return (
    <Template>
      <CenterContainer>
        <StyledDiv>
          <Card hasIcon {...cardProps} />
          <Padding top="30px">
            <AppList appList={appList} />
          </Padding>
        </StyledDiv>
      </CenterContainer>
    </Template>
  );
};

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
`;

export default AppsPage;
