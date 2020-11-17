import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const token = process.env.REACT_APP_GITHUB_AUTH_TOKEN;
const GITHUB_API_ENDPOINT = "https://api.github.com/graphql";

const httpLink = createHttpLink({
  uri: GITHUB_API_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
