import throttle from 'lodash.throttle'
import memoizeOne from 'memoize-one'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { NavigatorTrack } from '@broad/track-navigator'

import datasetLabels from '../datasetLabels'
import { Query } from '../Query'
import StatusMessage from '../StatusMessage'
import { TrackPageSection } from '../TrackPage'
import ExportVariantsButton from '../MitoVariantList/ExportVariantsButton'
import filterVariants from '../MitoVariantList/filterVariants'
import mergeExomeAndGenomeData from '../MitoVariantList/mergeExomeAndGenomeData'
import sortVariants from '../MitoVariantList/sortVariants'
import VariantFilterControls from '../MitoVariantList/VariantFilterControls'
import VariantTable from '../MitoVariantList/VariantTable'
import { getColumns } from '../MitoVariantList/variantTableColumns'
import VariantTrack from '../MitoVariantList/VariantTrack'
import ClinVarTrack from './ClinVarTrack'

class MitoVariantsInGene extends Component {
  static propTypes = {
    //clinVarVariants: PropTypes.arrayOf(PropTypes.object).isRequired,
    datasetId: PropTypes.string.isRequired,
    gene: PropTypes.shape({
      chrom: PropTypes.string.isRequired,
      gene_id: PropTypes.string.isRequired,
    }).isRequired,
    transcriptId: PropTypes.string,
    variants: PropTypes.arrayOf(PropTypes.object).isRequired,
    width: PropTypes.number.isRequired,
  }

  static defaultProps = {
    transcriptId: undefined,
  }

  constructor(props) {
    super(props)

    const defaultFilter = {
      includeCategories: {
        lof: true,
        missense: true,
        synonymous: true,
        other: true,
      },
      includeFilteredVariants: false,
      includeSNVs: true,
      includeIndels: true,
      includeExomes: true,
      includeGenomes: true,
      searchText: '',
    }

    const defaultSortKey = 'variant_id'
    const defaultSortOrder = 'ascending'

/*    const renderedVariants = sortVariants(
      mergeExomeAndGenomeData(filterVariants(props.variants, defaultFilter)),
      {
        sortKey: defaultSortKey,
        sortOrder: defaultSortOrder,
      }
    )
*/

    //console.log(props.variants)
    const renderedVariants = mergeExomeAndGenomeData(props.variants)

    console.log("Printing renderedVariants")
    console.log(renderedVariants)

    this.state = {
      filter: defaultFilter,
      hoveredVariant: null,
      rowIndexLastClickedInNavigator: 0,
      renderedVariants,
      sortKey: defaultSortKey,
      sortOrder: defaultSortOrder,
      visibleVariantWindow: [0, 19],
    }
  }
  /*
  getColumns = memoizeOne((width, chrom, datasetId) =>
    getColumns({
      datasetId,
      width,
      includeHomozygoteAC: chrom !== 'Y',
      includeHemizygoteAC: chrom === 'X' || chrom === 'Y',
    })
  )
  */

  getColumns = memoizeOne((width, chrom) =>
    getColumns({
      width,
      includeHomozygoteAC: false,
      includeHemizygoteAC: false,
    })
  )

  onFilter = newFilter => {
    this.setState(state => {
      const { variants } = this.props
      const { sortKey, sortOrder } = state
      const renderedVariants = sortVariants(
        mergeExomeAndGenomeData(filterVariants(variants, newFilter)),
        {
          sortKey,
          sortOrder,
        }
      )
      return {
        filter: newFilter,
        renderedVariants,
      }
    })
  }

  onSort = newSortKey => {
    this.setState(state => {
      const { renderedVariants, sortKey } = state

      let newSortOrder = 'descending'
      if (newSortKey === sortKey) {
        newSortOrder = state.sortOrder === 'ascending' ? 'descending' : 'ascending'
      }

      // Since the filter hasn't changed, sort the currently rendered variants instead
      // of filtering the input variants.
      const sortedVariants = sortVariants(renderedVariants, {
        sortKey: newSortKey,
        sortOrder: newSortOrder,
      })

      return {
        renderedVariants: sortedVariants,
        sortKey: newSortKey,
        sortOrder: newSortOrder,
      }
    })
  }

  onHoverVariant = variantId => {
    this.setState({ hoveredVariant: variantId })
  }

  onVisibleRowsChange = throttle(({ startIndex, stopIndex }) => {
    this.setState({ visibleVariantWindow: [startIndex, stopIndex] })
  }, 100)

  onNavigatorClick = position => {
    const { renderedVariants } = this.state
    const sortedVariants = sortVariants(renderedVariants, {
      sortKey: 'variant_id',
      sortOrder: 'ascending',
    })

    let index
    if (sortedVariants.length === 0 || position < sortedVariants[0].pos) {
      index = 0
    }

    index = sortedVariants.findIndex(
      (variant, i) =>
        sortedVariants[i + 1] && position >= variant.pos && position <= sortedVariants[i + 1].pos
    )

    if (index === -1) {
      index = sortedVariants.length - 1
    }

    this.setState({
      renderedVariants: sortedVariants,
      rowIndexLastClickedInNavigator: index,
      sortKey: 'variant_id',
      sortOrder: 'ascending',
    })
  }

