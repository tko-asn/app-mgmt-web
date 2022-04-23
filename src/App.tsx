import type { VFC } from 'react';
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

const App: VFC = () => {
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
    const token = await getAccessTokenSilently();
    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
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
              <Route path="/set/profile" element={<ProtectedRoute component={ProfileEditingPage} />} />
              <Route path="*" element={<Navigate to="/top" replace />} />
            </Routes>
          </GlobalState>
        </ProfileProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
};

export default App;
