import { useAuthentication } from '@api/authentication';
import BgOverlay from '@components/BgOverlay';
import { Close, Edit } from '@mui/icons-material';
import { Box, CardMedia, Fab, Modal, Paper, Slide, Stack } from "@mui/material";
import React from 'react';
import { useState } from 'react';
import { RecipeProps } from "src/types/recipe";
import RecipeImage404 from './RecipeImage404';
import RecipeKeyInfo from "./RecipeKeyInfo";
import RecipeLikeButton from './RecipeLikeButton';
import RecipeTab from './RecipeTab';
import EditRecipe from './EditRecipe';

interface DetailedRecipeProps {
    recipe: RecipeProps;
    open: boolean;
    setOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}


const DetailedRecipeView = ({ recipe, open, setOpen }: DetailedRecipeProps) => {
    const { userDetails } = useAuthentication()
    const [edit, setEdit] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                hideBackdrop
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
            >
                <Slide in={open} direction='up'>
                    <Box component={Paper} sx={{
                        position: 'absolute',
                        height: "100vh",
                        overflowY: "scroll",
                        top: 0,
                        left: 0,
                        width: "100%"
                    }}>
                        <Fab onClick={handleClose} sx={{ position: "absolute", top: 0, right: 0, m: 2, zIndex: 2000, color: "common.white" }} size="large">
                            <Close fontSize="large" />
                        </Fab>
                        {(userDetails?.username == recipe.profile.user.username && <Fab onClick={() => { setEdit(true) }} sx={{ position: "absolute", top: 0, left: 0, m: 2, zIndex: 100 }} size="large">
                            <Edit fontSize="large" />
                        </Fab>)}
                        <Box position="absolute" sx={{ top: 60, right: 0, m: 2, zIndex: 2000 }}>
                            <RecipeLikeButton recipe={recipe} />
                        </Box>

                        <Stack spacing={2}>
                            <CardMedia sx={{ height: 250, width: "100%", position: "relative", display: "flex", justifyContent: "center", bgcolor: "secondary.light", "img": { objectFit: "cover" } }}>
                                {recipe?.picture ? (
                                    <img src={process.env.IMAGE_PATH + recipe?.picture} height="100%" width="100%" />
                                ) : (
                                    <RecipeImage404 sx={{ height: "100%" }} />
                                )}
                                <BgOverlay direction='top' endColor='rgba(0,0,0,0.6)' />
                            </CardMedia>

                            <RecipeKeyInfo recipe={recipe} />
                            <RecipeTab recipe={recipe} />
                        </Stack>
                    </Box>
                </Slide>
            </Modal>
            <EditRecipe recipe={recipe} edit={edit} setEdit={setEdit} />
        </>
    );
}

export default DetailedRecipeView;