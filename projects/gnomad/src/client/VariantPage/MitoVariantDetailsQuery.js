import PropTypes from 'prop-types'
import React from 'react'

import { Query } from '../Query'

import exacVariantQuery from './queries/exacVariantQuery'
import gnomadVariantQuery from './queries/gnomadVariantQuery'
import pcgcVariantQuery from './queries/pcgcVariantQuery'
import mitoVariantQuery from './queries/mitoVariantQuery'


export const MitoVariantDetailsQuery = ({ children, datasetId, variantId }) => (
  <Query
    query={mitoVariantQuery}
    variables={{ datasetId, variantId }}
  >
    {children}
  </Query>
)

MitoVariantDetailsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  datasetId: PropTypes.string.isRequired,
  variantId: PropTypes.string.isRequired,
}

/*
 <Query
    query={datasetId === 'exac' ? exacVariantQuery : gnomadVariantQuery}
    variables={{ datasetId, variantId }}
  >
 */