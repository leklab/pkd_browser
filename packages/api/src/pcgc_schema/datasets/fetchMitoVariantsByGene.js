import { fetchAllSearchResults } from '../../utilities/elasticsearch'
import { mergeOverlappingRegions } from '../../utilities/region'
import { lookupExonsByGeneId } from '../types/exon'

//import { request } from "graphql-request"
//import fetch from 'node-fetch'

/*
import {
  annotateVariantsWithMNVFlag,
  fetchGnomadMNVsByIntervals,
} from './gnomadMultiNucleotideVariants'
*/

//import mergePcgcAndGnomadVariantSummaries from './mergePcgcAndGnomadVariants'
//import mergeExomeAndGenomeVariantSummaries from './mergeExomeAndGenomeVariants'
//import mergeSSCVariants from './mergeSSCVariants'

import shapeMitoVariantSummary from './shapeMitoVariantSummary'
import mergeMitoVariants from './mergeMitoVariants'


/*
const annotateVariantsWithDenovoFlag = (variants, dnms) => {
  const dnmsVariantIds = new Set(dnms.reduce((acc, dnms) => acc.concat(dnms.variant_id), []))

  variants.forEach(variant => {
    if (dnmsVariantIds.has(variant.variantId)) {
      variant.flags.push('denovo')
    }
  })

  return variants
}


const fetchDenovos = async (ctx, geneId) => {

  const hits = await fetchAllSearchResults(ctx.database.elastic, {

    index: 'autism_dnms',
    type: 'variant',
    size: 10000,
    _source: [
      'variant_id',
      'high_confidence_dnm',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { ANN_GENEID: geneId } },
          ],
        },
      },
      sort: [{ POS: { order: 'asc' } }],
    },
  })

  return hits.map(hit => hit._source) // eslint-disable-line no-underscore-dangle
}
*/
const fetchMitoVariantsByGene = async (ctx, geneId, canonicalTranscriptId, subset) => {
  const geneExons = await lookupExonsByGeneId(ctx.database.gnomad, geneId)
  const filteredRegions = geneExons.filter(exon => exon.feature_type === 'CDS')
  const sortedRegions = filteredRegions.sort((r1, r2) => r1.xstart - r2.xstart)
  const padding = 75
  const paddedRegions = sortedRegions.map(r => ({
    ...r,
    start: r.start - padding,
    stop: r.stop + padding,
    xstart: r.xstart - padding,
    xstop: r.xstop + padding,
  }))

  const mergedRegions = mergeOverlappingRegions(paddedRegions)

  const rangeQueries = mergedRegions.map(region => ({
    range: {
      pos: {
        gte: region.start,
        lte: region.stop,
      },
    },
  }))


  const hits = await fetchAllSearchResults(ctx.database.elastic, { 
//      index: 'pcgc_chr20_test',
      index: 'mito_test4',
      //type: 'variant',
      size: 10000,
      _source: [
        'alt',
        'chrom',
        'pos',
        'ref',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'ac',
        'ac_het',
        'ac_hom',
        'an',
        'af',
        'max_heteroplasmy',
        'filters',
        /*
        'AC_adj',
        'AN_adj',
        'nhomalt_adj',
        'alt',
        'chrom',
        'filters',
        'flags',
        //'nonpar',
        'pos',
        'ref',
        'rsid',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'AC',
        'AN',
        'AF',
        'nhomalt',
        'AC_raw',
        'AN_raw',
        'AF_raw',
        'nhomalt_raw',
        'AC_proband',
        'AN_proband',
        'AF_proband'*/

      ],
      /*
      body: {
        query : {
          nested: {
            path: 'sortedTranscriptConsequences',
            query:{
              match: {
                'sortedTranscriptConsequences.gene_id': geneId
              }
            }
          }
        },*/
        
      body: {
        query: {
          bool: {
            filter: [
              {
                nested: {
                  path: 'sortedTranscriptConsequences',
                  query: {
                    term: { 'sortedTranscriptConsequences.gene_id': geneId },
                  },
                },
              },
              { bool: { should: rangeQueries } },
              { range: { ['ac']: { gt: 0 } } },
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      },
    })

  //console.log(hits)
  


  const sparkVariants = hits.map(shapeMitoVariantSummary({ type: 'gene', geneId }))

  const ssc_hits = await fetchAllSearchResults(ctx.database.elastic, { 
//      index: 'pcgc_chr20_test',
      index: 'ssc_mito',
      //type: 'variant',
      size: 10000,
      _source: [
        'alt',
        'chrom',
        'pos',
        'ref',
        'sortedTranscriptConsequences',
        'variant_id',
        'xpos',
        'ac',
        'ac_het',
        'ac_hom',
        'an',
        'af',
        'max_heteroplasmy',
        'filters',
      ],
      body: {
        query: {
          bool: {
            filter: [
              {
                nested: {
                  path: 'sortedTranscriptConsequences',
                  query: {
                    term: { 'sortedTranscriptConsequences.gene_id': geneId },
                  },
                },
              },
              { bool: { should: rangeQueries } },
              { range: { ['ac']: { gt: 0 } } },
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      },
    })



  const sscVariants = ssc_hits.map(shapeMitoVariantSummary({ type: 'gene', geneId }))

  const allVariants = mergeMitoVariants(sparkVariants, sscVariants)

  //return sparkVariants
  return allVariants
  //return sscVariants

}

export default fetchMitoVariantsByGene
