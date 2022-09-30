import { useAuthentication } from '@api/authentication';
import { useMutation } from '@apollo/client';
import { CREATE_COMMENT, DELETE_COMMENT } from '@graphql/mutations';
import { Delete } from '@mui/icons-material';
import { Alert, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import NextLink from "next/link";
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CommentProps } from 'src/types/comment';
import { RecipeProps } from 'src/types/recipe';

interface Props {
  recipe: RecipeProps
}

export default function RecipeComments({ recipe }: Props) {
  const { id, comments } = recipe;
  const { userDetails } = useAuthentication()
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

  const { register, handleSubmit, formState: { errors } } = useForm();

  const [createComment] = useMutation(CREATE_COMMENT, { refetchQueries: ["allRecipes"] })
  const [deleteComment] = useMutation(DELETE_COMMENT, { refetchQueries: ["allRecipes"] })

  const onSubmit = handleSubmit((data) => {
    createComment({
      variables: {
        recipe: id,
        content: data.comment
      },
      onError: (error) => {
        handleAlert("Du må logge inn!")
      }
    });
  });

  return (
    <>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
      >
        {comments.map((comment: CommentProps) => (
          <div key={comment.id}>
            <ListItem secondaryAction={comment.author.user.username == userDetails?.username && (
              <IconButton edge="end" aria-label="delete" onClick={() => deleteComment({ variables: { id: comment.id } })}>
                <Delete />
              </IconButton>)
            }
            >
              <ListItemAvatar>
                <Avatar src={process.env.IMAGE_PATH + (comment.author.picture || "")} />
              </ListItemAvatar>
              <ListItemText primary={comment.author.user.username} secondary={comment.content} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </div>
        ))}
        {comments.length == 0 && (
          <ListItem>
            <Typography>Ingen kommentarer</Typography>
          </ListItem>
        )}
        {userDetails ? (
          <ListItem component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
            <TextField error={!!errors.comment} fullWidth {...register("comment", { required: true })} label="Kommentar..." />
            <Button sx={{ ml: 1, height: 48 }} variant="contained" type="submit">Send</Button>
          </ListItem>
        ) : (
          <ListItem sx={{ mt: 2, textAlign: "center", justifyContent: "center" }}>
            <NextLink href="/login" passHref>
              <Button variant="outlined" color="inherit">
                Logg inn for å kommentere
              </Button>
            </NextLink>
          </ListItem>
        )}

      </List>

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
    </>
  );
}
