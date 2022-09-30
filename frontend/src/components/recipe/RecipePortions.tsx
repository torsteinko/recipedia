import * as React from 'react';
import { RecipeProps } from 'src/types/recipe';
import { Box, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

interface Props {
    recipe: RecipeProps;
}




const RecipePortions = ({ recipe }: Props) => {
    //const {portion_size} = recipe;
    
    const [portionValue, setPortionValue] = React.useState(4);

    const subtract = () => {
        setPortionValue(portionValue - 1);
    }

    const add = () => {
        setPortionValue(portionValue + 1);
    }

    
    /* Returns portionsize, with possibility to adjust */    
    return (
        <Box sx={{alignContent: 'space-between'}}>
            <Box sx={{flexDirection: 'row', display: 'flex', mx: 2, mb: 1}}>
                <Typography>Porsjoner</Typography>
            </Box>
            <Box sx={{flexDirection: 'row', display: 'flex', mx: 1}}>
                {portionValue < 2 ? <IconButton aria-label="decrease" disabled onClick={subtract}>
                    <RemoveCircleIcon />
                </IconButton> : <IconButton aria-label="decrease" onClick={subtract}>
                <RemoveCircleIcon />
            </IconButton>}
                <Typography variant="h3" sx={{mx: 1}}> {portionValue} </Typography>
                <IconButton aria-label="increase" onClick={add}>
                    <AddCircleIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default RecipePortions;
