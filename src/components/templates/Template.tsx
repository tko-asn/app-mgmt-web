import type { VFC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Header, { HeaderProps } from '../organisms/Header';
import { useProfile } from '../../contexts/ProfileContext';

export type TemplateProps = {
  children: JSX.Element;
};

const Template: VFC<TemplateProps> = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { profile } = useProfile();

  const headerProps: HeaderProps = {
    menuName: 'メニュー',
    menus: [],
  };

  if (!isAuthenticated) {
    headerProps.menus.unshift({
      name: 'ログイン',
      handleClick: () => loginWithRedirect(),
    });
  } else {
    headerProps.menus = [
      { name: 'マイページ', to: `/user/${profile.id}` },
      { name: '投稿する', to: '/create/app' },
      { name: 'チーム作成', to: '/create/team' },
      {
        name: 'ログアウト',
        handleClick: () => logout({ returnTo: process.env.REACT_APP_AUTH0_CALLBACK_URL }),
      },
    ];
  }

  return (
    <>
      <Header {...headerProps} />
      {children}
    </>
  );
};

export default Template;
