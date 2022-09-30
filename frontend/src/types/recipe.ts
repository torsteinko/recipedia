import { CommentProps } from './comment';
import { IngredientProps } from './ingredient';
import { UserProps } from './user';

export interface RecipeProps {
  id: number;
  name: string;
  timeEstimate: string;
  averageRating: number;
  comments: Array<CommentProps>;
  userRating: number;
  picture?: string;
  instructions: string;
  liked?: boolean;
  ingredients: Array<IngredientProps>;
  portionSize: number;
  profile: {
    user: UserProps;
  };
  category: {
      id: number;
      name: string;
  };
}
