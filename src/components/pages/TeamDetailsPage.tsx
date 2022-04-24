import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import { FETCH_TEAM, ADD_MEMBERS_TO_TEAM, DELETE_INVITEES_FROM_TEAM, DELETE_MEMBERS_FROM_TEAM } from '../../queries/team';
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
  const [addMembersToTeam] = useMutation(ADD_MEMBERS_TO_TEAM);
  const [deleteMembersFromTeam] = useMutation(DELETE_MEMBERS_FROM_TEAM);
  const [deleteInviteesFromTeam] = useMutation(DELETE_INVITEES_FROM_TEAM);
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

  const fetchAndSetTeam = async () => {
    const variables = { id: teamId };
    const { data: { getTeamById: result } } = await fetchTeam({ variables });
    setTeam({ ...team, ...result });
  };

  useEffect(() => {
    fetchAndSetTeam();
  }, [teamId]);

  const memberCards = team.members.map((user) => ({ user }));
  const inviteeCards = team.invitees.map((user) => ({ user }));

  const isYourTeam = () => {
    const members = team.members.map((member) => member.id);
    return members.includes(id);
  };

  const isYourInviter = () => {
    const inviteeIds = team.invitees.map((invitee) => invitee.id);
    return inviteeIds.includes(id);
  };

  const variablesForTeamEditing = { id: teamId, profileIds: [id] };

  const leaveTeam = async () => {
    await deleteMembersFromTeam({ variables: variablesForTeamEditing });
    await fetchAndSetTeam();
  };

  const joinTeam = async () => {
    await addMembersToTeam({ variables: variablesForTeamEditing });
    await fetchAndSetTeam();
  };

  const rejectInvitation = async () => {
    await deleteInviteesFromTeam({ variables: variablesForTeamEditing });
    await fetchAndSetTeam();
  };

  return (
    <Template>
      <StyledContainer>
        {data && (
          <>
            <Padding bottom="25px" left="0px" right="0px">
              <Text size="1.5em" value={team.teamName} weight="bold" />
              {isYourTeam() && (
                <Padding left="0px" right="0px">
                  <Button
                    handleClick={() => navigate(`/edit/team/${teamId}`)}
                    title="チームを編集"
                  />
                </Padding>
              )}
            </Padding>
            <div>
              <Text size={DEFAULT_SIZE} value="メンバー" weight="bold" />
              <Padding bottom="20px" left="0px" right="0px" top="0px">
                <UserCardList
                  cards={memberCards}
                  noCardText="メンバーが存在しません"
                />
                {isYourTeam() && (
                  <Padding left="0px" right="0px">
                    <Button
                      background="#DD0000"
                      handleClick={() => leaveTeam()}
                      title="チームを抜ける"
                    />
                  </Padding>
                )}
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
              {isYourInviter() && (
                <StyledButtonWrapper>
                  <Button
                    background="#DD0000"
                    handleClick={() => rejectInvitation()}
                    title="招待を拒否"
                    width="45%"
                  />
                  <Button
                    background="#0099FF"
                    handleClick={() => joinTeam()}
                    title="チームに参加"
                    width="45%"
                  />
                </StyledButtonWrapper>
              )}
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

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

export default TeamDetailsPage;
