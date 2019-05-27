---
title: "Move Over Redux: Apollo-Client as a State Management Solution"
date: "2019-05-24T16:31:29.173Z"
template: "post"
draft: false
slug: /posts/move-over-redux
category: ""
tags:
  - "JavaScript"
  - "GraphQL"
  - "React"
  - "Apollo"
description: "Using apollo-client as a client-side state management solution"
---

![Use Apollo to launch GraphQL in your project!](https://cdn-images-1.medium.com/max/2560/1*NMzhN3iG7iQgWvu3NQfMzw.jpeg)
Use Apollo to launch GraphQL in your project!

### Background

On the Internal Tools team at [Circle](https://www.circle.com), we recently modernized a legacy PHP app by introducing React components. Just a handful of months after this initiative began we have close to one-hundred React components in this app! 😲

We recently reached a point where we found ourselves reaching for a state management solution. Note that it took many months and dozens of components before we reached this point. State management is often a tool that teams reach for well before they need it. While integrating a state management solution into an application no doubt comes with many benefits it also introduces complexity so don’t reach for it until you truly need it.

Speaking of complexity, one complaint about the typical “go-to” state management solution, [Redux](https://redux.js.org/), is that it requires too much boilerplate and can be difficult to hit-the-ground-running with. In this post, we will look at a more lightweight solution which comes with the added benefit of providing some basic GraphQL experience for those who choose to use it.

On the Circle 🛠 team, we know that our future stack includes GraphQL. In fact, in the ideal scenario, we would have a company-wide data graph at some point and access and mutate data consistently through GraphQL. However, in the short-term, we were simply looking for a low-friction way to introduce GraphQL to a piece of the stack and allow developers to wrap their heads around this technology in a low-stress way. GraphQL as a client-side state management solution using libraries such as [apollo-client](https://github.com/apollographql/apollo-client) felt like the perfect way to get started. Let’s take a look at the high-level implementation of a proof-of-concept for this approach!

### Configuring the client

First, there are a number of packages we’ll need to pull in:

```
yarn add @apollo/react-hooks apollo-cache-inmemory apollo-client graphql graphql-tag react react-dom
```

You _may_ be able to accomplish this with fewer packages by using [apollo-boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost) but I found the approach using the above packages easier. Below you’ll find `index.js` on the client in its entirety. We’ll walk through the client-side schema specific pieces next:

```jsx
import React from "react";
import ReactDOM from "react-dom";

import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";

import App from "./App";
import userSettings from "./userSettings";

const typeDefs = gql`
  type AppBarColorSetting {
    id: Int!
    name: String!
    setting: String!
  }

  type Query {
    appBarColorSetting: AppBarColorSetting!
  }

  type Mutation {
    updateAppBarColorSetting(setting: String!): AppBarColorSetting!
  }
`;

const resolvers = {
  Query: {
    appBarColorSetting: () => userSettings.appBarColorSetting
  },
  Mutation: {
    updateAppBarColorSetting: (_, { setting }) => {
      userSettings.appBarColorSetting.setting = setting;
      return userSettings.appBarColorSetting;
    }
  }
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  typeDefs,
  resolvers
});

const TogglesApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<TogglesApp />, document.getElementById("root"));
```

First, we define `typeDefs` and `resolvers`.

The `AppBarColorSetting` type will have required `id`, `name`, and `setting` fields. This will allow us to fetch and mutate the app bar’s color through GraphQL queries and mutations!

```graphql
type AppBarColorSetting {
  id: Int!
  name: String!
  setting: String!
}
```

Next up, we define the `Query` type so that we can fetch the `appBarColorSetting`:

```graphql
type Query {
  appBarColorSetting: AppBarColorSetting!
}
```

Finally, you guessed it, we need to define the `Mutation` type so that we can update `appBarColorSetting`:

```graphql
type Mutation {
  updateAppBarColorSetting(setting: String!): AppBarColorSetting!
}
```

Finally, we set up our client as you would typically, with one important difference. Often, you will find yourself instantiating `ApolloClient` with a`link` property. However, since we have declared the `typeDefs` and `resolvers` on the client, we do not need to use anything like `HttpLink` to connect to a GraphQL server:

```js
const client = new ApolloClient({
  cache: new InMemoryCache(),
  typeDefs,
  resolvers
});
```

That’s it! Now, simply pass this `client` to `ApolloProvider` and we’ll be ready to write our query and mutation! 🚀

```jsx
const TogglesApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
```

### Querying client-side data

We’re now going to query our client cache using GraphQL. Note that in this proof-of-concept, we simply define the initial state of our `userSettings` in a JSON blob:

```json
{
  "appBarColorSetting": {
    "id": 1,
    "name": "App Bar Color",
    "setting": "primary",
    "__typename": "AppBarColorSetting"
  }
}
```

_Note the need to define the type with the_ `___typename_` _property._

We then define our query in its own `.js` file. You could choose to define this in the same file the query is called from or even in a `.graphql` file though.

```js
import gql from "graphql-tag";

const APP_BAR_COLOR_SETTING_QUERY = gql`
  query appBarColorSetting {
    appBarColorSetting @client {
      id @client
      name @client
      setting @client
    }
  }
`;

export default APP_BAR_COLOR_SETTING_QUERY;
```

The most important thing to notice about this query is the use of the `@client` directive. We need to add this to both the `appBarColorSetting` query as well as each of the `id`, `name` and `setting` fields as they are all client-specific. Let’s take a look at how we call this query next:

```jsx
import React from "react";
import { useQuery } from "@apollo/react-hooks";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import SettingsComponent from "./components/SettingsComponent";
import APP_BAR_COLOR_SETTING_QUERY from "./graphql/APP_BAR_COLOR_SETTING_QUERY";

function App() {
  const { loading, data } = useQuery(APP_BAR_COLOR_SETTING_QUERY);

  if (loading) return <h2>Loading...</h2>;
  return (
    <div>
      <AppBar position="static" color={data.appBarColorSetting.setting}>
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            State Management with Apollo
          </Typography>
        </Toolbar>
      </AppBar>
      <SettingsComponent
        setting={
          data.appBarColorSetting.setting === "primary"
            ? "secondary"
            : "primary"
        }
      />
    </div>
  );
}

export default App;
```

_Note: we are using_ [_Material-UI_](https://material-ui.com/) _in this app, but obviously the UI framework choice is up to you. 🤷‍♂️_

Some bonus material: we are using the beta version of [apollo/react-hooks](https://www.npmjs.com/package/@apollo/react-hooks) here!

```js
const { loading, data } = useQuery(APP_BAR_COLOR_SETTING_QUERY);
```

We show a basic loading indicator and then render the app bar with `data.appBarColorSetting.setting` passed into the `color` attribute. If you are using the Apollo Client Developer Tools, you’ll be able to clearly see this data sitting in the cache.

![](https://cdn-images-1.medium.com/max/800/1*lfXIeGVZrB7mBHL0sVt6_w.png)

### Mutating client-side data and updating the cache

You may have noticed this block of code in our `App` component. This simply alternates the value of `setting` based on its current value and passes it to our `SettingsComponent`. We will take a look at this component and how it triggers a GraphQL mutation next.

```jsx
<SettingsComponent
  setting={
    data.appBarColorSetting.setting === "primary" ? "secondary" : "primary"
  }
/>
```

First, let’s take a peek at our mutation:

```js
import gql from "graphql-tag";

const UPDATE_APP_BAR_COLOR_SETTING_MUTATION = gql`
  mutation updateAppBarColorSetting($setting: String!) {
    updateAppBarColorSetting(setting: $setting) @client {
      setting @client
    }
  }
`;

export default UPDATE_APP_BAR_COLOR_SETTING_MUTATION;
```

Again, notice the use of the `@client` directive for our client-side `updateAppBarColorSetting` mutation and `setting` field. This mutation is very simple: pass in a required `setting` string, update the setting in the cache, return it.

Below you will find all the code within our `SettingsComponent` which utilizes this mutation:

```jsx
import React from "react";
import { useMutation } from "@apollo/react-hooks";

import Button from "@material-ui/core/Button";

import UPDATE_APP_BAR_COLOR_SETTING_MUTATION from "../graphql/UPDATE_APP_BAR_COLOR_SETTING_MUTATION";
import APP_BAR_COLOR_SETTING_QUERY from "../graphql/APP_BAR_COLOR_SETTING_QUERY";

function SettingsComponent({ setting }) {
  const [updateUserSetting] = useMutation(
    UPDATE_APP_BAR_COLOR_SETTING_MUTATION,
    {
      variables: { setting },
      update: cache => {
        let { appBarColorSetting } = cache.readQuery({
          query: APP_BAR_COLOR_SETTING_QUERY
        });
        appBarColorSetting.setting = setting;
        cache.writeQuery({
          query: APP_BAR_COLOR_SETTING_QUERY,
          data: { appBarColorSetting }
        });
      }
    }
  );
  return (
    <div style={{ marginTop: "50px" }}>
      <Button variant="outlined" color="primary" onClick={updateUserSetting}>
        Change color
      </Button>
    </div>
  );
}

export default SettingsComponent;
```

The interesting piece of this code that we want to focus on is the following:

```js
const [updateUserSetting] = useMutation(UPDATE_APP_BAR_COLOR_SETTING_MUTATION, {
  variables: { setting },
  update: cache => {
    let { appBarColorSetting } = cache.readQuery({
      query: APP_BAR_COLOR_SETTING_QUERY
    });
    appBarColorSetting.setting = setting;
    cache.writeQuery({
      query: APP_BAR_COLOR_SETTING_QUERY,
      data: { appBarColorSetting }
    });
  }
});
```

Here, we make use of the apollo/react-hooks `useMutation` hook, pass it our mutation and variables, then update the cache within the `update` method. We first read the current results for the `APP_BAR_COLOR_SETTING_QUERY` from the cache then update `appBarColorSetting.setting` to the `setting` passed to this component as a `prop`, then write the updated `appBarColorSetting` back to `APP_BAR_COLOR_SETTING_QUERY`. This triggers our app bar to update with the new color! We are now utilizing apollo-client as a client-side state management solution! 🚀

![](https://cdn-images-1.medium.com/max/800/1*ruhx_t_ZbBWWDRiViplImg.gif)

### Takeaways

If you’d like to dig into the code further, the [CodeSandbox can be found here](https://codesandbox.io/s/eloquent-johnson-fym98). This is admittedly a very contrived example but it shows how easy it can be to [leverage apollo-client as a state management solution](https://www.apollographql.com/docs/react/essentials/local-state). This can be an excellent way to introduce GraphQL and the Apollo suite of libraries and tools to a team who has little to no GraphQL experience. Expanding use of GraphQL is simple once this basic infrastructure is in place.

I would love to hear thoughts and feedback from everyone and I hope you learned something useful through this post!
