import { ChangeEvent, useEffect, useState, VFC } from 'react';
import { useNavigate } from 'react-router-dom';
import Button, { ButtonProps } from '../atoms/Button';
import FormCard, { FormCardProps } from '../molecules/FormCard';
import TextAreaForm, { TextAreaFormProps } from '../molecules/TextAreaForm';
import InputForm, { InputFormProps } from '../molecules/InputForm';
import Padding from '../atoms/Padding';
import { imageHandler, stateSetter } from '../../utils/form';
import { useProfile } from '../../contexts/ProfileContext';
import AppIcon from '../atoms/AppIcon';
import { AppInput } from '../../utils/types';

type InputFieldProps = Pick<InputFormProps, 'inputProps' | 'labelProps'>;

export type PostFormProps = {
  buttonProps: Pick<
    ButtonProps,
    'background' | 'color' | 'fontSize' | 'height' | 'title' | 'width'
  >;
  children?: JSX.Element;
  descriptionField: Pick<TextAreaFormProps, 'labelProps' | 'textAreaProps'>;
  formCardProps: Pick<FormCardProps, 'titleProps' | 'width'>;
  nameField: InputFieldProps;
  postState?: AppInput;
  submitPostData: (variables: AppInput) => Promise<void>;
  teamId?: string;
  urlField: InputFieldProps;
};

const PostForm: VFC<PostFormProps> = ({
  buttonProps,
  children,
  descriptionField,
  formCardProps,
  nameField,
  postState,
  submitPostData,
  teamId,
  urlField,
}) => {
  const {
    profile: { id: profileId },
  } = useProfile();

  const intialPostState = postState || {
    name: '',
    description: '',
    icon: '',
    url: '',
    developerId: profileId,
    teamId: '',
  };

  const [app, setApp] = useState<AppInput>(intialPostState);

  const navigate = useNavigate();

  const setState = stateSetter<AppInput>(app, setApp);

  const submitData = async () => {
    await submitPostData(app);
    navigate('/top');
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { src } = await imageHandler(e);
    setApp({ ...app, icon: src });
  };

  useEffect(() => {
    if (!postState) {
      const appState = teamId
        ? { ...app, teamId, developerId: '' }
        : { ...app, developerId: profileId, teamId: '' };
      setApp(appState);
    }
  }, [profileId, teamId]);

  const nameInputProps = {
    ...nameField.inputProps,
    value: app.name,
  };
  const descriptionTextAreaProps = {
    ...descriptionField.textAreaProps,
    value: app.description,
  };
  const urlInputProps = {
    ...urlField.inputProps,
    value: app.url,
  };

  return (
    <FormCard width="65%" {...formCardProps}>
      <>
        <Padding top="5px">
          <AppIcon
            handleChange={handleChange}
            initial={app.name[0]}
            isAllowedToEdit
            src={app.icon}
          />
        </Padding>
        <Padding top="5px">
          <InputForm
            labelProps={nameField.labelProps}
            inputProps={nameInputProps}
            stateKey="name"
            stateSetter={setState}
          />
        </Padding>
        <Padding top="5px">
          <TextAreaForm
            labelProps={descriptionField.labelProps}
            stateKey="description"
            stateSetter={setState}
            textAreaProps={descriptionTextAreaProps}
          />
        </Padding>
        <Padding top="5px">
          <InputForm
            labelProps={urlField.labelProps}
            inputProps={urlInputProps}
            stateKey="url"
            stateSetter={setState}
          />
        </Padding>
        {children}
        <Padding>
          <Button handleClick={submitData} {...buttonProps} />
        </Padding>
      </>
    </FormCard>
  );
};

export default PostForm;
