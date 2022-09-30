
import RecipeItem from '@components/recipe/RecipeItem';
import { Box, Container, Typography } from '@mui/material';
import { RecipeProps } from 'src/types/recipe';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Props {
  recipes: Array<RecipeProps>
}

const HomePopularModule = ({ recipes }: Props) => {
  return (
    <Box sx={{ overflow: "hidden", ".swiper": { overflow: "visible" }, pb: 3 }}>
      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ mb: 3 }}>Populære oppskrifter</Typography>
        <Swiper
          spaceBetween={10}
          slidesPerView={1.2}
        >
          {recipes.map((recipe) => (
            <SwiperSlide key={recipe.id}>
              <RecipeItem recipe={recipe} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  )
}

export default HomePopularModule