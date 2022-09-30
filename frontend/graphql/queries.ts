import { gql } from '@apollo/client';

const recipeFields = `
  id
  name
  timeEstimate
  averageRating
  userRating
  picture
  liked
  instructions
  portionSize
  category {
      id
      name
  }
  comments {
    id
    content
    author {
      id
      user {
        username
      }
      picture
    }
  }
  ingredients {
      id
      name
      amount
      unit
  }
  profile {
    user {
      username
    }
  }
`;

export const GET_RECIPES = gql`
    query allRecipes($category: Float, $name: String) {
        allRecipes(category_Id: $category, name_Icontains: $name) {
            edges {
                node {
                    ${recipeFields}
                }
            }
        }
    }
`;

export const GET_CATEGORIES = gql`
  {
    allCategories {
      id
      name
    }
  }
`;

export const GET_USER = gql`
  query {
    userDetails {
      id
      username
      email
      firstName
      lastName
      profile {
        id
        picture
        birthday
        biography
        recipes {
            edges {
                node {
                    ${recipeFields}
                }
            }
        }
      }
    }
  }
`;