import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Rating, Stack, Typography } from "@mui/material";
import { RecipeProps } from "src/types/recipe";
import parseDuration from 'src/utils/parseDuration';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

interface Props {
    recipe: RecipeProps
}

const RecipeKeyInfo = ({ recipe }: Props) => {
    const { name, timeEstimate, averageRating, profile } = recipe;

    return (
        <Stack px={2} spacing={1} sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
            
            <Typography variant="h5" sx={{ height: 50, display: "flex", alignItems: "center" }}>
                {name}
            </Typography>
            
            <Stack spacing={4} direction="row" sx={{ display: "flex", alignItems: "center", 
            color: "text.disabled", justifyContent: "center"}}>
                <Stack spacing={0.5} direction="row" sx={{ display: "flex"}}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="body2">
                        {parseDuration(timeEstimate)}
                    </Typography>
                </Stack>

                <Stack spacing={0.5} direction="row" sx={{ display: "flex"}}>
                    <PersonOutlineIcon />
                    <Typography variant="body2">
                        {profile.user.username}
                    </Typography>
                </Stack> 
            </Stack>
            <Rating
                name="rating-display"
                readOnly
                value={averageRating}
                precision={0.1}
                size="medium"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />   
        </Stack>
    )
}

export default RecipeKeyInfo;