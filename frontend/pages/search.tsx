import { useLazyQuery } from '@apollo/client';
import Layout from '@components/Layout';
import RecipeItem from '@components/recipe/RecipeItem';
import SearchRecipeModule from '@components/search/SearchRecipeModule';
import { GET_RECIPES } from '@graphql/queries';
import { Box, Container, Divider, LinearProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { RecipeProps } from 'src/types/recipe';

const SearchPage = () => {
  const [fetchRecipes, { data, loading }] = useLazyQuery(GET_RECIPES);
  const [timeFilterState, setTimeFilterState] = useState<Array<number> | undefined>();
  const [sorting, setSorting] = useState<string | null>(null);

  const timeFilter = (recipe: { node: RecipeProps }) => {
    if (!timeFilterState) {
      return true
    }
    return (parseInt(recipe.node.timeEstimate) / 60 > timeFilterState[0] && parseInt(recipe.node.timeEstimate) / 60 < timeFilterState[1]);
  }

  const ratingSort = <T extends { node: RecipeProps }>(a: T, b: T) => {
    if (!sorting) {
      return 0;
    }
    if (sorting == "asc") {
      return a.node.averageRating - b.node.averageRating
    } else if (sorting == "desc") {
      return b.node.averageRating - a.node.averageRating
    }
  }

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ mb: 2.7 }}>Søk etter oppskrifter</Typography>
        <SearchRecipeModule fetchRecipes={fetchRecipes} timerfinder={setTimeFilterState} setSorting={setSorting} />
      </Container>

      <Divider />

      <Container maxWidth="sm" sx={{ pt: 2.5 }}>
        <Stack spacing={2.5}>
          {(loading || !data) ? (
            <Box width="100%">
              <LinearProgress />
            </Box>
          ) : data.allRecipes.edges.filter((recipe: { node: RecipeProps }) => timeFilter(recipe))
            .sort(ratingSort).map((recipe: any) => (
              <RecipeItem key={recipe.node.id} recipe={recipe.node} />
            ))}
          {(data?.allRecipes.edges.length == 0) && ("Fant ingen oppskrifter")}
        </Stack>
      </Container>
    </>
  )
}

SearchPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default SearchPage;
