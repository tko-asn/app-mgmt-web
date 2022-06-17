import { useEffect, useLayoutEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { DELETE_SVC, FETCH_SVC, UPDATE_SVC } from '../../queries/svc';
import { App, AppFormState, Profile, SimpleTeam } from '../../utils/types';
import PostForm from '../organisms/PostForm';
import Template from '../templates/Template';
import FormCard from '../molecules/FormCard';
import Input from '../atoms/Input';
import { descriptionField, nameField, urlField } from './props/postForm';
import { useMessages } from '../../hooks/useMessages';
import { validateAppDataAndGetErrorMessages } from '../../utils/form';
import Padding from '../atoms/Padding';
import Button from '../atoms/Button';
import { DELETE } from '../../utils/colors';
import { useProfile } from '../../contexts/ProfileContext';
import { SVC_NOT_FOUND } from '../../utils/errors';

const PostEditingPage: VFC = () => {
  type Svc = {
    description?: string;
    createdAt: string;
    updatedAt: string;
    developer?: Profile;
    team?: {
      members: {
        id: string;
      }[];
    } & SimpleTeam;
  } & App;

  const [fetchSvc, { data, error: fetchSvcError }] = useLazyQuery(FETCH_SVC);
  const [updateSvc] = useMutation(UPDATE_SVC);
  const [deleteSvc] = useMutation(DELETE_SVC);
  const { profile } = useProfile();
  const [appNameToDelete, setAppNameToDelete] = useState('');
  const { messages, setErrorMessages, initializeErrorMessages } = useMessages();

  const navigate = useNavigate();

  const { svcId } = useParams();

  const submitPostData = async (variables: AppFormState) => {
    const errors = validateAppDataAndGetErrorMessages(variables);
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }
    const {
      data: {
        updateSvc: { id },
      },
    } = await updateSvc({ variables: { id: svcId, ...variables } });
    navigate(`/app/${id}`);
  };

  const deleteApp = async () => {
    await deleteSvc({ variables: { id: data?.getSvcById.id } });
    navigate('/top');
  };

  const postState = data
    ? {
      name: data?.getSvcById.name,
      description: data?.getSvcById.description,
      icon: data?.getSvcById.icon,
      url: data?.getSvcById.url,
    }
    : undefined;

  const buttonProps = {
    title: '保存',
  };
  const updateFormCardProps = {
    titleProps: {
      value: 'アプリを編集',
    },
  };
  const deleteFormCardTitleProps = {
    value: 'アプリを削除',
  };

  const isYourApp = (app?: Svc) => {
    if (!app) return false;
    if (app.developer) {
      return app.developer.id === profile.id;
    }
    if (app.team) {
      return app.team.members.some(
        (member: { id: string }) => member.id === profile.id,
      );
    }
    return false;
  };

  useEffect(() => {
    if (fetchSvcError && fetchSvcError.message === SVC_NOT_FOUND) {
      navigate('/error/notFound');
    } else if (fetchSvcError) {
      navigate('/error');
    } else if (data?.getSvcById) {
      const redirects = !isYourApp(data?.getSvcById);
      if (redirects) {
        navigate('/error/forbidden');
      }
    }
  }, [fetchSvcError, data]);

  useLayoutEffect(() => {
    fetchSvc({ variables: { id: svcId } });
  }, [svcId]);

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        {isYourApp(data?.getSvcById) && postState && (
          <StyledFormWrapper>
            <PostForm
              buttonProps={buttonProps}
              descriptionField={descriptionField}
              formCardProps={updateFormCardProps}
              nameField={nameField}
              postState={postState}
              submitPostData={submitPostData}
              urlField={urlField}
            />
            {/* フォームの間の空間 */}
            <Padding top="30px" />
            <FormCard titleProps={deleteFormCardTitleProps}>
              <>
                <Padding>
                  <Input
                    id="deleteAppInput"
                    handleChange={setAppNameToDelete}
                    placeholder="削除するにはアプリ名を入力してください"
                    value={appNameToDelete}
                  />
                </Padding>
                <Padding>
                  <Button
                    background={DELETE}
                    handleClick={deleteApp}
                    title="削除する"
                    disabled={data?.getSvcById.name !== appNameToDelete}
                  />
                </Padding>
              </>
            </FormCard>
          </StyledFormWrapper>
        )}
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin: 60px 0;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default PostEditingPage;
