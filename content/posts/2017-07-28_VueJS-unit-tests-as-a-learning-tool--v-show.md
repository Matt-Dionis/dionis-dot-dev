---
title: "VueJS unit tests as a learning tool: v-show"
date: "2017-07-28T00:08:37.272Z"
template: "post"
draft: false
slug: /posts/vuejs-unit-tests-as-a-learning-tool-v-show
category: ""
tags:
  - "JavaScript"
  - "VueJS"
description: "Digging into the v-show unit tests to better understand VueJS"
---

![v-show: “Now you see me, now you don’t.” Photo by [Mike Wilson](http://unsplash.com/photos/8lrNAqiBpUQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)](https://cdn-images-1.medium.com/max/2560/1*7VuCbteTMZ-nClCXiHbfHw.jpeg)
v-show: “Now you see me, now you don’t.” Photo by [Mike Wilson](http://unsplash.com/photos/8lrNAqiBpUQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

_This is the first post in a series which will dive into unit tests within the_ [_VueJS code base_](https://github.com/vuejs/vue) _in order to gain a deeper understanding of how elements within the Vue ecosystem work._

_Beyond alerting one to regressions in a code base, well-written unit tests read like simple sentences and help those working on a project to understand what individual features do. Unit tests can also serve as great templates for documentation if they are written well as they should describe what a feature does and how it reacts to different inputs._

_The_ [_VueJS documentation_](https://vuejs.org/v2/api/) _is excellent, but recently I decided to dig even deeper and begin exploring the source code behind Vue! The first piece of the code base I visited was the_ [_tests directory_](https://github.com/vuejs/vue/tree/dev/test)_. Most of you have surely heard of_ [_Test Driven Development (TDD)_](https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3)_. Well, in this series I would like to introduce you to Test Driven Learning (TDL). The idea is to begin reading through the unit tests of the framework or library you are using early in order to gain a deeper understanding of how individual features work. TDL also has a beneficial side-effect in that it will reinforce the benefits of writing unit tests in your own projects and reveal solid testing patterns._

#### ‘v-show’ unit tests

In this first post in the series we will take a look at the `v-show` directive. The unit tests in full can be found [here](https://github.com/vuejs/vue/blob/abfb4589a826936ae1a4422cc3db50805ddee831/test/unit/features/directives/show.spec.js), but we will be walking through them piece-by-piece below. Below is the beginning of the `v-show` test spec. The first thing you’ll notice is just how easy it is to write unit tests with VueJS. Discussion of testing frameworks, test runners, and Vue-specific testing is beyond the scope of this series, but is something I plan on writing about in the future. The next thing you may notice is that these tests are nicely written and do indeed read as simple sentences:

> Directive v-show should check show value is truthy.

> Directive v-show should check show value is falsy.

```js
import Vue from 'vue'

describe('Directive v-show', () => {
  it('should check show value is truthy', () => {
    const vm = new Vue({
      template: '<div><span v-show="foo">hello</span></div>',
      data: { foo: true }
    }).$mount()
    expect(vm.$el.firstChild.style.display).toBe('')
  })

  it('should check show value is falsy', () => {
    const vm = new Vue({
      template: '<div><span v-show="foo">hello</span></div>',
      data: { foo: false }
    }).$mount()
    expect(vm.$el.firstChild.style.display).toBe('none')
  })
```

Let’s dive into that first test now. A new Vue instance is set up with a simple template which contains `v-show=”foo”`. This `foo` variable is set to `true` within the `data` property. The `expect` line reveals what this directive does, it appears that it alters the `display` property of the CSS style of the element which `v-show` is an attribute of. When the variable tied to `v-show`, in this case `foo`, is truthy, `display` is set to an empty string. Hmmm this doesn’t seem to actually tell us much. Let’s move on to the next test to see if we can learn a bit more.

The next test is very similar with two key differences: `foo` is set to `false`, and we expect `display` to be “none” in this case. Now we’re getting somewhere! An element with a `v-show` directive which evaluates to `false` will be hidden from the UI by having its `display` set to “none”. Nice! We have learned something important about `v-show` beyond the fact that it hides an element, it does NOT actually remove said element from the DOM. This functionality belongs to another directive, `v-if`, which we will analyze in a future post.

Clearly the variable tied to `v-show` could change throughout the lifecycle of a component. So what happens as `v-show` evaluates to different values? The next set of tests explain this in detail!

```js
it("should update show value changed", done => {
  const vm = new Vue({
    template: '<div><span v-show="foo">hello</span></div>',
    data: { foo: true }
  }).$mount();
  expect(vm.$el.firstChild.style.display).toBe("");
  vm.foo = false;
  waitForUpdate(() => {
    expect(vm.$el.firstChild.style.display).toBe("none");
    vm.foo = {};
  })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("");
      vm.foo = 0;
    })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("none");
      vm.foo = [];
    })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("");
      vm.foo = null;
    })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("none");
      vm.foo = "0";
    })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("");
      vm.foo = undefined;
    })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("none");
      vm.foo = 1;
    })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("");
    })
    .then(done);
});
```

The beginning of this set of tests reveals what we may have expected: as `foo` is toggled from `true` to `false` the `display` toggles from an empty string to “none”. Below this you’ll learn which values are considered “truthy” and “falsy” by the `v-show` directive. Namely: an empty object, empty array, string, or number other than 0 are “truthy” while 0, `null`, and `undefined` are falsy. Sweet! We are developing a solid understanding of `v-show` at this point as well as an appreciation for thorough unit testing.

So we’ve seen that `display` alternates between an empty string or “none” depending on the “truthiness” of the value `v-show` evaluates to, but what if `display` is set to something else on the element? The next set of tests reveal the answer!

```js
it("should respect display value in style attribute", done => {
  const vm = new Vue({
    template:
      '<div><span v-show="foo" style="display:block">hello</span></div>',
    data: { foo: true }
  }).$mount();
  expect(vm.$el.firstChild.style.display).toBe("block");
  vm.foo = false;
  waitForUpdate(() => {
    expect(vm.$el.firstChild.style.display).toBe("none");
    vm.foo = true;
  })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("block");
    })
    .then(done);
});
```

If `display` is set on the same element that contains `v-show` it will be respected if the value tied to `v-show` is “truthy”. An element with `display: block` will retain this style as long as `foo` is “truthy”. On the other hand, `display: none` will be set for “falsy” values. These tests also reveal that the original `display` setting is retained even as `v-show` flips back-and-forth between “truthy” and “falsy” values.

There’s just one more small set of tests to take a look at. This test wraps the `span` containing `v-show` in a `div` containing `v-if` and toggles `v-if` back-and-forth. The important point to understand, which we will dig into deeper in the `v-if` specific post, is that when `v-if` evaluates to a “falsy” value its containing element and all children are removed from the DOM. These tests simply reveal that `v-show` behaves as expected even when wrapped within a `v-if` directive.

```js
it("should support unbind when reused", done => {
  const vm = new Vue({
    template:
      '<div v-if="tester"><span v-show="false"></span></div>' +
      '<div v-else><span @click="tester=!tester">show</span></div>',
    data: { tester: true }
  }).$mount();
  expect(vm.$el.firstChild.style.display).toBe("none");
  vm.tester = false;
  waitForUpdate(() => {
    expect(vm.$el.firstChild.style.display).toBe("");
    vm.tester = true;
  })
    .then(() => {
      expect(vm.$el.firstChild.style.display).toBe("none");
    })
    .then(done);
});
```

We now have a solid understanding of how `v-show` works and should feel confident that we could utilize it in our own apps, and we have yet to even take a peek at the docs! With that said, let’s turn to the docs now to see what they reveal.

#### ‘v-show’ docs

The [v-show API docs section](https://vuejs.org/v2/api/#v-show) should make complete sense to us now that we have studied the unit tests:

![](https://cdn-images-1.medium.com/max/800/1*XwliOzrvi2D453M3O_bLRQ.png)

As I mentioned earlier, the VueJS docs are excellent, but I would argue that reading through the unit tests behind `v-show` taught us all that the docs reveal and more in just a couple minutes of reading! Also, as I mentioned, reading through the tests taught us how unit tests should be written and how thorough they should be. Writing similar tests for features within your own apps should become a priority for you and your team!

#### Next up

In the [next post](https://medium.com/vuefinder/vuejs-unit-tests-as-a-learning-tool-v-if-ad66f1c363ff) we take a deep-dive into `v-if` through its unit tests!

**If you enjoyed this post please hit the little** 💚 **below to let me know you’d like more of this material! Thanks!** 🤓

_Interested in building the future of money at_ [_Circle_](https://www.circle.com)_? We’re_ [_hiring_](https://jobs.lever.co/circle?lever-via=HvpG9MgLuI)_!_
