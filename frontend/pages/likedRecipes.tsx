import { useAuthentication } from "@api/authentication";
import { useQuery } from "@apollo/client";
import Layout from "@components/Layout";
import RecipeItem from "@components/recipe/RecipeItem";
import Restriction from "@components/Restriction";
import { GET_RECIPES } from "@graphql/queries";
import { Box, Container, Divider, LinearProgress, Stack, Typography } from "@mui/material";
import { RecipeProps } from "src/types/recipe";


const LikedRecipesPage = () => {
    const { data, loading } = useQuery(GET_RECIPES);
    const { userDetails } = useAuthentication()

    if (!userDetails) {
        return (
            <>
                <Restriction />
            </>
        )
    }

    return (
        <>
            <Container maxWidth="sm">
                <Typography variant="h3" sx={{ mb: 2.7 }}>Likte oppskrifter</Typography>
            </Container>

            <Divider />

            <Container maxWidth="sm" sx={{ pt: 2.5 }}>
                <Stack spacing={2.5}>
                    {(loading || !data) ? (
                        <Box width="100%">
                            <LinearProgress />
                        </Box>
                    ) : data.allRecipes.edges.filter((recipe: { node: RecipeProps }) => recipe.node.liked).map((recipe: any) => (
                        <RecipeItem key={recipe.node.id} recipe={recipe.node} />
                    ))}
                    {(data?.allRecipes.edges.length == 0) && ("Fant ingen oppskrifter")}
                </Stack>
            </Container>
        </>
    )
}

LikedRecipesPage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default LikedRecipesPage