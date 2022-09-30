import { gql } from '@apollo/client';

export const AUTHENTICATE = gql`
  mutation tokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      payload
    }
  }
`;

export const DELETE_TOKEN_COOKIE = gql`
  mutation {
    deleteTokenCookie {
      deleted
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $password: String!
    $email: String!
    $firstName: String
    $lastName: String
  ) {
    createUser(
      username: $username
      password: $password
      email: $email
      firstName: $firstName
      lastName: $lastName
    ) {
      user {
        id
        username
        email
        firstName
      }
      token
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $username: String!
    $password: String
    $userData: BaseUpdateUserInputs
    $birthday: DateTime
    $biography: String
  ) {
    updateProfile(
      username: $username
      password: $password
      userData: $userData
      birthday: $birthday
      biography: $biography
    ) {
      token
      user {
        firstName
        lastName
        email
        profile {
            biography
            birthday
            picture
        }
    }
    }
  }
`;
export const CREATE_COMMENT = gql`
  mutation createComment(
    $recipe: ID!
    $content: String!
  ) {
    createComment(
      recipe: $recipe
      content: $content
    ) {
      comment {
        id
        author {
          id
          picture
          user {
            username
          }
        }
        recipe {
          id
        }
        content
        }
      ok
    }
  }
  `;
  
export const SET_RATING = gql`
  mutation setRating(
    $recipeId: ID!
    $ratingPoints: Int!
  ) {
    setRating(
      recipeId: $recipeId
      ratingPoints: $ratingPoints
    ) {
        rating {
            rating
        }
    }
  }
`;

export const DELETE_RATING = gql`
  mutation deleteRating(
    $recipeId: ID!
  ) {
    deleteRating(
      recipeId: $recipeId
    ) {
        ok
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation createRecipe($profile: ID!, $recipeData: BaseRecipeInput!) {
    createRecipe(profile: $profile, recipeData: $recipeData) {
      recipe {
        id
        name
        instructions
      }
      ok
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation updateRecipe($id: ID!, $recipeData: BaseRecipeInput!) {
    updateRecipe(id: $id, recipeData: $recipeData) {
      ok
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment(
    $id: ID!
  ) {
    deleteComment(id: $id) {
      ok
    }
  }
`
export const CREATE_INGREDIENT = gql`
  mutation createIngredient($recipe: ID!, $ingredientData: BaseIngredientInput!) {
    createIngredient(recipe: $recipe, ingredientData: $ingredientData) {
      ingredient {
        id
        name
        amount
        unit
      }
      ok
    }
  }
`;


export const DELETE_INGREDIENT = gql`
  mutation deleteIngredient($id: ID!) {
    deleteIngredient(id: $id) {
      ok
    }
  }
`;

export const UPLOAD_RECIPE_PICTURE = gql`
  mutation uploadRecipePicture($file: Upload!, $id: ID!) {
    uploadRecipePicture(file: $file, id: $id) {
      success
    }
  }
`;

export const UPLOAD_PROFILE_PICTURE = gql`
  mutation uploadProfilePicture($file: Upload!, $username: String!) {
    uploadProfilePicture(file: $file, username: $username) {
      success
      profile {
          picture
      }
    }
  }
`;
export const TOGGLE_RECIPE_LIKE = gql`
  mutation toggleRecipeLike($recipe: ID!) {
    toggleRecipeLike(recipe: $recipe) {
      liked
      recipeId
    }
  }
`
