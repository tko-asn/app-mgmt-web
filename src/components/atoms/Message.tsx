import type { VFC } from 'react';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import Padding from './Padding';

export type MessageProps = {
  messages: string[];
  background?: string;
  handleClick: () => void;
};

const Message: VFC<MessageProps> = ({
  messages,
  background,
  handleClick,
}) => {
  return (
    <StyledContainer background={background}>
      <StyledMessageWrapper>
        {messages.map((message) => (
          <StyledMessage key={message}>
            {message}
          </StyledMessage>
        ))}
      </StyledMessageWrapper>
      <a
        href="/not/navigate"
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <FontAwesomeIcon icon={faCircleXmark} />
      </a>
    </StyledContainer>
  );
};

const StyledContainer = styled(Padding)<Pick<MessageProps, 'background'>>`
  background: ${(props) => (props.background ? props.background : '#e60073')};
  display: flex;
  border-radius: 5px;
  justify-content: space-between;
  opacity: 0.9;
`;

const StyledMessageWrapper = styled.div`
  width: 95%;
`;

const StyledMessage = styled.p`
  color: #fff;
  margin: 0;
  overflow-wrap: break-word;
`;

export default Message;
