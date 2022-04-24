import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState, VFC } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import { CREATE_SVC } from '../../queries/svc';
import { FETCH_TEAMS_BY_TEAM_NAME_AND_MEMBER_ID } from '../../queries/team';
import { AppInput, SimpleTeam } from '../../utils/types';
import Input from '../atoms/Input';
import Padding from '../atoms/Padding';
import PostForm from '../organisms/PostForm';
import RadioInputFormList from '../organisms/RadioInputFormList';
import UserCardList from '../organisms/UserCardList';
import Template from '../templates/Template';
import { descriptionField, nameField, urlField } from './props/postForm';
import Label from '../atoms/Label';
import MainContainer from '../atoms/MainContainer';
import TeamLinkList from '../organisms/TeamLinkList';

const PostCreationPage: VFC = () => {
  const [fetchTeams] = useLazyQuery(FETCH_TEAMS_BY_TEAM_NAME_AND_MEMBER_ID);
  const [createSvc] = useMutation(CREATE_SVC);
  const { profile } = useProfile();

  const initialFormOptionsState = {
    checkedValue: 'developer',
    teamName: '',
  };

  type TeamData = {
    selectedTeam?: SimpleTeam;
    candidateTeams: SimpleTeam[];
  };

  const initialTeamData = {
    selectedTeam: undefined,
    candidateTeams: [],
  };

  const [formOptions, setFormOptions] = useState(initialFormOptionsState);
  const [teamData, setTeamData] = useState<TeamData>(initialTeamData);

  const submitPostData = async (variables: AppInput) => {
    await createSvc({ variables });
  };

  const getTeamMenu = (teams: SimpleTeam[], isAllowToSetData?: boolean) => {
    return teams.map((team: SimpleTeam) => ({
      color: '#000',
      name: team.teamName,
      handleClick: isAllowToSetData
        ? () => setTeamData({ ...teamData, selectedTeam: team })
        : () => {},
      height: '40px',
    }));
  };

  const buttonProps = {
    title: '投稿',
  };

  const formCardProps = {
    titleProps: {
      value: 'アプリを投稿',
    },
  };

  const radioInputForms = [
    {
      labelProps: {
        fontSize: '0.8em',
        htmlFor: 'developer',
        value: '個人',
      },
      radioInputProps: {
        id: 'developer',
        checked: formOptions.checkedValue === 'developer',
        handleChange: () => setFormOptions({ checkedValue: 'developer', teamName: '' }),
      },
    },
    {
      labelProps: {
        fontSize: '0.8em',
        htmlFor: 'team',
        value: 'チーム',
      },
      radioInputProps: {
        id: 'team',
        checked: formOptions.checkedValue === 'team',
        handleChange: () => setFormOptions(
          { ...formOptions, checkedValue: 'team' },
        ),
      },
    },
  ];

  const teamNameInputProps = {
    id: 'teamName',
    placeholder: 'チーム名から検索',
    value: formOptions.teamName,
  };

  const cards = [{ user: profile }];

  useEffect(() => {
    if (formOptions.checkedValue === 'team') {
      const variables = {
        teamName: formOptions.teamName,
        memberId: profile.id,
      };
      fetchTeams({ variables }).then(
        ({ data: { getTeamsByTeamNameAndMemberId: result } }) => {
          setTeamData({ ...teamData, candidateTeams: result });
        },
      );
      // 開発者を「個人」に切り替えたときはteamDataを初期化
    } else if (formOptions.checkedValue === 'developer') {
      setTeamData(initialTeamData);
    }
  }, [formOptions, profile.id]);

  return (
    <Template>
      <MainContainer>
        <PostForm
          buttonProps={buttonProps}
          descriptionField={descriptionField}
          formCardProps={formCardProps}
          nameField={nameField}
          submitPostData={submitPostData}
          teamId={teamData.selectedTeam ? teamData.selectedTeam.id : ''}
          urlField={urlField}
        >
          <Padding top="5px">
            <>
              <RadioInputFormList
                radioInputForms={radioInputForms}
                title="開発者"
              />
              {formOptions.checkedValue === 'developer' && (
                <UserCardList cards={cards} />
              )}
              {formOptions.checkedValue === 'team' && (
                <>
                  <Input
                    handleChange={(value: string) => setFormOptions(
                      { ...formOptions, teamName: value },
                    )}
                    {...teamNameInputProps}
                  />
                  <TeamLinkList
                    maxHeight="150px"
                    menuList={getTeamMenu(teamData.candidateTeams, true)}
                    noTeamText="チームが存在しません"
                  />
                  <Padding bottom="0px" top="5px" left="0px" right="0px">
                    <Label value="選択中のチーム" />
                    <TeamLinkList
                      maxHeight="150px"
                      menuList={(teamData.selectedTeam
                        ? getTeamMenu([teamData.selectedTeam]) : [])}
                      noTeamText="選択中のチームがありません"
                    />
                  </Padding>
                </>
              )}
            </>
          </Padding>
        </PostForm>
      </MainContainer>
    </Template>
  );
};

export default PostCreationPage;
