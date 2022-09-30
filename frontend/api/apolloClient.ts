import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const link = createUploadLink({
  uri: 'http://127.0.0.1:8000/graphql/',
  credentials: 'include',
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
