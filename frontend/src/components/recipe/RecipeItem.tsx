import BgOverlay from "@components/BgOverlay";
import { Card, CardActionArea, CardMedia, Stack } from "@mui/material";
import { useState } from "react";
import { RecipeProps } from "src/types/recipe";
import DetailedRecipeView from "./RecipeDetailedView";
import RecipeImage404 from "./RecipeImage404";
import RecipeKeyInfo from "./RecipeKeyInfo";
import RecipeLikeButton from "./RecipeLikeButton";

interface Props {
    recipe: RecipeProps;
}

const RecipeItem = ({ recipe }: Props) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    return (
        <>
            <Card>
                <RecipeLikeButton
                    recipe={recipe}
                    sx={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
                />
                <CardActionArea sx={{ pb: 2 }} onClick={handleOpen}>
                    <Stack spacing={2}>
                        <CardMedia sx={{ height: 200, width: "100%", position: "relative", display: "flex", justifyContent: "center", bgcolor: "secondary.light", "img": { objectFit: "cover" } }}>
                            {recipe?.picture ? (
                                <img src={process.env.IMAGE_PATH + recipe?.picture} height="100%" width="100%" />
                            ) : (
                                <RecipeImage404 sx={{ height: "100%" }} />
                            )}
                            <BgOverlay direction='right' endColor='rgba(0,0,0,0.3)' />

                        </CardMedia>

                        <RecipeKeyInfo recipe={recipe} />
                    </Stack>
                </CardActionArea>
            </Card>
            <DetailedRecipeView recipe={recipe} open={open} setOpen={setOpen} />
        </>
    )
}

export default RecipeItem;