import type { VFC } from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import ErrorContent from '../atoms/ErrorContent';
import Template from '../templates/Template';

const ErrorPage: VFC = () => {
  type Error = {
    title: string;
    message: string;
  };

  type Errors = {
    notFound: Error;
    forbidden: Error;
    internalServerError: Error;
  };

  const errors: Errors = {
    notFound: {
      title: 'お探しのページは見つかりませんでした',
      message: 'アクセスしたページは現在利用できない可能性があります。',
    },
    forbidden: {
      title: 'このページにはアクセスできません',
      message: 'お客様のアカウントにはこのページにアクセスするための権限がありません。',
    },
    internalServerError: {
      title: '問題が発生しました',
      message: 'お手数ですが、もう一度やり直してください。',
    },
  };

  return (
    <Template>
      <StyledContainer>
        <Routes>
          <Route
            path="/notFound"
            element={(
              <ErrorContent
                title={errors.notFound.title}
                message={errors.notFound.message}
              />
            )}
          />
          <Route
            path="/forbidden"
            element={(
              <ErrorContent
                title={errors.forbidden.title}
                message={errors.forbidden.message}
              />
            )}
          />
          <Route
            path="*"
            element={(
              <ErrorContent
                title={errors.internalServerError.title}
                message={errors.internalServerError.message}
              />
            )}
          />
        </Routes>
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  color: #666666;
  margin-top: 100px;
  text-align: center;
`;

export default ErrorPage;
