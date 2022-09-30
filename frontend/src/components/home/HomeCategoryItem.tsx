import { Restaurant } from "@mui/icons-material"
import { Card, CardActionArea, Stack, Typography } from "@mui/material"
import NextLink from "next/link"
import { CategoryProps } from "src/types/category"

interface Props {
  category: CategoryProps;
}

const HomeCategoryItem = ({ category }: Props) => {
  return (
    <Card>
      <NextLink href={"/search?category=" + category.id} passHref>
        <CardActionArea sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
            <Restaurant sx={{ color: "text.disabled" }} />
            <Typography variant="h5">{category.name}</Typography>
          </Stack>
        </CardActionArea>
      </NextLink>
    </Card >
  )
}

export default HomeCategoryItem