import { CardProps } from '../../molecules/Card';

export const cardProps: Pick<
  CardProps,
  | 'linkValue'
  | 'parentProps'
  | 'showIconForm'
  | 'subTextValue'
  | 'textValue'
  | 'to'
> = {
  linkValue: 'アカウント',
  textValue: 'ユーザー名',
  to: '/user',
};
