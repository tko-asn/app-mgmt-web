import type { VFC } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import Header, { HeaderProps } from '../organisms/Header';
import { useProfile } from '../../contexts/ProfileContext';
import Message from '../atoms/Message';

export type TemplateProps = {
  children: JSX.Element;
  messages?: {
    errors: string[];
    info: string[];
  };
  deleteErrorMessages?: () => void;
  deleteInfoMessages?: () => void;
};

const Template: VFC<TemplateProps> = ({
  children,
  messages,
  deleteErrorMessages,
  deleteInfoMessages,
}) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { profile } = useProfile();

  const headerProps: HeaderProps = {
    menuName: 'メニュー',
    menus: [],
  };

  if (!isAuthenticated) {
    headerProps.menus.unshift({
      name: 'ログイン',
      handleClick: loginWithRedirect,
    });
  } else {
    headerProps.menus = [
      { name: 'マイページ', to: `/user/${profile.id}` },
      { name: '投稿する', to: '/create/app' },
      { name: 'チーム作成', to: '/create/team' },
      {
        name: 'ログアウト',
        handleClick: () =>
          logout({ returnTo: process.env.REACT_APP_AUTH0_CALLBACK_URL }),
      },
    ];
  }

  return (
    <>
      <Header {...headerProps} />
      <StyledMessageContainer>
        {messages && messages.errors.length > 0 && (
          <Message
            messages={messages.errors}
            handleClick={deleteErrorMessages || (() => {})}
          />
        )}
        {messages && messages.info.length > 0 && (
          <Message
            background="#00bfff"
            messages={messages.info}
            handleClick={deleteInfoMessages || (() => {})}
          />
        )}
      </StyledMessageContainer>
      {children}
    </>
  );
};

const StyledMessageContainer = styled.div`
  position: fixed;
  top: 36px;
  left: 0;
  right: 0;
  margin: auto;
  width: 98%;
  z-index: 999;
`;

export default Template;
