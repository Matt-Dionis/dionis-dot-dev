// @flow
import React from "react";

export default class Test extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: {
        weather: {}
      },
      loading: true
    };
  }

  componentDidMount() {
    fetch("/.netlify/functions/axios")
      .then(res => res.json())
      .then(res => {
        const { data } = res;
        const { location } = data;
        this.setState({ location, loading: false });
      });
  }

  render() {
    const divStyle = {
      border: "2px solid #290aa0",
      padding: "10px",
      borderRadius: "25px"
    };
    const h3Style = {
      color: "#00ad9e",
      marginTop: 0
    };
    const pStyle = {
      color: "#f25cc1",
      marginBottom: 0
    };
    const { loading, location } = this.state;
    const { weather } = location;

    if (loading) {
      return <h3 style={h3Style}>Loading weather conditions...</h3>
    }
    return (
      <div style={divStyle}>
        <h3 style={h3Style}>
          Current weather in {location.city} fetched through{" "}
          <a href="https://www.netlify.com/docs/functions/" target="_blank">
            Netlify Function
          </a>{" "}
          calling{" "}
          <a
            href="https://www.apollographql.com/docs/apollo-server/federation/introduction/"
            target="_blank"
          >
            Apollo Federated
          </a>{" "}
          gateway:
        </h3>
        <p style={pStyle}>
          {weather.summary} with a temperature of{" "}
          {Math.round(weather.temperature)}
        </p>
      </div>
    );
  }
}
