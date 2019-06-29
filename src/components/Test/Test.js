// @flow
import React from 'react'

export default class Test extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      testString: ''
    }
  }

  componentDidMount() {
    fetch(
      '/.netlify/functions/test'
    )
      .then(res => res.json())
      .then(data => {
        const { msg } = data;
        this.setState({ testString: msg })
      });
  }

  render() {
    return (
      <React.Fragment>
        <h1>{this.state.testString}</h1>
      </React.Fragment>
    )
  }
}
