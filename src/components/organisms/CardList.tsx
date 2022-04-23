import type { VFC } from 'react';
import Card, { CardProps } from '../molecules/Card';
import Ul from '../atoms/Ul';

export type CardListProps = {
  cardList: Pick<
    CardProps,
    | 'hasIcon'
    | 'linkValue'
    | 'showIconForm'
    | 'subTextValue'
    | 'textFontSize'
    | 'textValue'
    | 'to'
  >[];
};

const CardList: VFC<CardListProps> = ({ cardList }) => {
  const cards = cardList.map((card) => {
    const cardProps = {
      ...card,
      parentProps: {
        alignItems: 'initial',
        maxWidth: 'none',
        minHeight: '150px',
      },
    };
    return (
      <li key={card.textValue}>
        <Card {...cardProps} />
      </li>
    );
  });

  return <Ul list={cards} />;
};

export default CardList;
