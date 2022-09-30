import { ProfileProps } from "./profile";

export interface UserProps {
  id: number;
  username: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profile: ProfileProps;
}
