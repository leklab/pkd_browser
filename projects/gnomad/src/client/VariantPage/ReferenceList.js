import PropTypes from 'prop-types'
import React from 'react'

import { ExternalLink, List, ListItem } from '@broad/ui'

export const ReferenceList = ({ variant }) => {
  /* eslint-disable prettier/prettier */
  const clinvarSearch = variant.rsid && variant.rsid !== '.'
    ? `http://www.ncbi.nlm.nih.gov/clinvar?term=${variant.rsid}%5BVariant%20ID%5D`
    : `http://www.ncbi.nlm.nih.gov/clinvar?term=(${variant.chrom}%5BChromosome%5D)%20AND%20${variant.pos}%5BBase%20Position%20for%20Assembly%20GRCh38%5D`

  const clinvarURL = `http://www.ncbi.nlm.nih.gov/clinvar?term=${variant.clinvarAlleleID}%5BAlleleID%5D`

  const dbsnpURL = `http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=${variant.rsid}`

  const ucscURL = `http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&highlight=hg38.chr${variant.chrom}%3A${variant.pos}-${variant.pos + (variant.ref.length - 1)}&position=chr${variant.chrom}%3A${variant.pos - 25}-${variant.pos + (variant.ref.length - 1) + 25}`
  /* eslint-enable prettier/prettier */

  return (
    <List>
      <ListItem>
        {variant.rsid && variant.rsid !== '.' ? (
          <ExternalLink href={dbsnpURL}>dbSNP ({variant.rsid})</ExternalLink>
        ) : (
          'Not found in dbSNP'
        )}
      </ListItem>
      <ListItem>
        <ExternalLink href={ucscURL}>UCSC</ExternalLink>
      </ListItem>
      <ListItem>
        {variant.clinvarAlleleID ? (
          <ExternalLink href={clinvarURL}>ClinVar ({variant.clinvarAlleleID})</ExternalLink>
        ) : (
        <ExternalLink href={clinvarSearch}>ClinVar search</ExternalLink>
        )}
      </ListItem>
    </List>
  )
}

ReferenceList.propTypes = {
  variant: PropTypes.shape({
    chrom: PropTypes.string.isRequired,
    pos: PropTypes.number.isRequired,
    ref: PropTypes.string.isRequired,
    rsid: PropTypes.string,
  }).isRequired,
}
