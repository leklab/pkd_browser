import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { BaseTable, TextButton } from '@broad/ui'


const POPULATION_NAMES = {
  afr: 'African',
  amr: 'Latino',
  ASJ: 'Ashkenazi Jewish',
  eas: 'East Asian',
  fin: 'European (Finnish)',
  eur: 'European',

  nfe: 'European (non-Finnish)',
  oth: 'Other',
  sas: 'South Asian',

}


const Table = styled(BaseTable)`
  tr.border td {
    border-bottom: 2px solid #aaa;
  }
  td {
    text-align: center;
  }

`

const TogglePopulationButton = styled(TextButton)`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-left: ${props => (props.isExpanded ? '15px' : '10px')};
  background-image: ${props =>
    props.isExpanded
      ? 'url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7)'
      : 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAVCAYAAABhe09AAAAATElEQVQoU2NkQAOM9BFQ1jXYf/fyBUeYbYzKugb/GRgYDsAEYQIgBWBBZAGwIIoA438GhAoQ586VCxAVMA5ID6OKjoEDSAZuLV18CwAQVSMV/9L8fgAAAABJRU5ErkJggg==)'};
  background-position: center left ${props => (props.isExpanded ? '-5px' : '0')};
  background-repeat: no-repeat;
  color: inherit;
  text-align: left;
`

export class MitoPopTable extends Component {
  static propTypes = {
    populations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ac_het: PropTypes.number.isRequired,
        ac_hom: PropTypes.number.isRequired,
        // ac_hemi: PropTypes.number.isRequired,
        an: PropTypes.number.isRequired,
      })
    ).isRequired,
  }

  static defaultProps = {
    columnLabels: {},
  }

  state = {
    sortBy: 'name',
    sortAscending: false,
  }

  setSortBy(sortBy) {
    this.setState(state => ({
      sortBy,
      sortAscending: sortBy === state.sortBy ? !state.sortAscending : state.sortAscending,
    }))
  }

  renderColumnHeader(key, label, colSpan = undefined) {
    let ariaSortAttr = 'none'
    if (this.state.sortBy === key) {
      ariaSortAttr = this.state.sortAscending ? 'ascending' : 'descending'
    }

    return (
      <th colSpan={colSpan} aria-sort={ariaSortAttr} scope="col">
        <button type="button" onClick={() => this.setSortBy(key)}>
          {label}
        </button>
      </th>
    )
  }


  render() {
    // Hack to support alternate column labels for MCNV structural variants
    const { columnLabels } = this.props

    /*
    const haplogroups = this.props.haplogroups.sort((a,b) => {
        const [hap1, hap2] = this.state.sortAscending ? [a, b] : [b, a]

        return this.state.sortBy === 'name'
          ? hap1.id.localeCompare(hap2.id)
          : hap1[this.state.sortBy] - hap2[this.state.sortBy]
      })      
  */
    console.log("In MitoPopTable")
    //console.log(showGnomad)


    const populations = this.props.populations.sort((a,b) => {
        const [pop1, pop2] = this.state.sortAscending ? [a, b] : [b, a]

        return this.state.sortBy === 'name'
          ? POPULATION_NAMES[pop1.id].localeCompare(POPULATION_NAMES[pop2.id])
          : pop1[this.state.sortBy] - pop2[this.state.sortBy]
      })      


    /*
    const populations = this.props.populations.map( x => {
      x.name =  

      return x
    })
    */

    console.log(populations)
    //console.log(gnomad_male_af)
    //console.log(gnomad_female_af)

    return (
      <Table>
        <thead>
          <tr>
            {this.renderColumnHeader('name', 'Population', 1)}
            {this.renderColumnHeader('ac_het', columnLabels.ac_het || 'Het Allele Count')}
            {this.renderColumnHeader('ac_hom', columnLabels.ac_hom || 'Hom Allele Count')}
            {this.renderColumnHeader('an', columnLabels.an || 'Allele Number')}
          </tr>
        </thead>

        {populations.map(pop => (
          <tbody key={pop.id}>
            <tr
              key={pop.id}
            >
              <td>{POPULATION_NAMES[pop.id]}</td>
              <td>{pop.ac_het}</td>
              <td>{pop.ac_hom}</td>
              <td>{pop.an}</td>
            </tr>
          </tbody>
        ))}



      </Table>
    )
  }
}
