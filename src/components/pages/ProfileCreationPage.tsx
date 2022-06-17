import { VFC } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileForm from '../organisms/ProfileForm';
import Template from '../templates/Template';
import { ProfileInput } from '../../utils/types';
import { useMessages } from '../../hooks/useMessages';
import { CREATE_PROFILE } from '../../queries/profile';
import { USER_ALREADY_EXISTS } from '../../utils/errors';
import { buttonProps, selfIntroField, usernameField } from './props/profileForm';

const ProfileCreationPage: VFC = () => {
  const [createProfile] = useMutation(CREATE_PROFILE);
  const { messages, setErrorMessages, initializeErrorMessages } = useMessages();
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const submitProfileData = async (profileData: ProfileInput) => {
    const errors: string[] = [];
    if (!profileData.username) {
      errors.push('ユーザー名を入力してください。');
    }
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }
    const state = query.get('state');
    const userId = query.get('sub');
    if (state && userId) {
      await createProfile({ variables: { userId, ...profileData } }).catch((err) => {
        if (err.message === USER_ALREADY_EXISTS) {
          navigate('/error');
        }
      });
      window.location.assign(`https://${process.env.REACT_APP_AUTH0_DOMAIN}/continue?state=${state}`);
    } else {
      navigate('/error');
    }
  };

  const formCardProps = {
    titleProps: {
      value: 'プロフィール作成',
    },
  };

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        <ProfileForm
          buttonProps={buttonProps}
          formCardProps={formCardProps}
          selfIntroField={selfIntroField}
          submitProfileData={submitProfileData}
          usernameField={usernameField}
        />
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
`;

export default ProfileCreationPage;
