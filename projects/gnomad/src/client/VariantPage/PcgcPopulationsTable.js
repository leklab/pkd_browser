import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import { Checkbox } from '@broad/ui'

import { PopulationsTable } from './PopulationsTable'

const POPULATION_NAMES = {
  AFR: 'African',
  AMR: 'Latino',
  ASJ: 'Ashkenazi Jewish',
  EAS: 'East Asian',
  FIN: 'European (Finnish)',
  EUR: 'European',

  NFE: 'European (non-Finnish)',
  OTH: 'Other',
  SAS: 'South Asian',

  FEMALE: 'Female',
  MALE: 'Male',

  // EAS subpopulations
  JPN: 'Japanese',
  KOR: 'Korean',
  OEA: 'Other East Asian',

  // NFE subpopulations
  BGR: 'Bulgarian',
  EST: 'Estonian',
  NWE: 'North-western European',
  ONF: 'Other non-Finnish European',
  SEU: 'Southern European',
  SWE: 'Swedish',
}

const ControlSection = styled.div`
  margin-top: 1em;

  label {
    margin-left: 1em;
  }
`

const combinePopulations = populations => {
  const combined = Object.values(
    populations.reduce((acc, pop) => {
      if (!acc[pop.id]) {
        acc[pop.id] = {
          id: pop.id,
          name: POPULATION_NAMES[pop.id],
          ac: 0,
          an: 0,
          //ac_hemi: 0,
          ac_hom: 0,
          gnomad_af: null,
          //subpopulations: [],
        }
      }
      acc[pop.id].ac += pop.ac
      acc[pop.id].an += pop.an
      //acc[pop.id].ac_hemi += pop.ac_hemi
      acc[pop.id].ac_hom += pop.ac_hom
      /*
      if (pop.subpopulations) {
        acc[pop.id].subpopulations = combinePopulations(
          acc[pop.id].subpopulations.concat(pop.subpopulations)
        )
      }*/
      return acc
    }, {})
  )
  return combined
}

