import { useState, VFC } from 'react';
import Button, { ButtonProps } from '../atoms/Button';
import FormCard, { FormCardProps } from '../molecules/FormCard';
import InputForm, { InputFormProps } from '../molecules/InputForm';
import Padding from '../atoms/Padding';
import TextAreaForm, { TextAreaFormProps } from '../molecules/TextAreaForm';
import { stateSetter } from '../../utils/form';
import { ProfileInput } from '../../utils/types';

export type ProfileFormProps = {
  buttonProps: Pick<
    ButtonProps,
    'background' | 'color' | 'fontSize' | 'height' | 'title' | 'width'
  >;
  formCardProps: Pick<FormCardProps, 'titleProps' | 'width'>;
  profileState?: ProfileInput;
  selfIntroField: Pick<TextAreaFormProps, 'labelProps' | 'textAreaProps'>;
  submitProfileData: (profileData: ProfileInput) => Promise<void>;
  usernameField: Pick<InputFormProps, 'inputProps' | 'labelProps'>;
};

const ProfileForm: VFC<ProfileFormProps> = ({
  buttonProps,
  formCardProps,
  profileState,
  selfIntroField,
  submitProfileData,
  usernameField,
}) => {
  const initialState = profileState || {
    username: '',
    selfIntro: '',
  };

  const [profileData, setProfileData] = useState<ProfileInput>(initialState);

  type ProfileData = typeof profileData;

  const setState = stateSetter<ProfileData>(profileData, setProfileData);

  const usernameInputProps = {
    ...usernameField.inputProps,
    value: profileData.username,
  };
  const selfIntroTextAreaProps = {
    ...selfIntroField.textAreaProps,
    value: profileData.selfIntro,
  };

  return (
    <FormCard {...formCardProps}>
      <>
        <Padding top="5">
          <InputForm
            inputProps={usernameInputProps}
            labelProps={usernameField.labelProps}
            stateKey="username"
            stateSetter={setState}
          />
        </Padding>
        <Padding top="5">
          <TextAreaForm
            labelProps={selfIntroField.labelProps}
            stateKey="selfIntro"
            stateSetter={setState}
            textAreaProps={selfIntroTextAreaProps}
          />
        </Padding>
        <Padding>
          <Button handleClick={() => submitProfileData(profileData)} {...buttonProps} />
        </Padding>
      </>
    </FormCard>
  );
};

export default ProfileForm;
