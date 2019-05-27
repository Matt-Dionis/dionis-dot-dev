'use strict';

module.exports = {
  url: 'https://dionis.dev',
  title: 'dionis.dev - A blog by Matt Dionis',
  subtitle: 'Musings on all things JavaScript with a focus on GraphQL, React, Vue, and programming soft skills.',
  copyright: `©${new Date().getFullYear()} All rights reserved.`,
  disqusShortname: '',
  postsPerPage: 4,
  googleAnalyticsId: 'UA-57688506-2',
  menu: [
    {
      label: 'Posts',
      path: '/'
    },
    {
      label: 'About me',
      path: '/pages/about'
    }
  ],
  author: {
    name: 'Matt Dionis',
    photo: '/photo.jpg',
    bio: 'Engineering Manager, GraphQL fanatic, chihuahua lover.',
    contacts: {
      email: 'mattdionis@gmail.com',
      twitter: 'mattdionis',
      github: 'matt-dionis'
    }
  }
};
