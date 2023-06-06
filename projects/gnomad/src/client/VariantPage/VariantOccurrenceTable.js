import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { QuestionMark } from '@broad/help'
import { Badge, TooltipAnchor } from '@broad/ui'

import QCFilter from '../QCFilter'

const Table = styled.table`
  /* To vertically align with the right column's heading */
  margin-top: 1.25em;

  th {
    font-weight: bold;
  }

  th[scope='col'] {
    padding-left: 30px;
    text-align: left;
  }

  th[scope='row'] {
    text-align: right;
  }

  td {
    padding-left: 30px;
    line-height: 1.5;
  }
`

const NoWrap = styled.span`
  white-space: nowrap;
`

const renderGnomadVariantFlag = (variant, exomeOrGenome) => {
  if (!variant[exomeOrGenome]) {
    return <Badge level="error">No variant</Badge>
  }
  const filters = variant[exomeOrGenome].filters
  if (filters.length === 0) {
    return <Badge level="success">Pass</Badge>
  }
  return filters.map(filter => <QCFilter key={filter} filter={filter} />)
}

const POPULATION_NAMES = {
  AFR: 'African',
  AMR: 'Latino',
  ASJ: 'Ashkenazi Jewish',
  EAS: 'East Asian',
  FIN: 'European (Finnish)',
  NFE: 'European (non-Finnish)',
  OTH: 'Other',
  SAS: 'South Asian',
}

const TextTooltip = ({ tooltip }) => <span>{tooltip}</span>

const FilteringAlleleFrequencyValue = styled.span`
  border-bottom: 1px dashed #000;

  @media print {
    border-bottom: none;
  }
`

const FilteringAlleleFrequencyPopulation = styled.div`
  display: none;
  white-space: nowrap;

  @media print {
    display: block;
  }
`

//const FilteringAlleleFrequency = ({ popmax, popmax_population: popmaxPopulation }) => {
const FilteringAlleleFrequency = (popmax, popmaxPopulation ) => {  
  if (popmax === null) {
    return <span>—</span>
  }

  if (popmax === 0) {
    return <span>0</span>
  }

  return (
    <span>
      <TooltipAnchor tooltip={POPULATION_NAMES[popmaxPopulation]} tooltipComponent={TextTooltip}>
        <FilteringAlleleFrequencyValue>{popmax.toPrecision(4)}</FilteringAlleleFrequencyValue>
      </TooltipAnchor>
      <FilteringAlleleFrequencyPopulation>
        {POPULATION_NAMES[popmaxPopulation.toUpperCase()]}
      </FilteringAlleleFrequencyPopulation>
    </span>
  )
}

FilteringAlleleFrequency.propTypes = {
  popmax: PropTypes.number,
  popmax_population: PropTypes.string,
}

FilteringAlleleFrequency.defaultProps = {
  popmax: null,
  popmax_population: null,
}

