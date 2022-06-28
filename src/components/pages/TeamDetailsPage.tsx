import { useLazyQuery, useMutation } from '@apollo/client';
import { useMemo, useEffect, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useProfile } from '../../contexts/ProfileContext';
import { useMessages } from '../../hooks/useMessages';
import {
  FETCH_TEAM,
  ADD_MEMBERS_TO_TEAM,
  DELETE_INVITEES_FROM_TEAM,
  DELETE_MEMBERS_FROM_TEAM,
} from '../../queries/team';
import { getDatetime } from '../../utils/app';
import { ACCEPT, DELETE } from '../../utils/colors';
import { NO_TEAM_MEMBERS, TEAM_NOT_FOUND } from '../../utils/errors';
import { Profile } from '../../utils/types';
import Button from '../atoms/Button';
import Padding from '../atoms/Padding';
import Text from '../atoms/Text';
import CardList from '../organisms/CardList';
import UserCardList from '../organisms/UserCardList';
import Template from '../templates/Template';
import { baseCardObj, DEFAULT_SIZE } from './props/detailsPage';

const TeamDetailsPage: VFC = () => {
  const [fetchTeam, { data, loading, error: fetchTeamError }] = useLazyQuery(FETCH_TEAM);
  const [addMembersToTeam] = useMutation(ADD_MEMBERS_TO_TEAM);
  const [deleteMembersFromTeam] = useMutation(DELETE_MEMBERS_FROM_TEAM);
  const [deleteInviteesFromTeam] = useMutation(DELETE_INVITEES_FROM_TEAM);
  const { teamId } = useParams();
  const {
    profile: { id },
  } = useProfile();
  const navigate = useNavigate();
  const { messages, addErrorMessage, initializeErrorMessages } = useMessages();

  const cardList = useMemo(
    () => [
      {
        ...baseCardObj,
        subTextValue: data?.getTeamById.description,
        textValue: '説明',
      },
      {
        ...baseCardObj,
        subTextValue: getDatetime(data?.getTeamById.createdAt),
        textValue: '作成日',
      },
      {
        ...baseCardObj,
        subTextValue: getDatetime(data?.getTeamById.updatedAt),
        textValue: '最終更新日',
      },
    ],
    [data?.getTeamById],
  );

  useEffect(() => {
    if (fetchTeamError) {
      if (fetchTeamError.message === TEAM_NOT_FOUND) {
        navigate('/error/notFound');
      } else {
        navigate('/error');
      }
    }
  }, [fetchTeamError]);

  useEffect(() => {
    fetchTeam({ variables: { id: teamId } });
  }, [teamId]);

  const memberCards = useMemo(
    () =>
      (data?.getTeamById.members
        ? data?.getTeamById.members.map((user: Profile) => ({ user }))
        : []),
    [data?.getTeamById.members],
  );
  const inviteeCards = useMemo(
    () =>
      (data?.getTeamById.invitees
        ? data?.getTeamById.invitees.map((user: Profile) => ({ user }))
        : []),
    [data?.getTeamById.invitees],
  );

  const isYourTeam = () => {
    const members = data?.getTeamById.members
      ? data?.getTeamById.members.map((member: Profile) => member.id)
      : [];
    return members.includes(id);
  };

  const isYourInviter = () => {
    const inviteeIds = data?.getTeamById.invitees
      ? data?.getTeamById.invitees.map((invitee: Profile) => invitee.id)
      : [];
    return inviteeIds.includes(id);
  };

  const variablesForTeamEditing = { id: teamId, profileIds: [id] };

  const leaveTeam = async () => {
    await deleteMembersFromTeam({ variables: variablesForTeamEditing }).catch(
      (err) => {
        if (err.message === NO_TEAM_MEMBERS) {
          addErrorMessage('チームには最低でも1名のメンバーが必要です。');
        }
      },
    );
    await fetchTeam({ variables: { id: teamId } });
  };

  const joinTeam = async () => {
    await addMembersToTeam({ variables: variablesForTeamEditing });
    await fetchTeam({ variables: { id: teamId } });
  };

  const rejectInvitation = async () => {
    await deleteInviteesFromTeam({ variables: variablesForTeamEditing });
    await fetchTeam({ variables: { id: teamId } });
  };

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        {data && !loading && (
          <>
            <Padding bottom="25px" left="0px" right="0px">
              <Text
                size="1.5em"
                value={data?.getTeamById.teamName}
                weight="bold"
              />
              {isYourTeam() && (
                <Padding left="0px" right="0px">
                  <Button
                    fontSize="0.9em"
                    handleClick={() => navigate(`/edit/team/${teamId}`)}
                    height="30px"
                    width="110px"
                    title="チームを編集"
                  />
                </Padding>
              )}
            </Padding>
            <div>
              <Text size={DEFAULT_SIZE} value="メンバー" weight="bold" />
              <Padding left="0px" right="0px" top="0px">
                <UserCardList
                  cards={memberCards}
                  noCardText="メンバーが存在しません"
                />
              </Padding>
              {isYourTeam() && (
                <StyledButtonWrapper>
                  <Button
                    background={DELETE}
                    fontSize="0.9em"
                    handleClick={() => leaveTeam()}
                    height="30px"
                    title="チームを抜ける"
                    width="130px"
                    disabled={data?.getTeamById.members.length === 1}
                  />
                </StyledButtonWrapper>
              )}
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
                    background={DELETE}
                    fontSize="0.9em"
                    handleClick={() => rejectInvitation()}
                    title="招待を拒否"
                    width="100px"
                  />
                  <Padding top="0px" right="0px" bottom="0px" left="15px">
                    <Button
                      background={ACCEPT}
                      fontSize="0.9em"
                      handleClick={() => joinTeam()}
                      title="チームに参加"
                      width="120px"
                    />
                  </Padding>
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
  justify-content: flex-end;
  margin-bottom: 10px;
`;

export default TeamDetailsPage;
