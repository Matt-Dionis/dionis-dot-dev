const axios = require('axios');

exports.handler = (event, context, callback) => {
  axios({
    url: 'https://fl2mq.sse.codesandbox.io/graphql',
    method: 'post',
    data: {
      query: `
        query getWeather {
          location(place: "Hollywood Sign") {
            city
            country
            weather {
              summary
              temperature
            }
          }
        }
        `
    }
  })
    .then((res) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(res.data),
      });
    })
    .catch((err) => {
      callback(err);
    });
};
