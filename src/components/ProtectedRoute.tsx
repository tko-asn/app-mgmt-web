import type { VFC } from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';

export type ProtectedRouteProps = {
  component: VFC;
};

const ProtectedRoute: VFC<ProtectedRouteProps> = ({ component }) => {
  const Component = withAuthenticationRequired(component);
  return <Component />;
};

export default ProtectedRoute;
