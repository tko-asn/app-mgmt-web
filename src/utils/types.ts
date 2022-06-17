export type App = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

export type UpdateAppInput = {
  name: string;
  icon: string;
  url: string;
  description: string;
};

export type AppInput = {
  developerId: string;
  teamId: string;
} & UpdateAppInput;

export type AppFormState = AppInput | UpdateAppInput;

export type Apps = App[];

export type TeamInput = {
  teamName: string;
  description: string;
  inviteeIds: string[];
  memberIds: string[];
};

export type Profile = {
  id: string;
  username: string;
  icon: string;
};

export type ProfileInput = {
  username: string;
  selfIntro: string;
};

export type Team = {
  teamName: string;
  description: string;
  invitees: Profile[];
  members: Profile[];
  updatedAt: string;
  createdAt: string;
};

export type SimpleTeam = {
  id: string;
  teamName: string;
};
