import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { Checkbox } from '@broad/ui'

//import { HaplogroupsTable } from './HaplogroupsTable'

const ControlSection = styled.div`
  margin-top: 1em;

  label {
    margin-left: 1em;
  }
`

export class sfariHaplogroupsTable extends Component {

  /*
  static propTypes = {
    haplogroups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ac_het: PropTypes.number.isRequired,
        ac_hom: PropTypes.number.isRequired,
        an: PropTypes.number.isRequired,
      })
    ).isRequired,
  }
  */

  /*
  static defaultProps = {
    //showHemizygotes: true,
    showHomozygotes: true,
    showHemizygotes: false,
  }

  
  constructor(props) {
    console.log("In here")
    super(props)

    this.state = {
      includeExomes: props.exomePopulations.length !== 0,
      includeGenomes: props.genomePopulations.length !== 0,
      includeSSCGenomes: props.sscGenomePopulations.length !== 0,
    }

  }
  */

  componentDidMount() {
    console.log("In componentDidMount")

  }

  render() {
 
    //console.log(combinedPopulations)
    //console.log(this.props.gnomadAF)
    console.log("In sfariHaplogroupsTable")
    console.log(this.props.haplogroups)
    // const combinedPopulations = combinePopulations(this.props.exomePopulations)

    return (
      <div>
        More text
        {/*<HaplogroupsTable
          haplogroups={this.props.haplogroups}
        />*/}
        {/*<ControlSection>
          Include:
          <Checkbox
            checked={this.state.includeExomes}
            disabled={
              this.props.exomePopulations.length === 0 ||
              (this.state.includeExomes && !this.state.includeSSCGenomes && !this.state.includeGenomes)
            }
            id="includeExomePopulations"
            label="SPARK Exomes"
            onChange={includeExomes => {
              this.setState({ includeExomes })
            }}
          />
          <Checkbox
            checked={this.state.includeGenomes}
            disabled={
              this.props.genomePopulations.length === 0 ||
              (!this.state.includeExomes && !this.state.includeSSCGenomes && this.state.includeGenomes)
            }
            id="includeGenomePopulations"
            label="SPARK Genomes"
            onChange={includeGenomes => {
              this.setState({ includeGenomes })
            }}
          />
          <Checkbox
            checked={this.state.includeSSCGenomes}
            disabled={
              this.props.sscGenomePopulations.length === 0 ||
              (!this.state.includeExomes && !this.state.includeGenomes && this.state.includeSSCGenomes)
            }
            id="includeSSCGenomePopulations"
            label="SSC Genomes"
            onChange={includeSSCGenomes => {
              this.setState({ includeSSCGenomes })
            }}
          />
        </ControlSection>*/}
      </div>
    )
  }
}



