//import gqlFetch from 'graphql-fetch'
import 'whatwg-fetch'

import PropTypes from 'prop-types'
import { Component } from 'react'

const areVariablesEqual = (variables, otherVariables) => {
  const keys = Object.keys(variables)
  const otherKeys = Object.keys(otherVariables)
  if (keys.length !== otherKeys.length) {
    return false
  }
  return keys.every(key => variables[key] === otherVariables[key])
}

const cancelable = promise => {
  let isCanceled = false
  const wrapper = new Promise((resolve, reject) => {
    promise.then(
      value => {
        if (!isCanceled) {
          resolve(value)
        }
      },
      error => {
        if (!isCanceled) {
          reject(error)
        }
      }
    )
  })

  return {
    cancel: () => {
      isCanceled = true
    },
    promise: wrapper,
  }
}

export class Query extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    url: PropTypes.string,
    variables: PropTypes.object,
  }

  static defaultProps = {
    //url: process.env.GNOMAD_API_URL,
    url: '/api/',
    variables: {},
  }

  state = {
    data: null,
    error: null,
    graphQLErrors: null,
    loading: true,
  }

  componentDidMount() {
    this.mounted = true
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.query !== prevProps.query ||
      !areVariablesEqual(this.props.variables, prevProps.variables)
    ) {
      this.loadData()
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  loadData() {
    console.log("In query - loadData")
    console.log(this.props.query)

    this.setState({
      loading: true,
      error: null,
      graphQLErrors: null,
    })

    if (this.currentRequest) {
      this.currentRequest.cancel()
    }

    this.currentRequest = cancelable(
      //gqlFetch(process.env.GNOMAD_API_URL)(this.props.query, this.props.variables)
      //gqlFetch(this.props.url)(this.props.query, this.props.variables)

      fetch(this.props.url, {
        body: JSON.stringify({
          query: this.props.query,
          variables: this.props.variables,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }}).then(response => response.json())
    )
    this.currentRequest.promise.then(
      response => {
        if (!this.mounted) {
          return
        }
        this.setState({
          data: response.data,
          error: null,
          graphQLErrors: response.errors,
          loading: false,
        })
      },
      error => {
        if (!this.mounted) {
          return
        }
        this.setState({
          data: null,
          error,
          graphQLErrors: null,
          loading: false,
        })
      }
    )
  }

  render() {
    return this.props.children(this.state)
  }
}
