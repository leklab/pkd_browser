import { fetchAllSearchResults } from '../../utilities/elasticsearch'
import { getXpos } from '../../utilities/variant'
//import { request } from "graphql-request"

//import fetch from 'node-fetch'

/*
import {
  annotateVariantsWithMNVFlag,
  fetchGnomadMNVsByIntervals,
} from './gnomadMultiNucleotideVariants'
*/

//import mergeExomeAndGenomeVariantSummaries from './mergeExomeAndGenomeVariantSummaries'
import shapeGnomadVariantSummary from './shapeGnomadVariantSummary'
import mergeExomeAndGenomeVariantSummaries from './mergeExomeAndGenomeVariants'
import mergePcgcAndGnomadVariantSummaries from './mergePcgcAndGnomadVariants'

const fetchVariantsByRegion = async (ctx, { chrom, start, stop }, subset) => {


  const hits = await fetchAllSearchResults(ctx.database.elastic, { 
//      index: 'pcgc_chr20_test',
    index: 'pcgc_exomes',
    type: 'variant',
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
              { range: { ['AC_raw']: { gt: 0 } } },
            ],
          },
        },
        sort: [{ pos: { order: 'asc' } }],
      */
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            {
              range: {
                pos: {
                  gte: start,
                  lte: stop,
                },
              },
            },
            { range: { ['AC_raw']: { gt: 0 } } },
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  const exomeVariants = hits.map(shapeGnomadVariantSummary({ type: 'region'}))
  //console.log(exomeVariants)

  const ghits = await fetchAllSearchResults(ctx.database.elastic, { 
    index: 'ssc_genomes',
    type: 'variant',
    size: 10000,
    _source: [
      'AC_adj',
      'AN_adj',
      'nhomalt_adj',
      'alt',
      'chrom',
      'filters',
      'flags',        
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
      },
      sort: [{ pos: { order: 'asc' } }],
    },
    */
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            {
              range: {
                pos: {
                  gte: start,
                  lte: stop,
                },
              },
            },
          ],
        },
      },
      sort: [{ pos: { order: 'asc' } }],
    },
  })

  const genomeVariants = ghits.map(shapeGnomadVariantSummary({ type: 'region'}))
  //console.log(genomeVariants)

  const exomeAndGenomeVariants = mergeExomeAndGenomeVariantSummaries(exomeVariants, genomeVariants)



  const query = `{
    region(start: ${start}, stop: ${stop}, chrom: "${chrom}", reference_genome: GRCh38) {
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
  //request("http://gnomad.broadinstitute.org/api", query).then(console.log).catch(console.error)
  //console.log("In here 33")
  //const gnomad_data = request("http://gnomad.broadinstitute.org/api", query).then(console.log).catch(console.error)

  //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)
  //console.log(gnomad_data.region.variants)

  //const combinedVariants = mergePcgcAndGnomadVariantSummaries(exomeVariants,gnomad_data.gene.variants)
  
  //const combinedVariants = mergePcgcAndGnomadVariantSummaries(exomeAndGenomeVariants,gnomad_data.region.variants)
  //console.log(combinedVariants)
  //return combinedVariants

  return exomeAndGenomeVariants

  /*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]

  const [exomeVariants, genomeVariants] = await Promise.all(
    requests.map(async ({ index, subset }) => {
      const hits = await fetchAllSearchResults(ctx.database.elastic, {
        index,
        type: 'variant',
        size: 10000,
        _source: [
          `${subset}.AC_adj`,
          `${subset}.AN_adj`,
          `${subset}.nhomalt_adj`,
          'alt',
          'chrom',
          'filters',
          'flags',
          'nonpar',
          'pos',
          'ref',
          'rsid',
          'sortedTranscriptConsequences',
          'variant_id',
          'xpos',
        ],
        body: {
          query: {
            bool: {
              filter: [
                { term: { chrom } },
                {
                  range: {
                    pos: {
                      gte: start,
                      lte: stop,
                    },
                  },
                },
                { range: { [`${subset}.AC_raw`]: { gt: 0 } } },
              ],
            },
          },
          sort: [{ pos: { order: 'asc' } }],
        },
      })

      return hits.map(shapeGnomadVariantSummary(subset, { type: 'region' }))
    })
  )

  const combinedVariants = mergeExomeAndGenomeVariantSummaries(exomeVariants, genomeVariants)

  // TODO: This can be fetched in parallel with exome/genome data
  const mnvs = await fetchGnomadMNVsByIntervals(ctx, [
    { xstart: getXpos(chrom, start), xstop: getXpos(chrom, stop) },
  ])
  annotateVariantsWithMNVFlag(combinedVariants, mnvs)

  return combinedVariants
  */
}

export default fetchVariantsByRegion
