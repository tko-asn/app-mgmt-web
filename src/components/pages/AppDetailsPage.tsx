import { useEffect, useState, VFC } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { useProfile } from '../../contexts/ProfileContext';
import AppCard from '../molecules/AppCard';
import CardList from '../organisms/CardList';
import Padding from '../atoms/Padding';
import Template from '../templates/Template';
import { FETCH_SVC } from '../../queries/svc';
import { getDatetime } from '../../utils/app';
import Card from '../molecules/Card';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { baseCardObj, DEFAULT_SIZE } from './props/detailsPage';
import { Profile, SimpleTeam } from '../../utils/types';

const AppDetailsPage: VFC = () => {
  type Team = {
    members: { id: string }[];
  } & SimpleTeam;

  type AppState = {
    description: string;
    id: string;
    icon: string;
    name: string;
    url: string;
    createdAt: string;
    updatedAt: string;
    developer?: Profile;
    team?: Team;
  };

  const initialState = {
    description: '',
    id: '',
    icon: '',
    name: '',
    url: '',
    createdAt: '',
    updatedAt: '',
    developer: undefined,
    team: undefined,
  };
  const [app, setApp] = useState<AppState>(initialState);
  const { profile } = useProfile();
  const [fetchSvc] = useLazyQuery(FETCH_SVC);
  const { appId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const variables = { id: appId };
    fetchSvc({ variables }).then(({ data: { getSvcById: result } }) => {
      setApp({ ...app, ...result });
    });
  }, [appId]);

  const appCardProps = {
    appIconProps: {
      height: '200px',
      initialSize: '15vw',
      initial: app.name[0],
      src: app.icon,
      width: '200px',
    },
    externalLink: true,
    linkProps: { to: app.url, value: 'アプリを見る' },
    textProps: { value: app.name },
  };

  const baseDeveloperCardObj = {
    imageSize: '70px',
    parentProps: {
      minHeight: '75px',
    },
    sidePadding: '0px',
  };

  const cardList = [
    {
      ...baseCardObj,
      subTextValue: app.description,
      textValue: 'アプリの説明',
    },
    {
      ...baseCardObj,
      subTextValue: getDatetime(app.createdAt),
      textValue: '作成日',
    },
    {
      ...baseCardObj,
      subTextValue: getDatetime(app.updatedAt),
      textValue: '最終更新日',
    },
  ];

  const isYourApp = () => {
    if (app.developer && app.developer.id === profile.id) {
      return true;
    }
    return (
      app.team
      && app.team.members.map((member) => member.id).includes(profile.id)
    );
  };

  return (
    <Template>
      <StyledContainer>
        <AppCard {...appCardProps} />
        {isYourApp() && (
          <Padding left="0px" right="0px">
            <Button
              handleClick={() => navigate(`/edit/app/${appId}`)}
              title="アプリを編集"
            />
          </Padding>
        )}
        <Text size={DEFAULT_SIZE} value="作成者" weight="bold" />
        <Padding bottom="50px" left="0px" right="0px" top="0px">
          {app.developer && (
            <Card
              hasIcon
              linkValue="ユーザーを見る"
              src={app.developer.icon}
              textValue={app.developer.username}
              to={`/user/${app.developer.id}`}
              {...baseDeveloperCardObj}
            />
          )}
          {app.team && (
            <Card
              linkValue="チームを見る"
              textValue={app.team.teamName}
              to={`/team/${app.team.id}`}
              {...baseDeveloperCardObj}
            />
          )}
        </Padding>
        <CardList cardList={cardList} />
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin: 0 auto;
  padding-top: 35px;
  width: 80%;
`;

export default AppDetailsPage;
