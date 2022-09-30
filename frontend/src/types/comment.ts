import { ProfileProps } from "./profile";

export interface CommentProps {
    id: number;
    content: string;
    author: ProfileProps;
}
