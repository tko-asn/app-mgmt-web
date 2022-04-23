import moment from 'moment';
import { Apps } from './types';

export const getDatetime = (datetime: string) => {
  return moment(datetime).format('YYYY年MM月D日 HH時mm分');
};

export const createAppList = (
  apps: Apps,
  navigateToAppPage: (appId: string) => void,
) => {
  return apps.map((app) => ({
    handleClick: () => navigateToAppPage(`/app/${app.id}`),
    id: app.id,
    initial: app.name[0],
    src: app.icon,
  }));
};
