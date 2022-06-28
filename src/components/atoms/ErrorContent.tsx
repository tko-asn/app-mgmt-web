import type { VFC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export type ErrorContentProps = {
  title: string;
  message: string;
};

const ErrorContent: VFC<ErrorContentProps> = ({ title, message }) => {
  return (
    <StyledContainer>
      <h1>{title}</h1>
      <p>{message}</p>
      <div>
        <Link to="/top">ホームへ戻る</Link>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  color: #666666;
  margin-top: 100px;
  text-align: center;
`;

export default ErrorContent;
