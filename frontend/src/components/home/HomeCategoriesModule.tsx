import { useQuery } from "@apollo/client"
import { GET_CATEGORIES } from "@graphql/queries"
import { Box, Container, Grid, Typography } from "@mui/material"
import { CategoryProps } from "src/types/category"
import HomeCategoryItem from "./HomeCategoryItem"


const HomeCategoriesModule = () => {
  const { data, loading } = useQuery(GET_CATEGORIES)

  return (
    <Box sx={{ overflow: "hidden", ".swiper": { overflow: "visible" }, pb: 3 }}>
      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ mb: 2.7 }}>Oppskrifter etter kategori</Typography>
        {/* <Swiper
          spaceBetween={10}
          slidesPerView={3.2}
        >
          {!loading && data.allCategories.map((category: CategoryProps) => (
            <SwiperSlide key={category.id}>
              <HomeCategoryItem category={category} />
            </SwiperSlide>
          ))}
        </Swiper> */}
        <Grid container spacing={1.5}>
          {!loading && data.allCategories.map((category: CategoryProps) => (
            <Grid item key={category.id} xs={4}>
              <HomeCategoryItem category={category} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default HomeCategoriesModule