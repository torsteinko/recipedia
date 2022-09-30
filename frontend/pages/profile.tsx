import { useAuthentication } from '@api/authentication';
import EditProfile from '@components/EditProfile';
import Layout from '@components/Layout';
import RecipeItem from '@components/recipe/RecipeItem';
import Restriction from '@components/Restriction';
import EditIcon from '@mui/icons-material/EditRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import { Avatar, Box, Button, ButtonGroup, Chip, Container, Fab, Stack, styled, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import * as React from 'react';
import { useState } from 'react';
import { useSettings } from 'src/theme/settings';

//ikkje still spørsmål
const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    '& > :not(style) + :not(style)': {
        marginTop: theme.spacing(2),
    },
}))

const ProfilePage = () => {
    const { userDetails, signOut } = useAuthentication();
    const { onToggleMode, themeMode } = useSettings();
    const recipes = userDetails?.profile.recipes.edges;
    const [edit, setEdit] = useState(false);

    if (!userDetails) {
        return (
            <>
                <Restriction />
            </>
        )
    }

    const themeNorwegian = themeMode == "dark" ? "Mørk tema" : "Lyst tema"

    return (
        <>
            <>
                <Fab onClick={() => { setEdit(true) }} sx={{ position: "absolute", top: 60, left: 0, m: 2, zIndex: 100 }} size="large">
                    <EditIcon />
                </Fab>
                <Fab onClick={signOut} sx={{ position: "absolute", top: 60, right: 0, m: 2, zIndex: 100 }} size="large">
                    <LogoutIcon />
                </Fab>
                <Container component='main' maxWidth='sm'>
                    <Box sx={{
                        marginTop: '5%',
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: 'center',
                        alignItems: 'center',
                    }}>
                        <Avatar sx={{ m: 1, height: 140, width: 140, alignSelf: 'center' }} src={process.env.IMAGE_PATH + (userDetails?.profile.picture || "")} />
                        <Typography sx={{ marginBottom: '10%' }} variant='h5'>
                            {userDetails?.username}
                        </Typography>
                        <ButtonGroup sx={{ mb: 2 }}>
                            <Button variant="outlined" color="inherit" disabled sx={{ color: (themeMode == "dark" ? "white" : "black") + "!important" }}>{themeNorwegian}</Button>
                            <Button onClick={onToggleMode} variant="contained" color="inherit">Bytt</Button>
                        </ButtonGroup>
                        <Root>
                            <Divider>
                                <Chip label="Navn" />
                            </Divider>
                            {userDetails?.firstName} {userDetails?.lastName}
                            <Divider>
                                <Chip label="E-post" />
                            </Divider>
                            {userDetails?.email}
                            <Divider>
                                <Chip label="Fødselsdag" />
                            </Divider>
                            {userDetails?.profile?.birthday}
                            <Divider>
                                <Chip label="Bio" />
                            </Divider>
                            {userDetails?.profile?.biography}
                        </Root>

                        <Typography sx={{ marginTop: '10%', marginBottom: '10%' }} variant='h4'>
                            Dine oppskrifter
                        </Typography>
                        <Stack spacing={2.5}>
                            {recipes && recipes.map((recipe: any) => (
                                <RecipeItem key={recipe.node.id} recipe={recipe.node} />
                            ))}
                        </Stack>
                    </Box>
                </Container>
            </>
            {userDetails && <EditProfile userDetails={userDetails} edit={edit} setEdit={setEdit} />}
        </>
    );
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

export default ProfilePage;
