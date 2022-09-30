import { useQuery } from "@apollo/client";
import HomeCategoriesModule from "@components/home/HomeCategoriesModule";
import HomePopularModule from "@components/home/HomePopularModule";
import Layout from "@components/Layout";
import Loading from "@components/Loading";
import { GET_RECIPES } from "@graphql/queries";
import { ArrowForward } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { RecipeProps } from "src/types/recipe";

const Landing = () => {
  const { data, loading } = useQuery(GET_RECIPES);

  if (loading) return <Loading />

  const recipes = data?.allRecipes.edges.map((recipe: { node: RecipeProps }) => recipe.node)

  return (
    <>
      <Container maxWidth="sm">
        <NextLink href="/search" passHref>
          <Button fullWidth color="primary" variant="contained" size="large" endIcon={<ArrowForward />} sx={{ mb: 3 }}>Søk etter oppskrifter</Button>
        </NextLink>
      </Container>
      {recipes && (<HomePopularModule recipes={recipes.sort((a: RecipeProps, b: RecipeProps) => b.averageRating - a.averageRating).slice(0, 5)} />)}
      <HomeCategoriesModule />
    </ >
  )
}

Landing.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default Landing;