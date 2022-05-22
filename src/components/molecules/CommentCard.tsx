import { useState } from 'react';
import type { VFC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faSpinner, faThumbsDown, faThumbsUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import Icon from '../atoms/Icon';
import Padding from '../atoms/Padding';
import Text from '../atoms/Text';

export type CommentCardProps = {
  content: string;
  datetime: string;
  anchorText?: string;
  handleAnchorClick?: () => void;
  handleUserBlockClick: () => void;
  thumbsUpColor?: string;
  countOfLikes: number;
  handleThumbsUpClick: () => Promise<void>;
  thumbsDownColor?: string;
  countOfDislikes: number;
  handleThumbsDownClick: () => Promise<void>;
  handleFilePenClick?: () => void;
  handleTrashCanClick?: () => void;
  userData: {
    icon: string;
    username: string;
  };
};

const CommentCard: VFC<CommentCardProps> = ({
  anchorText,
  content,
  datetime,
  handleAnchorClick,
  handleUserBlockClick,
  thumbsUpColor,
  countOfLikes,
  handleThumbsUpClick,
  thumbsDownColor,
  countOfDislikes,
  handleThumbsDownClick,
  handleFilePenClick,
  handleTrashCanClick,
  userData,
}) => {
  const [isFavorabilityButtonDisabled, setIsFavorabilityButtonDisabled] = useState(false);
  const { icon, username } = userData;

  const isAllowedToUpdateAndDeleteComment = typeof handleFilePenClick === 'function'
    && typeof handleTrashCanClick === 'function';

  return (
    <StyledContainer>
      <StyledContentWrapper>
        <Text value={content} />
      </StyledContentWrapper>
      <StyledMiddleWrapper>
        <div>
          {anchorText && typeof handleAnchorClick === 'function' && (
            <a
              href="/not/navigate"
              onClick={(e) => {
                e.preventDefault();
                handleAnchorClick();
              }
              }
            >
              {anchorText}
            </a>
          )}
        </div>
        <div>
          <StyledUserContainer onClick={handleUserBlockClick}>
            <Icon imageSize="30px" src={icon} />
            <Padding bottom="0px" top="0px">
              <Text size="0.8em" value={username} />
            </Padding>
          </StyledUserContainer>
          <Text size="0.8em" value={datetime} />
        </div>
      </StyledMiddleWrapper>
      <StyledBottomWrapper>
        <StyledBottomBlock>
          {isFavorabilityButtonDisabled ? (
            <FontAwesomeIcon icon={faSpinner} color="#888888" />
          ) : (
            <>
              <StyledAnchor
                href="/not/navigate"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsFavorabilityButtonDisabled(true);
                  await handleThumbsUpClick();
                  setIsFavorabilityButtonDisabled(false);
                }}
              >
                <FontAwesomeIcon icon={faThumbsUp} color={thumbsUpColor} />
                <StyledFavorabilityCount>{countOfLikes}</StyledFavorabilityCount>
              </StyledAnchor>
              <StyledAnchor
                href="/not/navigate"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsFavorabilityButtonDisabled(true);
                  await handleThumbsDownClick();
                  setIsFavorabilityButtonDisabled(false);
                }}
              >
                <Padding top="0px" right="0px" bottom="0px">
                  <FontAwesomeIcon icon={faThumbsDown} color={thumbsDownColor} />
                  <StyledFavorabilityCount>{countOfDislikes}</StyledFavorabilityCount>
                </Padding>
              </StyledAnchor>
            </>
          )}
        </StyledBottomBlock>
        {isAllowedToUpdateAndDeleteComment && (
          <StyledBottomBlock>
            <StyledAnchor
              href="/not/navigate"
              onClick={(e) => {
                e.preventDefault();
                handleFilePenClick();
              }
              }
            >
              <FontAwesomeIcon icon={faFilePen} />
            </StyledAnchor>
            <StyledAnchor
              href="/not/navigate"
              onClick={(e) => {
                e.preventDefault();
                handleTrashCanClick();
              }
              }
            >
              <Padding top="0px" right="0px" bottom="0px">
                <FontAwesomeIcon icon={faTrashCan} />
              </Padding>
            </StyledAnchor>
          </StyledBottomBlock>
        )}
      </StyledBottomWrapper>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  border-bottom: 1px solid gray;
`;

const StyledContentWrapper = styled.div`
  padding: 20px 0;
`;

const StyledMiddleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledUserContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
`;

const StyledBottomWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
`;

const StyledBottomBlock = styled.div`
  display: flex;
  align-items: center;
`;

const StyledAnchor = styled.a`
  color: #888888;
  text-decoration: none;
`;

const StyledFavorabilityCount = styled.span`
  padding-left: 5px;
`;

export default CommentCard;