export const GnomadVariantOccurrenceTable = ({ variant }) => {
  const isPresentInExome = Boolean(variant.bpkd_exome)
 //const isPresentInGenome = Boolean(variant.spark_genome)
 //const isPresentInSSCGenome = Boolean(variant.ssc_genome)

  const exomeAlleleCount = isPresentInExome ? variant.bpkd_exome.ac : 0
  const exomeAlleleNumber = isPresentInExome ? variant.bpkd_exome.an : 0
  //const genomeAlleleCount = isPresentInGenome ? variant.spark_genome.ac : 0
  //const genomeAlleleNumber = isPresentInGenome ? variant.spark_genome.an : 0

  
  //const sscGenomeAlleleCount = isPresentInSSCGenome ? variant.ssc_genome.ac : 0
  //const sscGenomeAlleleNumber = isPresentInSSCGenome ? variant.ssc_genome.an : 0

  const exomeAlleleFrequency = exomeAlleleNumber === 0 ? 0 : exomeAlleleCount / exomeAlleleNumber
  //const genomeAlleleFrequency = genomeAlleleNumber === 0 ? 0 : genomeAlleleCount / genomeAlleleNumber
  //const sscGenomeAlleleFrequency = sscGenomeAlleleNumber === 0 ? 0 : sscGenomeAlleleCount / sscGenomeAlleleNumber


  const exomeHomCount = isPresentInExome ? variant.bpkd_exome.ac_hom : 0
  //const genomeHomCount = isPresentInGenome ? variant.spark_genome.ac_hom : 0
  //const sscGenomeHomCount = isPresentInSSCGenome ? variant.ssc_genome.ac_hom : 0

  //const totalAlleleCount = exomeAlleleCount + genomeAlleleCount + sscGenomeAlleleCount
  //const totalAlleleNumber = exomeAlleleNumber + genomeAlleleNumber + sscGenomeAlleleNumber

  const totalAlleleCount = exomeAlleleCount
  const totalAlleleNumber = exomeAlleleNumber

  //const totalHomCount = exomeHomCount + genomeHomCount + sscGenomeHomCount
  //const totalAlleleFrequency = totalAlleleNumber === 0 ? 0 : totalAlleleCount / totalAlleleNumber

  const totalHomCount = exomeHomCount
  const totalAlleleFrequency = totalAlleleNumber === 0 ? 0 : totalAlleleCount / totalAlleleNumber

  //const gnomad_faf95_popmax = variant.gnomad_faf95_popmax
  //const gnomad_faf95_population = variant.gnomad_faf95_population


  
  return (
    <Table>
      <tbody>
        <tr>
          <td />
          <th scope="col">Exomes</th>
          <th scope="col">Total</th>
        </tr>
        <tr>
          <th scope="row">Allele Count</th>
          <td>{isPresentInExome && exomeAlleleCount}</td>
          <td>{totalAlleleCount}</td>
        </tr>
        <tr>
          <th scope="row">Allele Number</th>
          <td>{isPresentInExome && exomeAlleleNumber}</td>
          <td>{totalAlleleNumber}</td>          
        </tr>
        <tr>
          <th scope="row">Allele Frequency</th>
          <td>{isPresentInExome && exomeAlleleFrequency.toPrecision(4)}</td>
          <td>{totalAlleleFrequency.toPrecision(4)}</td>          
        </tr>
        <tr>
          <th scope="row">Number of homozygotes</th>
          <td>{isPresentInExome && exomeHomCount}</td>
          <td>{totalHomCount}</td>
        </tr>
      </tbody>
    </Table>
  )

  /*
  return (
    <Table>
      <tbody>
        <tr>
          <td />
          <th scope="col">SPARK Exomes</th>
          <th scope="col">SPARK Genomes</th>
          <th scope="col">SSC Genomes</th>
          <th scope="col">Total</th>
        </tr>
        {<tr>
          <th scope="row">Filter</th>
          <td>{renderGnomadVariantFlag(variant, 'exome')}</td>
        </tr>}
        <tr>
          <th scope="row">Allele Count</th>
          <td>{isPresentInExome && exomeAlleleCount}</td>
          <td>{isPresentInGenome && genomeAlleleCount}</td>
          <td>{isPresentInSSCGenome && sscGenomeAlleleCount}</td>
          <td>{totalAlleleCount}</td>
        </tr>
        <tr>
          <th scope="row">Allele Number</th>
          <td>{isPresentInExome && exomeAlleleNumber}</td>
          <td>{isPresentInGenome && genomeAlleleNumber}</td>
          <td>{isPresentInSSCGenome && sscGenomeAlleleNumber}</td>
          <td>{totalAlleleNumber}</td>          
        </tr>
        <tr>
          <th scope="row">Allele Frequency</th>
          <td>{isPresentInExome && exomeAlleleFrequency.toPrecision(4)}</td>
          <td>{isPresentInGenome && genomeAlleleFrequency.toPrecision(4)}</td>
          <td>{isPresentInSSCGenome && sscGenomeAlleleFrequency.toPrecision(4)}</td>
          <td>{totalAlleleFrequency.toPrecision(4)}</td>          
        </tr>
        <tr>
          <th scope="row">Number of homozygotes</th>
          <td>{isPresentInExome && exomeHomCount}</td>
          <td>{isPresentInGenome && genomeHomCount}</td>
          <td>{isPresentInSSCGenome && sscGenomeHomCount}</td>
          <td>{totalHomCount}</td>
        </tr>
        <tr>
          <th scope="row">Popmax Filtering AF</th>
          <td></td>
          <td></td>
          <td></td>
          <td>{FilteringAlleleFrequency(gnomad_faf95_popmax,gnomad_faf95_population)}</td>
        </tr>        
      </tbody>
    </Table>
  )*/
}

GnomadVariantOccurrenceTable.propTypes = {
  variant: PropTypes.shape({
    bpkd_exome: PropTypes.shape({
      ac: PropTypes.number.isRequired,
      an: PropTypes.number.isRequired,
      ac_hom: PropTypes.number.isRequired,
      /*faf95: PropTypes.shape({
        popmax: PropTypes.number,
        popmax_population: PropTypes.string,
      }).isRequired,*/
    }),
    

  }).isRequired,
}

/* <Table>
      <tbody>
        <tr>
          <td />
          <th scope="col">Exomes</th>
        </tr>
        <tr>
          <th scope="row">Filter</th>
          <td>{renderGnomadVariantFlag(variant, 'exome')}</td>
        </tr>
        <tr>
          <th scope="row">Allele Count</th>
          <td>{isPresentInExome && exomeAlleleCount}</td>
        </tr>
        <tr>
          <th scope="row">Allele Number</th>
          <td>{isPresentInExome && exomeAlleleNumber}</td>
        </tr>
        <tr>
          <th scope="row">Allele Frequency</th>
          <td>{isPresentInExome && exomeAlleleFrequency.toPrecision(4)}</td>
        </tr>
      </tbody>
    </Table> */