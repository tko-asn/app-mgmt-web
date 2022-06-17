import { useEffect, useLayoutEffect, VFC } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FETCH_TEAM, UPDATE_TEAM } from '../../queries/team';
import { Profile, Team, TeamInput } from '../../utils/types';
import {
  descriptionField,
  teamNameField,
  usernameField,
} from './props/teamForm';
import Template from '../templates/Template';
import TeamForm from '../organisms/TeamForm';
import { useMessages } from '../../hooks/useMessages';
import { validateTeamDataAndGetErrorMessages } from '../../utils/form';
import { useProfile } from '../../contexts/ProfileContext';
import { TEAM_NOT_FOUND } from '../../utils/errors';

const TeamEditingPage: VFC = () => {
  const [fetchTeam, { data, error: fetchTeamError }] = useLazyQuery(FETCH_TEAM);
  const [updateTeam] = useMutation(UPDATE_TEAM);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { messages, setErrorMessages, initializeErrorMessages } = useMessages();

  const { teamId } = useParams();

  const submitTeamData = async (teamData: TeamInput) => {
    const errors = validateTeamDataAndGetErrorMessages(teamData);
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }
    await updateTeam({ variables: { id: teamId, ...teamData } });
    navigate(`/team/${teamId}`);
  };

  const teamState = data
    ? {
      teamName: data?.getTeamById.teamName,
      description: data?.getTeamById.description,
      inviteeIds: data?.getTeamById.invitees.map(
        (invitee: { id: string }) => invitee.id,
      ),
      memberIds: data?.getTeamById.members.map(
        (member: { id: string }) => member.id,
      ),
    }
    : undefined;

  const isYourTeam = (team?: Team) => {
    if (!team) return false;
    return team.members.some((member: Profile) => member.id === profile.id);
  };

  useEffect(() => {
    if (fetchTeamError && fetchTeamError.message === TEAM_NOT_FOUND) {
      navigate('/error/notFound');
    } else if (fetchTeamError) {
      navigate('/error');
    } else if (data?.getTeamById) {
      const redirects = !isYourTeam(data?.getTeamById);
      if (redirects) {
        navigate('/error/forbidden');
      }
    }
  }, [fetchTeamError, data]);

  useLayoutEffect(() => {
    fetchTeam({ variables: { id: teamId } });
  }, [teamId]);

  const buttonProps = {
    title: '保存',
  };
  const formCardProps = {
    titleProps: {
      value: 'チーム編集',
    },
  };

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        {isYourTeam(data?.getTeamById) && teamState && (
          <TeamForm
            buttonProps={buttonProps}
            descriptionField={descriptionField}
            formCardProps={formCardProps}
            submitTeamData={submitTeamData}
            teamState={teamState}
            teamNameField={teamNameField}
            usernameField={usernameField}
          />
        )}
      </StyledContainer>
    </Template>
  );
};

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 50px;
`;

export default TeamEditingPage;
