import { fetchAllSearchResults } from '../../utilities/elasticsearch'
import { mergeOverlappingRegions } from '../../utilities/region'
import { lookupExonsByGeneId } from '../types/exon'

//import { request } from "graphql-request"

import fetch from 'node-fetch'
//import 'whatwg-fetch'

/*
import {
  annotateVariantsWithMNVFlag,
  fetchGnomadMNVsByIntervals,
} from './gnomadMultiNucleotideVariants'
*/

import mergePcgcAndGnomadVariantSummaries from './mergePcgcAndGnomadVariants'
import mergeExomeAndGenomeVariantSummaries from './mergeExomeAndGenomeVariants'
import mergeSSCVariants from './mergeSSCVariants'
import shapeGnomadVariantSummary from './shapeGnomadVariantSummary'


const annotateVariantsWithMayoFlag = (variants, mayo) => {
  const mayoVariantIds = new Set(mayo.reduce((acc, mayo) => acc.concat(mayo.variant_id), []))

  variants.forEach(variant => {
    if (mayoVariantIds.has(variant.variantId)) {
      variant.flags.push('mayo')
    }
  })

  return variants
}


const fetchMayoVariants = async (ctx, geneId) => {

  const hits = await fetchAllSearchResults(ctx.database.elastic, {

    index: 'mayo_database',
    size: 10000,
    _source: [
      'variant_id',
      'MayoVariantID',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { GeneName: geneId } },
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  return hits.map(hit => hit._source) // eslint-disable-line no-underscore-dangle
}

const fetchVariantsByGene = async (ctx, geneId, canonicalTranscriptId, subset) => {
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
      //index: 'bpkd_exomes',
      index: 'pkd_exomes',
      size: 10000,
      _source: [
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
        'AF_proband'
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
              //{ range: { ['AC_raw']: { gt: 0 } } },
              { range: { ['AC']: { gt: 0 } } },
 
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      },
    })


  console.log("Done making first query - bpkd_exomes")
  const exomeVariants = hits.map(shapeGnomadVariantSummary({ type: 'gene', geneId }))
  //console.log(exomeVariants)


  //const allVariants = mergeSSCVariants(sparkVariants, ssc_genomeVariants)

  const query = `{
    gene(gene_id: "${geneId}" reference_genome: GRCh38) {
      gene_id
      symbol
      variants(dataset: gnomad_r3){
        pos
        variantId
        rsid
        exome{
          ac
          an
        }
        genome{
          ac
          an
        }
      }
    }
  }
  `

  console.log("About to request data from gnomAD")
  
  const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
    body: JSON.stringify({
      query
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }}).then(response => response.json())

  const combinedVariants = mergePcgcAndGnomadVariantSummaries(exomeVariants,gnomad_data.data.gene.variants)
  //console.log(gnomad_data.data.gene.symbol)
  //const dnms = await fetchDenovos(ctx,geneId)
  //annotateVariantsWithDenovoFlag(combinedVariants,dnms)
  const mayo = await fetchMayoVariants(ctx,gnomad_data.data.gene.symbol)
  //console.log(mayo)
  annotateVariantsWithMayoFlag(combinedVariants,mayo)

  return combinedVariants
  

}

export default fetchVariantsByGene
