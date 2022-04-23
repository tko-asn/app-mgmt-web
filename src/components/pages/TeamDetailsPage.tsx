import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import { FETCH_TEAM } from '../../queries/team';
import { getDatetime } from '../../utils/app';
import { Team } from '../../utils/types';
import Button from '../atoms/Button';
import Padding from '../atoms/Padding';
import Text from '../atoms/Text';
import CardList from '../organisms/CardList';
import UserCardList from '../organisms/UserCardList';
import Template from '../templates/Template';
import { baseCardObj, DEFAULT_SIZE } from './props/detailsPage';

const TeamDetailsPage: VFC = () => {
  const initialState = {
    teamName: '',
    description: '',
    invitees: [],
    members: [],
    createdAt: '',
    updatedAt: '',
  };
  const [team, setTeam] = useState<Team>(initialState);
  const [fetchTeam, { data }] = useLazyQuery(FETCH_TEAM);
  const { teamId } = useParams();
  const {
    profile: { id },
  } = useProfile();
  const navigate = useNavigate();

  const cardList = [
    {
      ...baseCardObj,
      subTextValue: team.description,
      textValue: '説明',
    },
    {
      ...baseCardObj,
      subTextValue: getDatetime(team.createdAt),
      textValue: '作成日',
    },
    {
      ...baseCardObj,
      subTextValue: getDatetime(team.updatedAt),
      textValue: '最終更新日',
    },
  ];

  useEffect(() => {
    const variables = { id: teamId };
    fetchTeam({ variables }).then(({ data: { getTeamById: result } }) => {
      setTeam({ ...team, ...result });
    });
  }, [teamId]);

  const memberCards = team.members.map((user) => ({ user }));
  const inviteeCards = team.invitees.map((user) => ({ user }));

  const isYourTeam = () => {
    const members = team.members.map((member) => member.id);
    return members.includes(id);
  };

  return (
    <Template>
      <StyledContainer>
        {data && (
          <>
            <Padding bottom="25px" left="0px" right="0px">
              <Text size="1.5em" value={team.teamName} weight="bold" />
              {isYourTeam() && (
                <Button
                  handleClick={() => navigate(`/edit/team/${teamId}`)}
                  title="チームを編集"
                />
              )}
            </Padding>
            <div>
              <Text size={DEFAULT_SIZE} value="メンバー" weight="bold" />
              <Padding bottom="20px" left="0px" right="0px" top="0px">
                <UserCardList
                  cards={memberCards}
                  noCardText="メンバーが存在しません"
                />
              </Padding>
            </div>
            <div>
              <Text
                size={DEFAULT_SIZE}
                value="招待しているユーザー"
                weight="bold"
              />
              <Padding bottom="20px" left="0px" right="0px" top="0px">
                <UserCardList
                  cards={inviteeCards}
                  noCardText="ユーザーが存在しません"
                />
              </Padding>
            </div>
            <CardList cardList={cardList} />
          </>
        )}
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  margin: 0 auto;
  padding-top: 35px;
  width: 80%;
`;

export default TeamDetailsPage;
