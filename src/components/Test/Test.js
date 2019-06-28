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
      .then(x => x.json())
      .then(x => {
        this.setState({ testString: x })
      })
  }

  render() {
    return (
      <React.Fragment>
        <h1>{this.state.testString}</h1>
      </React.Fragment>
    )
  }
}
