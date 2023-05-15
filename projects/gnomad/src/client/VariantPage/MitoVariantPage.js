import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Page } from '@broad/ui'

import DocumentTitle from '../DocumentTitle'
import GnomadPageHeading from '../GnomadPageHeading'
import Link from '../Link'
import StatusMessage from '../StatusMessage'
import { ReferenceList } from './ReferenceList'

import MitoReadData from '../ReadData/MitoReadData'

//import { PcgcPopulationsTable } from './PcgcPopulationsTable'
import { sfariHaplogroupsTable } from './sfariHaplogroupsTable'
import { AnotherComponent } from './AnotherComponent'

import { TestComponent } from './TestComponent'


/*
import GnomadAgeDistribution from './GnomadAgeDistribution'
import MNVSummaryList from './MultiNucleotideVariant/MNVSummaryList'
import { GnomadGenotypeQualityMetrics } from './qualityMetrics/GnomadGenotypeQualityMetrics'
import { GnomadSiteQualityMetrics } from './qualityMetrics/GnomadSiteQualityMetrics'
import { GnomadReadData } from './reads/GnomadReadData'
*/

import { TranscriptConsequenceList } from './TranscriptConsequenceList'
import { MitoVariantDetailsQuery } from './MitoVariantDetailsQuery'
import VariantFeedback from './VariantFeedback'
import VariantNotFound from './VariantNotFound'
import { MitoVariantOccurrenceTable } from './MitoVariantOccurrenceTable'

const Section = styled.section`
  width: 100%;
`

const ResponsiveSection = styled(Section)`
  width: calc(50% - 15px);

  @media (max-width: 992px) {
    width: 100%;
  }
`

const VariantDetailsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`

const ScrollWrapper = styled.div`
  overflow-x: auto;
`

const DenovoSection = styled.div`
  color:red;

`

const VariantType = ({ variantId }) => {
  const [chrom, pos, ref, alt] = variantId.split('-') // eslint-disable-line no-unused-vars
  if (!ref || !alt) {
    return 'Variant'
  }
  if (ref.length === 1 && alt.length === 1) {
    return 'Single nucleotide variant'
  }
  if (ref.length < alt.length) {
    return 'Insertion'
  }
  if (ref.length > alt.length) {
    return 'Deletion'
  }
  return 'Variant'
}

const VariantId = styled.span`
  white-space: nowrap;
