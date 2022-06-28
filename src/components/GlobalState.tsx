import { useLazyQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, VFC } from 'react';
import { useProfile } from '../contexts/ProfileContext';
import { FETCH_PROFILE_BY_USER_ID } from '../queries/profile';

export type GlobalStateProps = { children: JSX.Element };

/*
  ContextAPIのstateの値の更新を行うコンポ―ネント
  stateの更新を行うためにはauth0とapolloのProviderの値を使う必要があるため
  App.tsxの子コンポーネントとして作成
*/
const GlobalState: VFC<GlobalStateProps> = ({ children }) => {
  const { user } = useAuth0();
  const { profile, setProfile } = useProfile();
  const [fetchProfile, { data }] = useLazyQuery(FETCH_PROFILE_BY_USER_ID);

  useEffect(() => {
    if (data?.getProfileByUserId) {
      const { id, username, selfIntro, userId } = data.getProfileByUserId;
      setProfile({ ...profile, id, username, selfIntro, userId });
    }
  }, [data]);

  useEffect(() => {
    if (user && user.sub) {
      /*
        userIdはauth0側から配布されるidで"auth0|"というプレフィックスが
        ついているので取り除く
      */
      fetchProfile({ variables: { userId: user.sub.substring(6) } });
    }
  }, [user]);

  return children;
};

export default GlobalState;
