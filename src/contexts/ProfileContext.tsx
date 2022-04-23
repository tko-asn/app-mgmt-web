import type { SetStateAction } from 'react';
import {
  createContext,
  Dispatch,
  useContext,
  useMemo,
  useState,
  VFC,
} from 'react';

export type ProfileState = {
  id: string;
  userId: string;
  username: string;
  icon: string;
  selfIntro: string;
};

type ProviderProps = {
  children: JSX.Element;
};

type ProfileCtx = {
  profile: ProfileState;
  setProfile: Dispatch<SetStateAction<ProfileState>>;
};

const defaultProfile: ProfileState = {
  id: '',
  userId: '',
  username: '',
  icon: '',
  selfIntro: '',
};

const initialState: ProfileCtx = {
  profile: defaultProfile,
  setProfile: () => {},
};

const ProfileContext = createContext<ProfileCtx>(initialState);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  return context;
};

export const ProfileProvider: VFC<ProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState(defaultProfile);
  const value: ProfileCtx = useMemo(
    () => ({ profile, setProfile }),
    [profile, setProfile],
  );
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