`

const MitoVariantPage = ({ datasetId, variantId }) => (
  <Page>
    <DocumentTitle title={variantId} />
    <GnomadPageHeading
      datasetOptions={{ includeExac: false, includeStructuralVariants: false }}
      selectedDataset={datasetId}
    >
      <VariantType variantId={variantId} />: <VariantId>{variantId}</VariantId>
    </GnomadPageHeading>
    <MitoVariantDetailsQuery datasetId={datasetId} variantId={variantId}>
      {({ data, error, loading }) => {
        if (loading) {
          return <StatusMessage>Loading variant...</StatusMessage>
        }

        if (error) {
          return <StatusMessage>Unable to load variant</StatusMessage>
        }

        if (!data.mito_variant) {
          // Note this requires coverage data or it errors
          return <VariantNotFound datasetId={datasetId} variantId={variantId} />
        }

        //const { mito_variant } = data
        const variant = data.mito_variant

        const numTranscripts = variant.sortedTranscriptConsequences.length
        const geneIds = variant.sortedTranscriptConsequences.map(csq => csq.gene_id)
        const numGenes = new Set(geneIds).size

        /*
        let dnm_confidence

        if(variant.denovoHC && variant.denovoHC == 'Yes'){
          dnm_confidence = 'HIGH'
        }
        else if(variant.denovoHC && variant.denovoHC == 'No'){
          dnm_confidence = 'LOW'                    
        }
        else if(variant.denovoHC && variant.denovoHC == 'Unclassified'){
          dnm_confidence = 'UNKNOWN'                                        
        }
        */

        // const dnm_confidence = variant.denovoHC && variant.denovoHC == 'Yes' ? 'HIGH' : 'LOW'

        console.log("Ih here 2")
        console.log(variant)
        console.log(variant.haplogroups)

        return (
          <VariantDetailsContainer>
            <ResponsiveSection>
              <ScrollWrapper>
                <MitoVariantOccurrenceTable variant={variant} />
              </ScrollWrapper>

              {/*variant.colocatedVariants.length > 0 && (
                <div>
                  <p>
                    <strong>This variant is multiallelic. Other alt alleles are:</strong>
                  </p>
                  <ul>
                    {variant.colocatedVariants.map(variantId => (
                      <li key={variantId}>
                        <Link to={`/variant/${variantId}`}>{variantId}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )*/}

              {/*variant.denovoHC && (
                <DenovoSection>
                  <p>
                    <strong>This is a {dnm_confidence} confidence de novo variant</strong>
                  </p>
                </DenovoSection>
              )*/}

              {/*variant.multiNucleotideVariants.length > 0 && (
                <div>
                  <p>
                    <strong>
                      This variant&apos;s consequence may be affected by other variants:
                    </strong>
                  </p>
                  <MNVSummaryList multiNucleotideVariants={variant.multiNucleotideVariants} />
                </div>
              )*/}
            </ResponsiveSection>
            <ResponsiveSection>
              <h2>References</h2>
              <ReferenceList variant={variant} />
              {/*<h2>Report</h2>
              <VariantFeedback datasetId={datasetId} variantId={variantId} />*/}
            </ResponsiveSection>
            {/*<Section>
              <h2>Annotations</h2>
              <p>
                This variant falls on {numTranscripts} transcript
                {numTranscripts !== 1 && 's'} in {numGenes} gene
                {numGenes !== 1 && 's'}.
              </p>
              <TranscriptConsequenceList
                sortedTranscriptConsequences={variant.sortedTranscriptConsequences}
              />
            </Section>*/}

            <ResponsiveSection>
              <h2>Haplogroup Frequencies</h2>
              <ScrollWrapper>
                <TestComponent haplogroups={variant.haplogroups}/>
              </ScrollWrapper>
            </ResponsiveSection>


            <ResponsiveSection>
              <h2>Population Frequencies</h2>
              <ScrollWrapper>
                <AnotherComponent populations={variant.populations}/>
              </ScrollWrapper>
            </ResponsiveSection>
            
            {/*<ResponsiveSection>
              <h2>Age Distribution</h2>
              {datasetId !== 'gnomad_r2_1' && (
                <p>
                  Age distribution is based on the full gnomAD dataset, not the selected subset.
                </p>
              )}
              <GnomadAgeDistribution variant={variant} />
            </ResponsiveSection>
            <ResponsiveSection>
              <h2>Genotype Quality Metrics</h2>
              <GnomadGenotypeQualityMetrics variant={variant} />
            </ResponsiveSection>
            <ResponsiveSection>
              <h2>Site Quality Metrics</h2>
              <GnomadSiteQualityMetrics datasetId={datasetId} variant={variant} />
            </ResponsiveSection>
            <Section>
              <h2>Read Data</h2>
              <GnomadReadData
                exomeReads={(variant.exome || {}).reads || []}
                genomeReads={(variant.genome || {}).reads || []}
                igvLocus={`${variant.chrom}:${variant.pos - 40}-${variant.pos + 40}`}
                showHemizygotes={variant.chrom === 'X' || variant.chrom === 'Y'}
              />
            </Section>*/}

            <Section>
              <h2>Read Data</h2>
              <MitoReadData variantIds={[variantId]} />
            </Section>
          </VariantDetailsContainer>
        )
      }}
    </MitoVariantDetailsQuery>
  </Page>
)

MitoVariantPage.propTypes = {
  datasetId: PropTypes.string.isRequired,
  variantId: PropTypes.string.isRequired,
}

export default MitoVariantPage
