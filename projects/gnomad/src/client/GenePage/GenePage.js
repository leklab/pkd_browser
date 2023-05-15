import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import { QuestionMark } from '@broad/help'
import { RegionViewer } from '@broad/region-viewer'
//import { ConnectedTranscriptsTrack } from '@broad/track-transcript'
import { ConnectedTranscriptsTrack } from './track-transcript/ConnectedTranscriptsTrack'
import { screenSize } from '@broad/ui'

import DocumentTitle from '../DocumentTitle'
import GnomadPageHeading from '../GnomadPageHeading'
import RegionCoverageTrack from '../RegionPage/CoverageTrack'
import StatusMessage from '../StatusMessage'
import { TrackPage, TrackPageSection } from '../TrackPage'
import { ConstraintTableOrPlaceholder } from './Constraint'
import GeneCoverageTrack from './CoverageTrack'
import { fetchGnomadGenePage } from './fetch'
import GeneDataContainer from './GeneDataContainer'
import GeneInfo from './GeneInfo'
import RegionalConstraintTrack from './RegionalConstraintTrack'
import StructuralVariantsInGene from './StructuralVariantsInGene'
import TissueExpressionTrack from './TissueExpressionTrack'
import TranscriptLink from './TranscriptLink'
import VariantsInGene from './VariantsInGene'
import MitoVariantsInGene from './MitoVariantsInGene'

const GeneFullName = styled.span`
  font-size: 0.75em;
  font-weight: 400;
`

const GeneInfoColumnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: center;
  }

  /* Matches responsive styles in AttributeList */
  @media (max-width: 600px) {
    align-items: stretch;
  }
`

const ControlPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: ${props => props.width}px;
  margin-left: ${props => props.marginLeft}px;
`

const Legend = styled.ul`
  display: flex;
  flex-direction: row;
  padding: 0;
  margin: 0.5em 0;
  list-style-type: none;
`

const LegendItemWrapper = styled.li`
  display: flex;
  align-items: stretch;
  margin-left: 1em;
`

const Label = styled.label`
  user-select: none;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 0.5em;
`

const LegendSwatch = styled.span`
  display: flex;
  align-items: center;
  width: 16px;
  margin-left: 0.5em;

  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: ${props => props.height}px;
    background: ${props => props.color};
  }
`

const transcriptFeatureAttributes = {
  exon: {
    fill: '#bdbdbd',
    height: 4,
  },
  CDS: {
    fill: '#424242',
    height: 10,
  },
  UTR: {
    fill: '#424242',
    height: 4,
  },
}

class GenePage extends Component {
  static propTypes = {
    datasetId: PropTypes.string.isRequired,
    gene: PropTypes.shape({
      full_gene_name: PropTypes.string.isRequired,
      gene_id: PropTypes.string.isRequired,
      gene_name: PropTypes.string.isRequired,
    }).isRequired,
    geneId: PropTypes.string.isRequired,
    screenSize: PropTypes.shape({ width: PropTypes.number.isRequired }).isRequired,
    transcriptId: PropTypes.string,
  }

  static defaultProps = {
    transcriptId: undefined,
  }

  constructor(props) {
    super(props)

    const { gene } = props
    const hasCDS = gene.composite_transcript.exons.some(exon => exon.feature_type === 'CDS')

    this.state = {
      includeNonCodingTranscripts: !hasCDS,
      includeUTRs: false,
    }
  }

