import { useAuthentication } from '@api/authentication';
import { Button, Container, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import NextLink from "next/link";
import * as React from 'react';
import { ReactNode } from 'react';
import RecipediaBottomNavigation from "./Navbar";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userDetails } = useAuthentication()

    return (
        <>
            <Container maxWidth="sm" sx={{ my: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant='h3' sx={{ color: 'primary.main' }}>Recipedia</Typography>
                    {!userDetails && (
                        <NextLink href="/login" passHref>
                            <Button color="inherit" variant="outlined">Logg inn</Button>
                        </NextLink>
                    )}
                </Stack>
            </Container>
            <Box sx={{ mb: 10, mt: 2 }}>
                {children}
                <RecipediaBottomNavigation />
            </Box>
        </>
    );
};

export default Layout;
