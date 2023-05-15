import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { Checkbox } from '@broad/ui'

import { HaplogroupsTable } from './HaplogroupsTable'

const ControlSection = styled.div`
  margin-top: 1em;

  label {
    margin-left: 1em;
  }
`

export class TestComponent extends Component {


  constructor(props) {
    super(props)

    this.state = {
      includeAll: false
    }
  }

  render() {
    console.log("In TestComponent")
    console.log(this.props.haplogroups)

    const filtered_haplogroups = this.state.includeAll ? this.props.haplogroups : this.props.haplogroups.filter(hap => hap.ac_het > 0 || hap.ac_hom > 0)

    console.log(filtered_haplogroups)

    return (

      <div>
        <HaplogroupsTable
          haplogroups={filtered_haplogroups}
        />
        <ControlSection>
          Include:
          <Checkbox
            checked={this.state.includeAll}
            id="includeAll"
            label="All Haplogroups"
            onChange={includeAll => {
              this.setState({ includeAll })
            }}
          />
        </ControlSection>
      <br /><br /><br />
      </div>

    )
  }
}
