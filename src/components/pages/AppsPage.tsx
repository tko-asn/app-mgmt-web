import { useEffect, useMemo, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import styled from 'styled-components';
import { FETCH_PROFILE } from '../../queries/profile';
import Template from '../templates/Template';
import { FETCH_SVCS_BY_PROFILE_ID } from '../../queries/svc';
import Card from '../molecules/Card';
import Padding from '../atoms/Padding';
import AppList from '../molecules/AppList';
import { createAppList } from '../../utils/app';
import { PROFILE_NOT_FOUND } from '../../utils/errors';

const AppsPage: VFC = () => {
  const { profileId } = useParams();
  const [
    fetchProfile,
    { data: profileData, error: fetchProfileError },
  ] = useLazyQuery(FETCH_PROFILE);
  const [fetchSvcs, { data: appsData }] = useLazyQuery(FETCH_SVCS_BY_PROFILE_ID);
  const navigate = useNavigate();

  const cardProps = useMemo(() => ({
    linkValue: 'ユーザーを見る',
    src: profileData?.getProfileById.icon,
    textValue: profileData?.getProfileById.username,
    to: `/user/${profileId}`,
  }), [profileData, profileId]);

  const appList = useMemo(() => (
    appsData?.getSvcsByProfileId.svcs
      ? createAppList(appsData?.getSvcsByProfileId.svcs, navigate)
      : []
  ), [appsData]);

  useEffect(() => {
    if (fetchProfileError) {
      if (fetchProfileError.message === PROFILE_NOT_FOUND) {
        navigate('/error/notFound');
      } else {
        navigate('/error');
      }
    }
  }, [fetchProfileError]);

  useEffect(() => {
    Promise.all([
      fetchProfile({ variables: { id: profileId } }),
      fetchSvcs({ variables: { page: 1, profileId } }),
    ]);
  }, [profileId]);

  return (
    <Template>
      <StyledContainer>
        <StyledWrapper>
          <Card hasIcon {...cardProps} />
          <Padding top="30px">
            <AppList appList={appList} />
          </Padding>
        </StyledWrapper>
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin-top: 100px;
`;

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
`;

export default AppsPage;
