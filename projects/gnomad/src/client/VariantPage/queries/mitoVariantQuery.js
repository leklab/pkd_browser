export default `
query mitoVariant($variantId: String!) {
  mito_variant(variantId: $variantId) {
    alt
    chrom
    pos
    ref
    variantId 
    xpos
    ... on MitoVariantDetails {
      haplogroups{
        id
        ac_het
        ac_hom
        an
      }
      populations{
        id
        an
        ac_het
        ac_hom
      }      
      spark_genome {
        ac
        an
        ac_hom
        ac_het
      }
      sortedTranscriptConsequences {
        canonical
        gene_id
        gene_symbol
        hgvs
        hgvsc
        hgvsp
        lof
        lof_flags
        lof_filter
        lof_info
        major_consequence
        polyphen_prediction
        sift_prediction
        transcript_id
      }
    }
  }
}
`

/*
export default `
query PcgcVariant($variantId: String!, $datasetId: DatasetsSupportingFetchVariantDetails!) {
  variant(variantId: $variantId, dataset: $datasetId) {
    alt
    chrom
    pos
    ref
    variantId
    xpos
    ... on GnomadVariantDetails {
      exome {
        ac
        an
        ac_hom
        populations {
          id
          ac
          an
        }

      }
      sortedTranscriptConsequences {
        canonical
        gene_id
        gene_symbol
        hgvs
        hgvsc
        hgvsp
        lof
        lof_flags
        lof_filter
        lof_info
        major_consequence
        polyphen_prediction
        sift_prediction
        transcript_id
      }
    }
  }
}
`
*/