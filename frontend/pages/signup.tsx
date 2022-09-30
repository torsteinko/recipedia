import { useAuthentication } from '@api/authentication';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@graphql/mutations';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function SignUp() {
    const { userDetails, signIn } = useAuthentication();

    const [createUser] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            // Autentiser bruker
            signIn({ username: data.createUser.user.username, password: getValues("password") })
        }
    });
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();


    const onSubmit = handleSubmit((data) => {
        createUser({
            variables: {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                password: data.password,
                email: data.email,
            }
        });
    });

    const router = useRouter();

    // Naviger til fremside dersom allerede logget inn
    useEffect(() => {
        if (userDetails) {
            router.push("/")
        }
    })

    return (
        <>
            <Container component='main' maxWidth='sm'>
                <Box sx={{
                    marginTop: '20%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>Recipedia</Typography>
                    <Typography component='h1' variant='h5'>
                        Opprett ny konto
                    </Typography>
                    <Box component='form' sx={{ mt: 3 }} onSubmit={onSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6}>
                                <TextField fullWidth label='Fornavn' autoFocus {...register("firstName")} />
                            </Grid>
                            <Grid item xs={6} sm={6}>
                                <TextField required fullWidth label='Etternavn' {...register("lastName")} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth label='E-post' {...register("email")} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth label='Brukernavn' {...register("username")} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField required fullWidth label='Passord' type='password' {...register("password")} />
                            </Grid>
                        </Grid>
                        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>Opprette ny</Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <NextLink href="/login" passHref>
                                    <Link variant="body2">
                                        Er du registrert allerede?
                                    </Link>
                                </NextLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}