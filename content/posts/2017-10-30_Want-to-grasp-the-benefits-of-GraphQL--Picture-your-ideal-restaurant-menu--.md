---
title: Want to grasp the benefits of GraphQL? Picture your ideal restaurant menu.
date: "2017-10-30T15:01:39.267Z"
template: "post"
draft: false
slug: /posts/want-to-grasp-the-benefits-of-graphql-picture-your-ideal-restaurant-menu
category: ""
tags:
  - "JavaScript"
  - "GraphQL"
description: The benefits of GraphQL over REST APIs.
---

![](https://cdn-images-1.medium.com/max/2560/1*N4uOGPQW12aOZ1A2zQpRYg.jpeg)

Let’s set the scene: It’s a fall Friday evening and you have just been seated at a restaurant you have been excited to try, _The Underfetching Farmhouse_. The waiter brings over the menu and you immediately notice that it seems, well…_sparse_. In the middle of this sheet of white paper are four words: appetizers, entrees, drinks, dessert. Not wanting to embarrass yourself you decide to just “go with the flow”. Hey, maybe this is a new “hip and edgy” way to order. Play it cool. The waiter returns a few minutes later and you state that you are interested in appetizers, entrees, and drinks. The waiter nods in approval and heads off in a hurry. He returns with an appetizers menu then scoots off again. A minute later he is back again with a list of entrees. He runs back to his station yet again and then quickly returns with a drink menu. While progress has certainly been made, you are still rather underwhelmed with what has been provided to you. You now know what appetizers, entrees, and drinks are available, but that’s it. No descriptions, no prices. Turns out the waiter will have to make another roundtrip for the description of each menu item you are interested in and yet another for the price. _Underfetching_ indeed! You’ve had enough and decide to leave and try another spot down the street.

You arrive at the second restaurant of the evening, _The Organic Overfetch_, ready to quickly order as you are now starving. When your waiter greets you, you explain your recent experience and the waiter giggles as he promises you will not run into the same frustration at this establishment. He leaves for what feels like an eternity and when he returns he places what appears to be a medium-sized novel on the table. You slowly open this book and realize it is the menu. There are categories, menu items, descriptions, ingredients, prices, nutritional information, images, chef biographies. Try as you may, you become lost in this menu and have a very difficult time finding the information you are interested in. In your frustration you storm out of this business as well.

As you reach the sidewalk you glance across the street and notice a new restaurant that you have been hearing a lot of chatter about. The _GraphQL Cafe_ is beckoning and you decide to give it a try. You are quickly seated and the waiter asks you what information you would like on your menu. This seems like an odd question, but you play along. “I would like to see the name, description, and price for each of your appetizers, entrees, and drinks”, you say. Within seconds your waiter returns with a small menu matching exactly what you requested. You order and settle in for a relaxing dinner thinking, “this is the way it _should_ be.”

If you’ve worked with REST APIs, you can surely relate to this poor diner’s experience at _The Underfetching Farmhouse_ and _The Organic Overfetch._ As developers, we are constantly trying to balance how much data we return from our API endpoints. Do you provide just enough and then make the client call additional endpoints to get more details? Do you provide everything the client could possibly need in one giant data blob? Thankfully there is now another option. GraphQL solves both the underfetching and overfetching problems by allowing clients to ask for exactly what they need from the server. Want to see the `name`, `description`, and `price` for `entrees`? Just call your single `/graphql` endpoint with this simple, descriptive query:

```graphql
query getMenu(category: String!) {
  menu(category: “entrees”) {
    name
    description
    price
  }
}
```

There are many more benefits and tons of exciting possibilities that GraphQL makes possible! This post is simply meant to point out two of the major issues that GraphQL solves and hopefully get you excited about digging deeper. To learn more about the technical “nitty-gritty” check out the [GraphQL spec](http://facebook.github.io/graphql/October2016/).🤓 For some awesome step-by-step tutorials about all things GraphQL, both server-side and client-side, check out [HowToGraphQL](https://www.howtographql.com/). You may want to get started with GraphQL through a backend development framework. If so, check out [Graphcool](https://www.graph.cool/).😎 For an incredible suite of tools to help you optimize the apps you build with GraphQL, there is no better option than [Apollo](http://dev.apollodata.com/)!🚀 Also, feel free to reach out to me on [Twitter](https://twitter.com/MattDionis). I am always excited to talk all things GraphQL!😍
