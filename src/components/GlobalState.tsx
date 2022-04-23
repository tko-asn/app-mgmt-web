import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, VFC } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { FETCH_OR_CREATE_PROFILE } from '../queries/profile';

export type GlobalStateProps = { children: JSX.Element };

/*
  ContextAPIのstateの値の更新を行うコンポ―ネント
  stateの更新を行うためにはauth0とapolloのProviderの値を使う必要があるため
  App.tsxの子コンポーネントとして作成
*/
const GlobalState: VFC<GlobalStateProps> = ({ children }) => {
  const { user } = useAuth0();
  const { profile, setProfile } = useProfile();
  const [fetchProfile] = useMutation(FETCH_OR_CREATE_PROFILE);

  useEffect(() => {
    if (user) {
      const variables = {
        userId: user.sub,
        username: user[`${process.env.REACT_APP_URL}username`],
      };
      fetchProfile({ variables })
        .then(({ data: { getOrCreateProfile: result } }) => {
          setProfile({ ...profile, ...result });
        });
    }
  }, [user]);

  return children;
};

export default GlobalState;
