import { useEffect, useState, VFC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { FETCH_TEAM, UPDATE_TEAM } from '../../queries/team';
import { TeamInput } from '../../utils/types';
import {
  descriptionField,
  teamNameField,
  usernameField,
} from './props/teamForm';
import Template from '../templates/Template';
import TeamForm from '../organisms/TeamForm';
import MainContainer from '../atoms/MainContainer';

const TeamEditingPage: VFC = () => {
  /*
    teamの値を正常に取得できteamがundefinedでなければ
    フォームを描画する仕組み
  */
  const [team, setTeam] = useState<TeamInput | undefined>(undefined);
  const [fetchTeam] = useLazyQuery(FETCH_TEAM);
  const [updateTeam] = useMutation(UPDATE_TEAM);
  const navigate = useNavigate();

  const { teamId } = useParams();

  const submitTeamData = async (teamData: TeamInput) => {
    await updateTeam({ variables: { id: teamId, ...teamData } });
    navigate(`/team/${teamId}`);
  };

  useEffect(() => {
    fetchTeam({ variables: { id: teamId } }).then(
      ({ data: { getTeamById: result } }) => {
        const targetTeam: TeamInput = {
          teamName: result.teamName,
          description: result.description,
          inviteeIds: result.invitees.map(
            (invitee: { id: string }) => invitee.id,
          ),
          memberIds: result.members.map((member: { id: string }) => member.id),
        };
        setTeam(targetTeam);
      },
    );
  }, []);

  const buttonProps = {
    title: '保存',
  };
  const formCardProps = {
    titleProps: {
      value: 'チーム編集',
    },
  };

  return (
    <Template>
      <MainContainer>
        {team && (
          <TeamForm
            buttonProps={buttonProps}
            descriptionField={descriptionField}
            formCardProps={formCardProps}
            submitTeamData={submitTeamData}
            teamState={team}
            teamNameField={teamNameField}
            usernameField={usernameField}
          />
        )}
      </MainContainer>
    </Template>
  );
};

export default TeamEditingPage;
