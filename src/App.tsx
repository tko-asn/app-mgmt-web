import { useLayoutEffect, useState, VFC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/link-context';
import { useAuth0 } from '@auth0/auth0-react';
import AppDetailsPage from './components/pages/AppDetailsPage';
import AppsPage from './components/pages/AppsPage';
import ProfileCreationPage from './components/pages/ProfileCreationPage';
import ProfileEditingPage from './components/pages/ProfileEditingPage';
import UserPage from './components/pages/UserPage';
import TopPage from './components/pages/TopPage';
import GlobalState from './components/GlobalState';
import { ProfileProvider } from './contexts/ProfileContext';
import PostCreationPage from './components/pages/PostCreationPage';
import TeamCreationPage from './components/pages/TeamCreationPage';
import ProtectedRoute from './components/ProtectedRoute';
import TeamEditingPage from './components/pages/TeamEditingPage';
import PostEditingPage from './components/pages/PostEditingPage';
import TeamDetailsPage from './components/pages/TeamDetailsPage';
import ErrorPage from './components/pages/ErrorPage';

const App: VFC = () => {
  const [token, setToken] = useState('');
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_API_ENDPOINT,
  });

  const authLink = setContext(async (_, { headers }) => {
    /*
      未ログイン状態でgetAccessTokenSilently()を使用してAPIへアクセスすると
      Login Requiredエラーが発生するので未ログインの場合は
      getAccessTokenSilently()を使用しない
    */
    if (!isAuthenticated) {
      return { headers };
    }
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : { authorization: '' }),
      },
    };
  });

  const cache = new InMemoryCache({
    typePolicies: {
      Comment: {
        fields: {
          likes: {
            merge(existing, incoming) {
              return incoming;
            },
          },
          dislikes: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  useLayoutEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((result) => {
        setToken(result);
      });
    }
  }, [isAuthenticated]);

  /*
    isAuthenticatedの値がtrueになるタイミングの関係で子コンポーネントにおいて
    トークンがセットされていない状態でトークンが必要なAPIのルートにリクエストを
    送ってしまうことがある
    そのような場合、"No authorization token was found" というエラーが表示されるので、
    ログイン済みの場合はtokenが完全にセットされてからコンポーネントを描画するようにする
  */
  const rendersElements = isAuthenticated ? token.length > 0 : true;

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        {rendersElements && (
          <ProfileProvider>
            <GlobalState>
              <Routes>
                <Route path="/top/*" element={<TopPage />} />
                <Route path="/create/app" element={<ProtectedRoute component={PostCreationPage} />} />
                <Route path="/edit/app/:svcId" element={<ProtectedRoute component={PostEditingPage} />} />
                <Route path="/create/team" element={<ProtectedRoute component={TeamCreationPage} />} />
                <Route path="/edit/team/:teamId" element={<ProtectedRoute component={TeamEditingPage} />} />
                <Route path="/apps/:profileId" element={<AppsPage />} />
                <Route path="/app/:appId" element={<AppDetailsPage />} />
                <Route path="/team/:teamId" element={<TeamDetailsPage />} />
                <Route path="/user/:profileId/*" element={<UserPage />} />
                <Route path="/create/profile" element={<ProfileCreationPage />} />
                <Route path="/edit/profile" element={<ProtectedRoute component={ProfileEditingPage} />} />
                <Route path="/error/*" element={<ErrorPage />} />
                <Route path="/" element={<Navigate to="/top" replace />} />
                <Route path="*" element={<Navigate to="/error/notFound" replace />} />
              </Routes>
            </GlobalState>
          </ProfileProvider>
        )}
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
