import { useAuthentication } from "@api/authentication";
import { useMutation } from "@apollo/client";
import { TOGGLE_RECIPE_LIKE } from "@graphql/mutations";
import { GET_RECIPES } from "@graphql/queries";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Fab, FabProps } from "@mui/material";
import { RecipeProps } from "src/types/recipe";

interface Props extends FabProps {
    recipe: RecipeProps;
}

const RecipeLikeButton = ({ recipe, sx }: Props) => {
    // Toggle mutation

    const { userDetails } = useAuthentication();
    const [toggleLike] = useMutation(TOGGLE_RECIPE_LIKE, {

        // Update cache by replacing recipe object
        update: (cache, data) => {
            const recipes: any = cache.readQuery({ query: GET_RECIPES });

            const updatedRecipe = [{
                __typename: 'RecipeTypeEdge',
                node: {
                    ...recipes.allRecipes.edges.filter((item: { node: RecipeProps }) => item.node.id == data.data.toggleRecipeLike.recipeId)[0].node,
                    liked: data.data.toggleRecipeLike.liked
                }
            }]

            const test = recipes.allRecipes.edges.map((obj: { node: RecipeProps }) => updatedRecipe.find(o => o.node.id === obj.node.id) || obj);

            cache.writeQuery({ query: GET_RECIPES, data: { allRecipes: { "__typename": "RecipeTypeConnection", edges: test } } });
        },

        onError: (error) => {
            console.log(error.message)
        }
    })

    if (!userDetails) {
        return <></>
    }

    return (
        <Fab
            onClick={() => toggleLike({ variables: { recipe: recipe.id } })}
            sx={{ color: "error.main", ...sx }}
        >
            {recipe.liked ? (
                <Favorite fontSize="large" />
            ) : (
                <FavoriteBorder fontSize="large" />
            )}
        </Fab>
    )
}

export default RecipeLikeButton