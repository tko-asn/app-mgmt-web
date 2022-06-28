import type { VFC } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import ProfileForm from '../organisms/ProfileForm';
import Template from '../templates/Template';
import { UPDATE_PROFILE } from '../../queries/profile';
import { useProfile } from '../../contexts/ProfileContext';
import { ProfileInput } from '../../utils/types';
import { useMessages } from '../../hooks/useMessages';
import { buttonProps, selfIntroField, usernameField } from './props/profileForm';

const ProfileEditingPage: VFC = () => {
  const { profile, setProfile } = useProfile();
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const navigate = useNavigate();
  const { messages, setErrorMessages, initializeErrorMessages } = useMessages();

  const submitProfileData = async (profileData: ProfileInput) => {
    const errors: string[] = [];
    if (!profileData.username) {
      errors.push('ユーザー名を入力してください。');
    }
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }
    const {
      data: { updateProfile: result },
    } = await updateProfile({ variables: { id: profile.id, ...profileData } });
    setProfile({ ...profile, ...result });
    navigate(`/user/${profile.id}`);
  };

  const profileState = {
    username: profile.username,
    selfIntro: profile.selfIntro || '',
  };

  const formCardProps = {
    titleProps: {
      value: 'プロフィール編集',
    },
  };

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        {profile.id && (
          <ProfileForm
            buttonProps={buttonProps}
            formCardProps={formCardProps}
            profileState={profileState}
            selfIntroField={selfIntroField}
            submitProfileData={submitProfileData}
            usernameField={usernameField}
          />
        )}
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
`;

export default ProfileEditingPage;