  render() {
    //const { clinVarVariants, datasetId, gene, transcriptId, width } = this.props
    const { datasetId, gene, transcriptId, width } = this.props

    const {
      filter,
      hoveredVariant,
      renderedVariants,
      rowIndexLastClickedInNavigator,
      sortKey,
      sortOrder,
      visibleVariantWindow,
    } = this.state

    const datasetLabel = datasetLabels[datasetId]

    return (
      <div>
        {/*<ClinVarTrack variants={clinVarVariants} variantFilter={filter.includeCategories} />*/}

        <VariantTrack
          title={`SFARI Mito Variants (${renderedVariants.length})`}
          variants={renderedVariants}
        />
        <NavigatorTrack
          hoveredVariant={hoveredVariant}
          onNavigatorClick={this.onNavigatorClick}
          title="Viewing in table"
          variants={renderedVariants}
          visibleVariantWindow={visibleVariantWindow}
        />
        <TrackPageSection style={{ fontSize: '14px', marginTop: '1em' }}>
          <VariantFilterControls onChange={this.onFilter} value={filter} />
          {/* <div>
            <ExportVariantsButton
              datasetId={datasetId}
              exportFileName={`${datasetLabel}_${gene.gene_id}`}
              variants={renderedVariants}
            />
          </div> */}
          {!transcriptId && (
            <p style={{ marginBottom: 0 }}>
              † denotes a consequence that is for a non-canonical transcript
            </p>
          )}
          <p style={{ marginBottom: 0 }}>
            <b>Cohort Key:</b>&nbsp; <img
                    src={require('../MitoVariantList/SPARK_icon.png')}
                    height={20}
                    width={20}
                    alt={"SPARK"}
                  />&nbsp; SPARK &nbsp; &nbsp; &nbsp; 
                  <img
                    src={require('../MitoVariantList/SSC_icon.png')}
                    height={20}
                    width={20}
                    alt={"SSC"}
                  />&nbsp; SSC
          </p>
           <VariantTable
            columns={this.getColumns(width, gene.chrom)}
            highlightText={filter.searchText}
            onHoverVariant={this.onHoverVariant}
            onRequestSort={this.onSort}
            onVisibleRowsChange={this.onVisibleRowsChange}
            rowIndexLastClickedInNavigator={rowIndexLastClickedInNavigator}
            sortKey={sortKey}
            sortOrder={sortOrder}
            variants={renderedVariants}
          />
        </TrackPageSection>
      </div>
    )
  }
}

const ConnectedMitoVariantsInGene = ({ datasetId, gene, transcriptId, width }) => {
  //const clinvarTranscriptArg = transcriptId ? `(transcriptId: "${transcriptId}")` : ''
  const transcriptArg = transcriptId ? `, transcriptId: "${transcriptId}"` : ''

  
  const query = `{
    mito_gene(gene_id: "${gene.gene_id}") {
      variants {
        consequence
        flags
        hgvs
        hgvsp
        hgvsc
        ${transcriptId ? '' : 'isCanon: consequence_in_canonical_transcript'}
        pos
        variant_id: variantId
        xpos
        spark_genome {
          ac
          an
          af
          ac_hom
          ac_het
          max_heteroplasmy
        }
        ssc_genome {
          ac
          an
          af
          ac_hom
          ac_het
          max_heteroplasmy
        }
      }
    }
  }`
  

// PCGC API
/*  
  const query = `{
    gene(gene_id: "${gene.gene_id}") {
      clinvar_variants${clinvarTranscriptArg} {
        alleleId
        clinicalSignificance
        goldStars
        majorConsequence
        pos
        variantId
      }      
      variants {
        consequence
        flags
        hgvs
        hgvsp
        hgvsc
        ${transcriptId ? '' : 'isCanon: consequence_in_canonical_transcript'}
        pos
        variant_id: variantId
        xpos
        ac_gnomad
        an_gnomad
        spark_exome {
          ac
          an
          af
          ac_hom
          ac_proband
          an_proband
          af_proband
        }
        spark_genome {
          ac
          an
          af
          ac_hom
          ac_proband
          an_proband
          af_proband
        }
        ssc_genome {
          ac
          an
          af
          ac_hom
          ac_proband
          an_proband
          af_proband
        }                
      }
    }
  }`
*/

  console.log("In here")
  console.log(query)

  return (
    <Query query={query}>
      {({ data, error, graphQLErrors, loading }) => {
        console.log("In here - loading1")
        console.log(error)
        console.log(graphQLErrors)

        if (loading) {
          console.log("In here - loading2")
          return <StatusMessage>Loading variants...</StatusMessage>
        }
        console.log("In here - out of loading")
        console.log(data)
        console.log(error)

        if (error || !((data || {}).mito_gene || {}).variants) {
          return <StatusMessage>Failed to load variants</StatusMessage>
        }

        return (
          <MitoVariantsInGene
            //clinVarVariants={data.gene.clinvar_variants}
            datasetId={datasetId}
            gene={gene}
            transcriptId={transcriptId}
            variants={data.mito_gene.variants}
            width={width}
          />
        )
      }}
    </Query>
  )
}


/*
        return (
          <VariantsInGene
            clinVarVariants={data.gene.clinvar_variants}
            datasetId={datasetId}
            gene={gene}
            transcriptId={transcriptId}
            variants={data.gene.variants}
            width={width}
          />
        )
*/

ConnectedMitoVariantsInGene.propTypes = {
  datasetId: PropTypes.string.isRequired,
  gene: PropTypes.shape({
    gene_id: PropTypes.string.isRequired,
  }).isRequired,
  transcriptId: PropTypes.string,
  width: PropTypes.number.isRequired,
}

ConnectedMitoVariantsInGene.defaultProps = {
  transcriptId: undefined,
}

export default ConnectedMitoVariantsInGene
