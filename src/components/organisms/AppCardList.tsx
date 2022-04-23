import type { VFC } from 'react';
import AppCard, { AppCardProps } from '../molecules/AppCard';
import Ul from '../atoms/Ul';

export type AppCardListProps = {
  apps: AppCardProps[];
};

const AppCardList: VFC<AppCardListProps> = ({ apps }) => {
  const appCards = apps.map((app) => (
    <li key={app.textProps.value}>
      <AppCard {...app} />
    </li>
  ));
  return <Ul list={appCards} />;
};

export default AppCardList;
