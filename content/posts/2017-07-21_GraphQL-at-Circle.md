---
title: GraphQL at Circle
date: "2017-07-21T22:21:26.679Z"
template: "post"
draft: false
slug: /posts/graphql-at-circle
category: ""
tags:
  - "JavaScript"
  - "GraphQL"
description: "How Circle makes use of GraphQL"
---

![](https://cdn-images-1.medium.com/max/1200/1*J3KCXkdSogjkMJdYadtEKw.png)

#### Why GraphQL?

At Circle we have many balances which we need to keep track of. Our customers hold balances with us, currently in US dollars 💵, British pound sterling 💷, and euros 💶. We also hold our own balances. Beyond these fiat currencies, Circle actively trades many cryptocurrencies. We need to have an up-to-date view in to each and every one of these balances. Beyond each balance, we also need a view in to the details of every currency we hold including properties such as currency symbol, subunits, and current market rate. Each type of balance (customer, Circle, exchange) is also queried from a different source; be it a database or internal API endpoint.

This all leads to several questions:

- How do we query our data efficiently when we need to hit multiple databases and internal API endpoints?
- How do we ensure we are not over-fetching or under-fetching data?
- How do we document all of the properties associated with accounts, balances, and currencies?

Thankfully, [GraphQL](http://graphql.org/) solves each of these issues! Instead of making many roundtrip API calls to get balances, currencies, etc. we can make one call to a GraphQL endpoint. Furthermore, we can pass a static query which asks for just the data we need, no more, no less. Finally, while building out our schema we can define each field so we end up with auto-generated documentation!

#### Project-specific Considerations

The internal application which we were adding GraphQL to was built with [AngularJS](https://angularjs.org/) and needed to remain in AngularJS, at least for the time being. Thankfully there is “AngularJS integration for the Apollo Client” in the form of [angular1-apollo](https://github.com/apollographql/angular1-apollo).

#### What does GraphQL architecture look like at Circle?

Schema design was the first task we needed to tackle. This is an extremely important piece of the GraphQL puzzle and we settled on a schema after several quick rounds of experimentation. Our schema has a root `accounts` array of type `Account` made up of several account-specific scalar types as well as an array of `Balance` objects and a `Currency` object.

```js
module.exports = new graphql.GraphQLObjectType({
  name: ‘Account’,
  fields: {
    accountType: {
      type: AccountType,
      description: ‘One of AccountType ENUM’
    },
    currencyCode: {
      type: graphql.GraphQLString,
      description: ‘Currency code of balance’
    },
    currency: {
      type: Currency,
      description: ‘The currency this balance is denoted in’,
      resolve: (root) => {
        return controllers.currencies.get(root.currencyCode);
      }
    },
    balances: {
      type: new graphql.GraphQLList(Balance),
      description: ‘List of balance entries’,
      resolve: (root) => {
        let balances = [];
        if (!_.isUndefined(root.amount)) {
          balances[0] = {
            timestamp: root.timestamp,
            amount: root.amount
          };
        } else {
          balances = root.balances;
        }
        return balances;
      }
    }
  }
});
```

That’s it! Our schema will inevitably grow and evolve, but for now it is fairly simple.

We have found it to be incredibly easy to tweak this schema as we experiment. Initially we had a root `Balance` type, but quickly realized this structure was less-than-ideal. It took about an hour of work and one pull request to update our schema and associated resolvers. Making a change like this to a REST API setup would have been a nightmare in comparison 😱.

We make heavy use of arguments in our GraphQL resolvers. Some of our views show all of our accounts, others show accounts for a specific account type or currency, some show our latest balances, others show historical balances over a time period. We simply pass optional arguments to our query depending on what that UI needs to show.

```js
apollo.query({
  query: gql`
    query($startDate: Date, $endDate: Date, $accountType: AccountType) {
      accounts(
        startDate: $startDate
        endDate: $endDate
        accountType: $accountType
      ) {
        accountType
        currency {
          currencyCode
          unitSymbol
          subunits
          rate
        }
        balances {
          timestamp
          amount
        }
      }
    }
  `,
  variables: {
    startDate: startDate,
    endDate: endDate,
    accountType: accountType
  }
});
```

The tooling that exists for GraphQL has been incredibly helpful in keeping our dev velocity very high for this project 🚀. We make heavy use of [graphiql](https://github.com/graphql/graphiql) when experimenting with new queries and also spend a ton of time in the [apollo-client-devtools](https://github.com/apollographql/apollo-client-devtools) to peek into our store.

#### The Future

In the future I would love to expand GraphQL use to other internal tools based on what we have learned from this great initial experience. I would also love to move from AngularJS to a more modern framework such as [VueJS](https://vuejs.org/) so we can take advantage of cutting edge GraphQL features such as subscriptions. Adding subscriptions to our existing GraphQL architecture would allow us to view balance movements in near real-time 📈!

GraphQL has been an awesome addition to our stack at Circle and has helped us solve several problems which existing REST API architecture struggle with mightily, namely: large numbers of roundtrip API calls, under-fetching and over-fetching of data, and auto-generated documentation.

Looking to introduce GraphQL at your company?

- Find a new project where you can introduce it without worrying about breaking existing functionality. This will often be an internal tool.
- Be prepared to defend your decision with specific examples of how GraphQL will solve significant problems.
- Get excited! Your excitement about this awesome new technology will go a long way in piquing the interest of others. Begin hacking together a “beta” version of your GraphQL server through [Apollo Launchpad](https://launchpad.graphql.com/new). A brief intro to this awesome tool can be found [here](https://engineering.circle.com/building-graphql-server-with-launchpad-2b9d42121662).

_Interested in building the future of money? We’re_ [_hiring_](https://jobs.lever.co/circle?lever-via=HvpG9MgLuI)_!_

**If you enjoyed this post please hit the little** 💚 **below to let me know you’d like more of this material! Thanks!** 🤓
