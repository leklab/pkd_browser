import PropTypes from 'prop-types'
import React from 'react'

import { Page, PageHeading } from '@broad/ui'
import { isVariantId, normalizeVariantId } from '@broad/utilities'

import DocumentTitle from '../DocumentTitle'
import StructuralVariantPage from '../StructuralVariantPage/StructuralVariantPage'
import PcgcVariantPage from './PcgcVariantPage'
import MitoVariantPage from './MitoVariantPage'
import MNVPage from './MultiNucleotideVariant/MNVPage'

const VariantPage = ({ datasetId, variantId, ...otherProps }) => {
  if (datasetId === 'sfari_sv') {
    return <StructuralVariantPage {...otherProps} datasetId={datasetId} variantId={variantId} />
  }

  if (datasetId === 'exac') {
    window.location = `http://exac.broadinstitute.org/variant/${variantId}`
    return null
  }

  // Other datasets require variant IDs in the chrom-pos-ref-alt format
  if (!isVariantId(variantId)) {
    return (
      <Page>
        <DocumentTitle title="Invalid variant ID" />
        <PageHeading>Invalid Variant ID</PageHeading>
        <p>Variant IDs must be formatted chrom-pos-ref-alt.</p>
      </Page>
    )
  }

  const normalizedVariantId = normalizeVariantId(variantId)
  const [chrom, pos, ref, alt] = normalizedVariantId.split('-') // eslint-disable-line no-unused-vars
  if (ref.length === alt.length && ref.length > 1) {
    return <MNVPage {...otherProps} datasetId={datasetId} variantId={normalizedVariantId} />
  }

  if(chrom === 'M' ){
    return <MitoVariantPage {...otherProps} datasetId={datasetId} variantId={normalizedVariantId} />
  }
  else{
    return <PcgcVariantPage {...otherProps} datasetId={datasetId} variantId={normalizedVariantId} />
  }

  /*
  return (chrom === 'M' ? (<MitoVariantPage {...otherProps} datasetId={datasetId} variantId={normalizedVariantId} />)
                         : (<MitoVariantPage {...otherProps} datasetId={datasetId} variantId={normalizedVariantId} />))*/

}

VariantPage.propTypes = {
  datasetId: PropTypes.string.isRequired,
  variantId: PropTypes.string.isRequired,
}

export default VariantPage
