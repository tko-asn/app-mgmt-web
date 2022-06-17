import { memo, VFC } from 'react';
import styled from 'styled-components';
import { Profile } from '../../utils/types';
import Button, { ButtonProps } from '../atoms/Button';
import Card from '../molecules/Card';

type Cards = {
  user: Profile;
  button?: ButtonProps;
}[];

export type UserCardListProps = {
  cardMinHeight?: string;
  cards: Cards;
  noCardText?: string;
};

const UserCardList: VFC<UserCardListProps> = memo(({
  cardMinHeight,
  cards,
  noCardText,
}) => {
  const cardParentProps = {
    minHeight: cardMinHeight || '40px',
  };

  return (
    <StyledUserCardList>
      {!cards.length && <StyledP>{noCardText}</StyledP>}
      {cards.map((card) => (
        <StyledUserCard key={card.user.id}>
          <Card
            hasIcon
            imageSize="30px"
            parentProps={cardParentProps}
            sidePadding="0px"
            src={card.user.icon}
            textFontSize="0.9em"
            textValue={card.user.username}
          />
          {card.button && <Button {...card.button} />}
        </StyledUserCard>
      ))}
    </StyledUserCardList>
  );
});

const StyledUserCardList = styled.div`
  background: #f7f3f3;
  border: 1px solid silver;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: scroll;
  padding: 0 10px;
`;

const StyledUserCard = styled.div`
  align-items: center;
  border-bottom: 1px solid #e2e2e2;
  display: flex;
  justify-content: space-between;
`;

const StyledP = styled.p`
  font-size: 0.9em;
  text-align: center;
`;

export default UserCardList;
