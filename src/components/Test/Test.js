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
      .then(x => console.log(x))
  }

  render() {
    return (
      <React.Fragment>
        <h1>Test</h1>
      </React.Fragment>
    )
  }
}
