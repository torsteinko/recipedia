import { gql, useMutation } from '@apollo/client';
import { Box, Button, Container, Grid, styled, TextField, Modal, Slide, Paper, Fab, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UPDATE_PROFILE, UPLOAD_PROFILE_PICTURE } from '@graphql/mutations';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { UserProps } from 'src/types/user';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import parse from 'date-fns/parse';
import { add } from 'date-fns';
import { useState } from 'react';

const Input = styled('input')({
    display: 'none',
});

interface EditProfileProps {
    userDetails: UserProps;
    edit: boolean;
    setEdit: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}

const EditProfile = ({userDetails, edit, setEdit}: EditProfileProps) => {
    const [image, setImage] = useState();
    const [previewImage, setPreviewImage] = useState<any>()

    // Sets the date state used in the date picker component to start with the birthday of the user
    const [date, setDate] = React.useState<Date | null>(userDetails?.profile.birthday ? userDetails?.profile.birthday : null);

    const [updateProfile] = useMutation(UPDATE_PROFILE);
    const [uploadPicture] = useMutation(UPLOAD_PROFILE_PICTURE);

    const { register, handleSubmit, getValues, formState: { errors } } = useForm();

    // Updates the image and preview image states when selecting an image
    const testOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.validity.valid) {
            const [file]: any = e.target.files
            if (file) {
                setImage(file)
                setPreviewImage(URL.createObjectURL(file))
            }
        }
    }

    // Controls what happens when you submit
    const onSubmit = handleSubmit((data) => {
        // Adds one date to the birthday, so that the value stored in the database will be correct
        // This is just a quick fix, it owuld be way better to find out why the date saved is not the same as the date entered here
        const adjustedBirthday = add(parse(data.birthday, "yyyy-MM-dd", new Date()), {days: 1})
        
        const variables = {
            // The username is not updated, and is just copied from userDetails
            username: userDetails.username,
            // Adds the password from data to the variables object if a new password is entered
            ...(data.password && {password: data.password}),
            userData: {
                // Adds the email from data to the variables object if a new email not equal to the previous email is entered
                ...((data.email && data.email != userDetails.email) && {email: data.email}),
                ...((data.firstName && data.firstName != userDetails.firstName) && {firstName: data.firstName}),
                ...((data.lastName && data.lastName != userDetails.lastName) && {lastName: data.lastName}),
            },
            ...(data.birthday && {birthday: adjustedBirthday}),
            ...((data.biography && data.biography != userDetails.profile.biography) && {biography: data.biography}),
        }
        // Update the profile in the backend
        updateProfile({
            // Sets variables to the variables object above
            variables: variables,
            // After the profile has been updated, update the cache so we dont have to refresh
            update: (cache, data) => {
                cache.writeQuery({  
                    query: gql`
                        query {
                            userDetails {
                                email
                                firstName
                                lastName
                                profile {
                                    birthday
                                    biography
                                }
                            }
                        }
                    `,
                    data: {
                      userDetails: {
                        email: data.data.updateProfile.user.email,
                        firstName: data.data.updateProfile.user.firstName,
                        lastName: data.data.updateProfile.user.lastName,
                        profile: {
                            birthday: data.data.updateProfile.user.profile.birthday,
                            biography: data.data.updateProfile.user.profile.biography,
                        }
                      }
                    }
                });
            },
            // After the profile has been updated, handle the picture
            onCompleted: data => {
                if (image) {
                    // If an image has been selected, then run the uploadPicture query
                    uploadPicture({ 
                        variables: { file: image, username: userDetails.username },
                        // After the query, update the cache with the new picture, so we don't have to refresh
                        update: (cache, data) => {
                            cache.writeQuery({  
                                query: gql`
                                    query {
                                        userDetails {
                                            profile {
                                                picture
                                            }
                                        }
                                    }
                                `,
                                data: {
                                  userDetails: {
                                    profile: {
                                        picture: data.data.uploadProfilePicture.profile.picture,
                                    }
                                  }
                                }
                            });
                        }
                    })
                }
            }, 
        });

        // Close the edit modal
        setEdit(false)
    });


    

    return (
        <Modal
            open={edit}
            onClose={() => {setEdit(false)}}
            hideBackdrop
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
        >
            <Slide in={edit} direction='up'>
                <Box component={Paper} sx={{
                    position: 'absolute',
                    height: "100vh",
                    overflowY: "scroll",
                    top: 0,
                    left: 0,
                    width: "100%",
                    padding: 1,
                    paddingTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Fab onClick={() => setEdit(false)} sx={{ position: "absolute", top: 0, right: 0, m: 2, zIndex: 100 }} size="large">
                        <CloseIcon fontSize="large" />
                    </Fab>
                    <Container component='main' maxWidth='sm'>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Avatar component="form" sx={{
                                width: 200,
                                height: 200,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundImage: previewImage ? `url(${previewImage})` : "none",
                                backgroundSize: "cover",
                                ...(!previewImage && { boxShadow: "none" }),
                            }}>
                                <label htmlFor="contained-button-file">
                                    <input hidden accept="image/*" type='file' id="contained-button-file" onChange={testOnChange} />
                                    <Button variant="contained" component="span" color="inherit">
                                        Velg profilbilde
                                    </Button>
                                </label>
                            </Avatar>
                        </Box>
                        
                        <Box component='form' sx={{ mt: 3 }} onSubmit={onSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={6}>
                                    <TextField fullWidth label='Fornavn' defaultValue={userDetails?.firstName} autoFocus {...register("firstName")} />
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <TextField fullWidth label='Etternavn' defaultValue={userDetails?.lastName} {...register("lastName")} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='E-post' defaultValue={userDetails?.email} {...register("email")} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField disabled fullWidth label='Brukernavn' defaultValue={userDetails?.username} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Nytt passord' type='password' {...register("password")} />
                                </Grid>
                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDatePicker
                                            label="Fødselsdag"
                                            
                                            value={date}
                                            onChange={(newDate) => {setDate(newDate)}}
                                            renderInput={(params) => <TextField {...params} fullWidth {...register("birthday")} />}
                                            inputFormat="yyyy-MM-dd"
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth label='Bio' defaultValue={userDetails?.profile?.biography} {...register("biography")} />
                                </Grid>
                            </Grid>
                            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>Lagre endringer</Button>
                        </Box>
                    </Container>
                </Box>
            </Slide>
        </Modal>
    );
}

export default EditProfile;