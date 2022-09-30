import { client } from '@api/apolloClient';
import { useQuery } from '@apollo/client';
import { AUTHENTICATE, DELETE_TOKEN_COOKIE } from '@graphql/mutations';
import { GET_USER } from '@graphql/queries';
import { Alert, Snackbar } from '@mui/material';
import Router from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { UserProps } from 'src/types/user';

const AuthContext = createContext<{
  userDetails?: UserProps;
  setUser: (u: UserProps | undefined) => void;
  signIn: any;
  signOut: any;
  error: any;
}>({
  userDetails: undefined,
  setUser: () => { },
  signIn: undefined,
  signOut: undefined,
  error: undefined,
});

interface AuthProviderProps {
  children: JSX.Element[] | JSX.Element;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Brukerdata state
  const [userDetails, setUser] = useState<UserProps | undefined>(undefined);

  // Håndter error
  const [alertError, setAlertError] = useState('');

  const handleAlert = (error: string) => {
    setAlertError(error);
  };

  const handleAlertClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertError('');
  };

  // Hent brukerdata
  const { data, error } = useQuery(GET_USER);

  useEffect(() => {
    if (data?.userDetails) {
      setUser(data.userDetails);
    }
  }, [data]);

  // Logg inn metode
  const signIn = async ({ username, password }: UserProps) => {
    await client
      .mutate({
        mutation: AUTHENTICATE,
        variables: { username, password },
      })
      .then((ok) => {
        if (ok) {
          // Hent ny brukerinformasjon
          client.refetchQueries({ include: [GET_USER] })

          // Naviger til home
          Router.push('/');
        }
      })
      .catch((error) => {
        handleAlert(error.message);
      });
  };

  // Logg ut metode
  const signOut = async () => {
    await client
      .mutate({
        mutation: DELETE_TOKEN_COOKIE,
      })
      .then(() => {
        Router.reload();
        Router.push('/login');
      })
      .catch((error) => {
        handleAlert(error.message);
      });
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, userDetails, error, setUser: setUser }}>
      <Snackbar
        open={alertError != ''}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert variant="filled" severity="error" onClose={handleAlertClose} sx={{ width: '300px' }}>
          {alertError}
        </Alert>
      </Snackbar>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthentication = () => useContext(AuthContext);
