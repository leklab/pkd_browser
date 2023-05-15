import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { Checkbox } from '@broad/ui'

import { MitoPopTable } from './MitoPopTable'

const ControlSection = styled.div`
  margin-top: 1em;

  label {
    margin-left: 1em;
  }
`

export class AnotherComponent extends Component {


  render() {
    console.log("In TestComponent2")
    console.log(this.props.populations)

    return (

      <div>
        <MitoPopTable
          populations={this.props.populations}
        />
      </div>

    )
  }
}
