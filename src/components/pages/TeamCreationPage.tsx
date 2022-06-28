import type { VFC } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import TeamForm from '../organisms/TeamForm';
import { useProfile } from '../../contexts/ProfileContext';
import Template from '../templates/Template';
import { CREATE_TEAM } from '../../queries/team';
import { TeamInput } from '../../utils/types';
import {
  descriptionField,
  teamNameField,
  usernameField,
} from './props/teamForm';
import { useMessages } from '../../hooks/useMessages';
import { validateTeamDataAndGetErrorMessages } from '../../utils/form';

const TeamCreationPage: VFC = () => {
  const { profile } = useProfile();
  const [createTeam] = useMutation(CREATE_TEAM);
  const navigate = useNavigate();
  const { messages, setErrorMessages, initializeErrorMessages } = useMessages();

  const teamState = {
    teamName: '',
    description: '',
    inviteeIds: [],
    memberIds: [profile.id],
  };

  const submitTeamData = async (variables: TeamInput) => {
    const errors = validateTeamDataAndGetErrorMessages(variables);
    if (errors.length) {
      setErrorMessages(errors);
      return;
    }
    await createTeam({ variables });
    navigate('/top');
  };

  const buttonProps = {
    title: '作成',
  };
  const formCardProps = {
    titleProps: {
      value: 'チーム作成',
    },
  };

  return (
    <Template messages={messages} deleteErrorMessages={initializeErrorMessages}>
      <StyledContainer>
        {profile.id && teamState.memberIds.length && (
          <TeamForm
            buttonProps={buttonProps}
            descriptionField={descriptionField}
            formCardProps={formCardProps}
            submitTeamData={submitTeamData}
            teamNameField={teamNameField}
            teamState={teamState}
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

export default TeamCreationPage;
