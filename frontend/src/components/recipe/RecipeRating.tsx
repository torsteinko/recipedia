import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Rating, Stack, Typography } from "@mui/material";
import { RecipeProps } from "src/types/recipe";
import React, {useState} from "react";
import { SET_RATING, DELETE_RATING } from '@graphql/mutations';
import { GET_RECIPES } from '@graphql/queries';
import { useMutation } from '@apollo/client';
import { useAuthentication } from '@api/authentication';

interface Props {
    recipe: RecipeProps;
}

const RecipeRating = ({ recipe }: Props) => {
    const [value, setValue] = useState(recipe.userRating);
    const [setRating] = useMutation(SET_RATING);
    const [deleteRating] = useMutation(DELETE_RATING);
    const { userDetails } = useAuthentication()

    return (
        <Stack direction='row' px={2} spacing={2} sx={{display: "flex",alignItems: "center", textAlign: "center", justifyContent: "center"}}>
            {userDetails &&(
                <Typography variant='h5'>Din vurdering: </Typography>
                )}
            {userDetails &&(
                <Rating
                        name="rating-display"
                        value = {value}
                        precision={1}
                        size="medium"
                        icon={<StarIcon fontSize="inherit" />}
                        emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        onChange={(event, newValue) => {
                            if(newValue == null) {
                                setValue(0)
                                deleteRating({
                                    variables: { recipeId: recipe.id }, 
                                    // This refetch query fetches all recipes, not just the one that was updated, 
                                    // this could be optimized
                                    refetchQueries: [ {query: GET_RECIPES } ],
                                })
                            } else {
                                setValue(newValue);
                                setRating({
                                    variables: { recipeId: recipe.id, ratingPoints: newValue },
                                    refetchQueries: [ {query: GET_RECIPES } ],
                                });
                            }
                        }}
                    />
            )}
        
        </Stack>
    )
}

export default RecipeRating;