export class PcgcPopulationsTable extends Component {
  static propTypes = {
    exomePopulations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ac: PropTypes.number.isRequired,
        an: PropTypes.number.isRequired,
        //ac_hemi: PropTypes.number.isRequired,
        ac_hom: PropTypes.number.isRequired,
        //ac_hom: PropTypes.number,

        /*
        subpopulations: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            ac: PropTypes.number.isRequired,
            an: PropTypes.number.isRequired,
          })
        ),*/
      })
    ).isRequired,
    gnomadPopulations: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        ac: PropTypes.number.isRequired,
        an: PropTypes.number.isRequired,
        // ac_hemi: PropTypes.number.isRequired,
        ac_hom: PropTypes.number.isRequired,
        
      })
    ).isRequired,
    gnomadAF : PropTypes.number,
    exome_male_ac: PropTypes.number,
    exome_male_ac_hom: PropTypes.number,
    exome_male_an: PropTypes.number,
    exome_female_ac: PropTypes.number,
    exome_female_ac_hom: PropTypes.number,
    exome_female_an: PropTypes.number,
    showHemizygotes: PropTypes.bool,
    showHomozygotes: PropTypes.bool,
  }

  static defaultProps = {
    //showHemizygotes: true,
    showHomozygotes: true,
    showHemizygotes: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      includeExomes: props.exomePopulations.length !== 0,
      //includeGenomes: props.genomePopulations.length !== 0,
      //includeSSCGenomes: props.sscGenomePopulations.length !== 0,
    }
  }

  render() {
    let includedPopulations = []

    var male_ac = 0
    var male_ac_hom = 0
    var male_an = 0

    var female_ac = 0
    var female_ac_hom = 0
    var female_an = 0

    /*
    if (this.state.includeExomes) {
      male_ac = male_ac + this.props.exome_male_ac
      male_ac_hom = male_ac_hom + this.props.exome_male_ac_hom
      male_an = male_an + this.props.exome_male_an

      female_ac = female_ac + this.props.exome_female_ac
      female_ac_hom = female_ac_hom + this.props.exome_female_ac_hom
      female_an = female_an + this.props.exome_female_an

      includedPopulations = includedPopulations.concat(this.props.exomePopulations)
    }
    if (this.state.includeGenomes) {
      male_ac = male_ac + this.props.genome_male_ac
      male_ac_hom = male_ac_hom + this.props.genome_male_ac_hom
      male_an = male_an + this.props.genome_male_an

      female_ac = female_ac + this.props.genome_female_ac
      female_ac_hom = female_ac_hom + this.props.genome_female_ac_hom
      female_an = female_an + this.props.genome_female_an

      includedPopulations = includedPopulations.concat(this.props.genomePopulations)
    }

    //console.log("Debug 1")
    //console.log(this.props.sscGenomePopulations)

    if (this.state.includeSSCGenomes){
      
      male_ac = male_ac + this.props.ssc_genome_male_ac
      male_ac_hom = male_ac_hom + this.props.ssc_genome_male_ac_hom
      male_an = male_an + this.props.ssc_genome_male_an

      female_ac = female_ac + this.props.ssc_genome_female_ac
      female_ac_hom = female_ac_hom + this.props.ssc_genome_female_ac_hom
      female_an = female_an + this.props.ssc_genome_female_an
      
      //console.log("Including SSC Genomes")
      includedPopulations = includedPopulations.concat(this.props.sscGenomePopulations)

    }
    */

    male_ac = male_ac + this.props.exome_male_ac
    male_ac_hom = male_ac_hom + this.props.exome_male_ac_hom
    male_an = male_an + this.props.exome_male_an

    female_ac = female_ac + this.props.exome_female_ac
    female_ac_hom = female_ac_hom + this.props.exome_female_ac_hom
    female_an = female_an + this.props.exome_female_an

    includedPopulations = includedPopulations.concat(this.props.exomePopulations)


    //console.log(this.props.gnomadPopulations)

    let gnomad_af_lookup = []
    for (var i = 0; i < this.props.gnomadPopulations.length; i++){

      if(this.props.gnomadPopulations[i].id.localeCompare("nfe") == 0){
        gnomad_af_lookup["EUR"] = this.props.gnomadPopulations[i].ac / this.props.gnomadPopulations[i].an
      //console.log(this.props.gnomadPopulations[i].id)
      //console.log("In here - loop")
      }
      else{
        gnomad_af_lookup[this.props.gnomadPopulations[i].id.toUpperCase()] = this.props.gnomadPopulations[i].ac / this.props.gnomadPopulations[i].an
      }
    }


    console.log(gnomad_af_lookup)

    const gnomad_male_af = this.props.gnomadPopulations.length > 0 ? gnomad_af_lookup["XY"] : 0
    const gnomad_female_af = this.props.gnomadPopulations.length > 0 ? gnomad_af_lookup["XX"] : 0


    const combinedPopulations = combinePopulations(includedPopulations)

    combinedPopulations.map(x => x.gnomad_af = gnomad_af_lookup[x.id])


    //console.log(gnomad_male_af)
    //console.log(gnomad_female_af)


    console.log(combinedPopulations)
    console.log(this.props.gnomadAF)
   
    // const combinedPopulations = combinePopulations(this.props.exomePopulations)

    return (
      <div>
        <PopulationsTable
          populations={combinedPopulations}
          showHemizygotes={this.props.showHemizygotes}
          showHomozygotes={this.props.showHomozygotes}
          showGnomad={this.props.gnomadPopulations.length > 0}
          gnomadAF={this.props.gnomadAF}
          gnomad_male_af={gnomad_male_af}
          gnomad_female_af={gnomad_female_af}
          male_ac={male_ac}
          male_ac_hom={male_ac_hom}
          male_an={male_an}          
          female_ac={female_ac}
          female_ac_hom={female_ac_hom}
          female_an={female_an}
        />
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
