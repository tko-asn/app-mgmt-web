type App = {
  id: string;
  name: string;
  icon: string;
  url: string;
};

export type AppInput = {
  name: string;
  icon: string;
  url: string;
  description: string;
  developerId: string;
  teamId: string;
};

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
