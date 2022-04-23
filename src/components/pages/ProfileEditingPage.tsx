import type { VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import CenterContainer from '../atoms/CenterContainer';
import ProfileForm from '../organisms/ProfileForm';
import Template from '../templates/Template';
import { EDIT_PROFILE } from '../../queries/profile';
import { useProfile } from '../../contexts/ProfileContext';
import { ProfileInput } from '../../utils/types';

const ProfileEditingPage: VFC = () => {
  const { profile, setProfile } = useProfile();
  const [editProfile] = useMutation(EDIT_PROFILE);
  const navigate = useNavigate();

  const submitProfileData = async (profileData: ProfileInput) => {
    const {
      data: { updateProfile: result },
    } = await editProfile({ variables: { id: profile.id, ...profileData } });
    setProfile({ ...profile, ...result });
    navigate(`/user/${profile.id}`);
  };

  const profileState = {
    username: profile.username,
    selfIntro: profile.selfIntro || '',
  };

  const buttonProps = {
    title: '保存',
  };

  const formCardProps = {
    titleProps: {
      value: 'プロフィール編集',
    },
  };

  const selfIntroField = {
    labelProps: {
      htmlFor: 'selfIntro',
      value: '自己紹介',
    },
    textAreaProps: {
      id: 'selfIntro',
      placeholder: '自己紹介を入力',
    },
  };

  const usernameField = {
    inputProps: {
      id: 'username',
      placeholder: 'ユーザー名',
    },
    labelProps: {
      htmlFor: 'username',
      value: 'ユーザー名',
    },
  };

  return (
    <Template>
      <CenterContainer>
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
      </CenterContainer>
    </Template>
  );
};

export default ProfileEditingPage;
