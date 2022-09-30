import { RecipeProps } from "./recipe";
import { UserProps } from "./user";

interface Node {
    node: RecipeProps;
}

export interface ProfileProps {
    id: number;
    picture?: string;
    birthday?: Date;
    biography?: string;
    recipes:  {
        edges: Array<Node>;
    }
    user: UserProps
  }
  