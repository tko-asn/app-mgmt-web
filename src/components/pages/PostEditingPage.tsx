import { useEffect, useState, VFC } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { FETCH_SVC, UPDATE_SVC } from '../../queries/svc';
import { AppInput } from '../../utils/types';
import PostForm from '../organisms/PostForm';
import Template from '../templates/Template';
import MainContainer from '../atoms/MainContainer';
import { descriptionField, nameField, urlField } from './props/postForm';

const PostEditingPage: VFC = () => {
  /*
    useLazyQueryの返り値の{ data }を使わずにあえてappというstateを
    PostFormのpostStateとして渡しているのは取得したデータを
    PostFormのstateの型へと整形するため
  */
  const [app, setApp] = useState<AppInput | undefined>();
  const [fetchSvc] = useLazyQuery(FETCH_SVC);
  const [updateSvc] = useMutation(UPDATE_SVC);

  const { svcId } = useParams();

  const submitPostData = async (variables: AppInput) => {
    const { developerId, teamId, ...newVariables } = variables;
    await updateSvc({ variables: { id: svcId, ...newVariables } });
  };

  const buttonProps = {
    title: '保存',
  };
  const formCardProps = {
    titleProps: {
      value: 'アプリを編集',
    },
  };

  useEffect(() => {
    fetchSvc({ variables: { id: svcId } }).then(
      ({ data: { getSvcById: result } }) => {
        const targetApp: AppInput = {
          name: result.name,
          description: result.description,
          icon: result.icon,
          url: result.url,
          developerId: result.developer?.id,
          teamId: result.team?.id,
        };
        setApp(targetApp);
      },
    );
  }, []);

  return (
    <Template>
      <MainContainer>
        {app && (
          <PostForm
            buttonProps={buttonProps}
            descriptionField={descriptionField}
            formCardProps={formCardProps}
            nameField={nameField}
            postState={app}
            submitPostData={submitPostData}
            urlField={urlField}
          />
        )}
      </MainContainer>
    </Template>
  );
};

export default PostEditingPage;
