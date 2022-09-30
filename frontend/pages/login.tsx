import { useAuthentication } from '@api/authentication';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NextLink from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LogIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { signIn, error, userDetails } = useAuthentication()
    const router = useRouter();

    // Kjør logg inn mutation når form er submittet
    function onSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()
        signIn({ username, password })
    }

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
                        Logg inn
                    </Typography>
                    <Box component='form'
                        onSubmit={onSubmit}
                        sx={{ mt: 1 }}
                    >
                        <TextField onChange={(e) => setUsername(e.target.value)} margin='normal' required fullWidth id='loginID' label='E-post eller brukernavn' name='LoginID' autoFocus />
                        <TextField onChange={(e) => setPassword(e.target.value)} margin='normal' required fullWidth id='password' label='Passord' name='password' type='password' />
                        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>Logg inn</Button>
                        <Grid container>
                            {/*
                            TODO: Lag glemt passord-side
                            <Grid item xs>
                                <Link href='#'>
                                    Glemt passord?
                                </Link>
                            </Grid> */}
                            <Grid item>
                                <NextLink href="/signup">
                                    <Link>
                                        Mangler bruker?
                                    </Link>
                                </NextLink>
                                <br/><br/>
                                <NextLink href="/">
                                    <Link>
                                        Tilbake til hjemsiden?
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