  render() {
    const {
      datasetId,
      gene,
      geneId,
      screenSize, // eslint-disable-line no-shadow
      transcriptId,
    } = this.props
    const { includeUTRs, includeNonCodingTranscripts } = this.state

    const smallScreen = screenSize.width < 900

    // Subtract 30px for padding on Page component
    const regionViewerWidth = screenSize.width - 30

    const hasNonCodingTranscripts = gene.transcripts.some(
      tx => !tx.exons.some(exon => exon.feature_type === 'CDS')
    )

    const cdsCompositeExons = gene.composite_transcript.exons.filter(
      exon => exon.feature_type === 'CDS'
    )
    const hasCodingExons = cdsCompositeExons.length > 0

    const compositeExons = gene.composite_transcript.exons.filter(
      exon =>
        exon.feature_type === 'CDS' ||
        (exon.feature_type === 'UTR' && includeUTRs) ||
        (exon.feature_type === 'exon' && includeNonCodingTranscripts)
    )
    
    console.log(gene)
    console.log(compositeExons)
    console.log(datasetId)

    const regionViewerRegions =
      datasetId === 'sfari_sv'
        ? [
            {
              feature_type: 'region',
              chrom: gene.chrom,
              start: gene.start,
              stop: gene.stop,
            },
          ]
        : compositeExons

    if (datasetId === 'sfari_sv' && transcriptId) {
      return <Redirect to={`/gene/${geneId}?dataset=sfari_sv`} />
    }

    return (
      <TrackPage>
        <TrackPageSection>
          <DocumentTitle title={gene.gene_name} />
          <GnomadPageHeading
            datasetOptions={{ includeStructuralVariants: !transcriptId }}
            selectedDataset={datasetId}
          >
            {gene.gene_name} <GeneFullName>{gene.full_gene_name}</GeneFullName>
          </GnomadPageHeading>
          <GeneInfoColumnWrapper>
            <GeneInfo currentTranscript={transcriptId || gene.canonical_transcript} gene={gene} />
             <div>
              <h2>
                Gene Constraint <QuestionMark topic="gene-constraint" />
              </h2>
              <ConstraintTableOrPlaceholder
                datasetId={datasetId}
                gene={gene}
                selectedTranscriptId={transcriptId || gene.canonical_transcript}
              />
            </div>
          </GeneInfoColumnWrapper>
        </TrackPageSection>
        <RegionViewer
          leftPanelWidth={100}
          width={regionViewerWidth}
          padding={75}
          regions={regionViewerRegions}
          rightPanelWidth={smallScreen ? 0 : 160}
        > 
          {/*datasetId === 'gnomad_sv_r2' ? (
            <RegionCoverageTrack
              chrom={gene.chrom}
              datasetId={datasetId}
              showExomeCoverage={false}
              start={gene.start}
              stop={gene.stop}
            />
          ) : (
            hasCodingExons && (
              <GeneCoverageTrack
                datasetId={datasetId}
                geneId={geneId}
                showExomeCoverage={datasetId !== 'gnomad_sv_r2'}
              />
            )
          )*/}

          <ControlPanel marginLeft={100} width={regionViewerWidth - 100 - (smallScreen ? 0 : 160)}>
            Include:
            <Legend>
              <LegendItemWrapper>
                <Label htmlFor="include-cds-regions">
                  <CheckboxInput
                    checked={hasCodingExons}
                    disabled
                    id="include-cds-regions"
                    onChange={() => {}}
                  />
                  CDS
                  <LegendSwatch
                    color={transcriptFeatureAttributes.CDS.fill}
                    height={transcriptFeatureAttributes.CDS.height}
                  />
                </Label>
              </LegendItemWrapper>

              <LegendItemWrapper>
                <Label htmlFor="include-utr-regions">
                  <CheckboxInput
                    checked={includeUTRs}
                    disabled={
                      !gene.composite_transcript.exons.some(exon => exon.feature_type === 'UTR')
                    }
                    id="include-utr-regions"
                    onChange={e => {
                      this.setState({ includeUTRs: e.target.checked })
                    }}
                  />
                  UTR
                  <LegendSwatch
                    color={transcriptFeatureAttributes.UTR.fill}
                    height={transcriptFeatureAttributes.UTR.height}
                  />
                </Label>
              </LegendItemWrapper>

              <LegendItemWrapper>
                <Label htmlFor="include-nc-transcripts">
                  <CheckboxInput
                    checked={includeNonCodingTranscripts}
                    disabled={!hasNonCodingTranscripts}
                    id="include-nc-transcripts"
                    onChange={e => {
                      this.setState({ includeNonCodingTranscripts: e.target.checked })
                    }}
                  />
                  Non-coding transcript
                  <LegendSwatch
                    color={transcriptFeatureAttributes.exon.fill}
                    height={transcriptFeatureAttributes.exon.height}
                  />
                </Label>
              </LegendItemWrapper>
            </Legend>
          </ControlPanel>

          {hasCodingExons && (
            <ConnectedTranscriptsTrack
              showUTRs={includeUTRs}
              showNonCodingTranscripts={includeNonCodingTranscripts}
              compositeExons={compositeExons}
              filenameForExport={`${geneId}_transcripts`}
              renderTranscriptId={
                datasetId === 'sfari_sv'
                  ? txId => txId
                  : (txId, { isCanonical, isSelected }) => (
                      <TranscriptLink
                        to={`/gene/${gene.gene_id}/transcript/${txId}`}
                        isCanonical={isCanonical}
                        isSelected={isSelected}
                      >
                        {txId}
                      </TranscriptLink>
                    )
              }
            />
          )}

          {/*!hasCodingExons && (
            <StatusMessage>
              Coverage &amp; transcripts not shown for genes with no coding exons
            </StatusMessage>
          )*/}

          {/* hasCodingExons && (
            <TissueExpressionTrack exons={cdsCompositeExons} expressionRegions={gene.pext} />
          )*/}

          {/* gene.exac_regional_missense_constraint_regions.length > 0 && datasetId === 'exac' && (
            <RegionalConstraintTrack
              height={15}
              regions={gene.exac_regional_missense_constraint_regions}
            />
          ) */}

          {datasetId === 'sfari_sv' ? (
            <StructuralVariantsInGene gene={gene} width={regionViewerWidth} />
          ) : gene.chrom === 'M' ? (
              <MitoVariantsInGene
              datasetId={datasetId}
              gene={gene}
              transcriptId={transcriptId}
              width={regionViewerWidth}
              />
            ) :
            ( <VariantsInGene
              datasetId={datasetId}
              gene={gene}
              transcriptId={transcriptId}
              width={regionViewerWidth}
            />
          )}
        </RegionViewer>
      </TrackPage>
    )
  }
}

const SizedGenePage = connect(state => ({ screenSize: screenSize(state) }))(GenePage)

const ConnectedGenePage = ({ datasetId, geneIdOrName, transcriptId, ...otherProps }) => (
  <GeneDataContainer
    fetchGene={fetchGnomadGenePage}
    geneIdOrName={geneIdOrName}
    transcriptId={transcriptId}
  >
    {({ gene }) => (
      <SizedGenePage
        {...otherProps}
        datasetId={datasetId}
        gene={gene}
        geneId={gene.gene_id}
        transcriptId={transcriptId}
      />
    )}
  </GeneDataContainer>
)

ConnectedGenePage.propTypes = {
  datasetId: PropTypes.string.isRequired,
  geneIdOrName: PropTypes.string.isRequired,
  transcriptId: PropTypes.string,
}

ConnectedGenePage.defaultProps = {
  transcriptId: undefined,
}

export default ConnectedGenePage
