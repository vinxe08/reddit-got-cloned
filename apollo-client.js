// ./apollo-client.js

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://naplespark.stepzen.net/api/pondering-blackbird/__graphql",
    headers: {
      Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN}`
    },
    cache: new InMemoryCache(),
});

export default client;