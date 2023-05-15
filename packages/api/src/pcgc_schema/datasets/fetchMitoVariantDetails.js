//import { UserVisibleError } from '../../errors'
//import { fetchGnomadMNVSummariesByVariantId } from './gnomadMultiNucleotideVariants'
//import { request } from "graphql-request"
import 'whatwg-fetch'

//import fetch from 'node-fetch'


/*
const formatHistogram = histogramData => ({
  bin_edges: histogramData.bin_edges.split('|').map(s => Number(s)),
  bin_freq: histogramData.bin_freq.split('|').map(s => Number(s)),
  n_larger: histogramData.n_larger,
  n_smaller: histogramData.n_smaller,
})

*/

//const POPULATIONS = ['afr', 'amr', 'asj', 'eas', 'fin', 'nfe', 'oth', 'sas']
const POPULATIONS = ['afr', 'amr', 'eas', 'eur', 'oth', 'sas']

/*
const SUBPOPULATIONS = {
  afr: ['female', 'male'],
  amr: ['female', 'male'],
  asj: ['female', 'male'],
  eas: ['female', 'male', 'jpn', 'kor', 'oea'],
  fin: ['female', 'male'],
  nfe: ['female', 'male', 'bgr', 'est', 'nwe', 'onf', 'seu', 'swe'],
  oth: ['female', 'male'],
  sas: ['female', 'male'],
}
*/

const formatPopulations = variantData =>
  POPULATIONS.map(popId => ({
    id: popId.toUpperCase(),
    ac: variantData.AC_adj[popId] || 0,
    an: variantData.AN_adj[popId] || 0,
    ac_hom: variantData.nhomalt_adj[popId] || 0,

    //ac: (variantData.AC_adj[popId] || {}).total || 0,
    //an: (variantData.AN_adj[popId] || {}).total || 0,
    //ac_hemi: variantData.nonpar ? (variantData.AC_adj[popId] || {}).male || 0 : 0,
    //ac_hom: (variantData.nhomalt_adj[popId] || {}).total || 0,

    /*
    subpopulations: SUBPOPULATIONS[popId].map(subPopId => ({
      id: subPopId.toUpperCase(),
      ac: (variantData.AC_adj[popId] || {})[subPopId] || 0,
      an: (variantData.AN_adj[popId] || {})[subPopId] || 0,
      ac_hom: (variantData.nhomalt_adj[popId] || {})[subPopId] || 0,
    })),*/

  }))

/*
const formatFilteringAlleleFrequency = (variantData, fafField) => {
  const fafData = variantData[fafField]
  const { total, ...populationFAFs } = variantData[fafField]

  let popmaxFAF = -Infinity
  let popmaxPopulation = null

  Object.keys(populationFAFs)
    // gnomAD 2.1.0 calculated FAF for singleton variants.
    // This filters out those invalid FAFs.
    .filter(popId => variantData.AC_adj[popId].total > 1)
    .forEach(popId => {
      if (populationFAFs[popId] > popmaxFAF) {
        popmaxFAF = fafData[popId]
        popmaxPopulation = popId.toUpperCase()
      }
    })

  if (popmaxFAF === -Infinity) {
    popmaxFAF = null
  }

  return {
    popmax: popmaxFAF,
    popmax_population: popmaxPopulation,
  }
}
*/

const fetchVariantData = async (ctx, variantId) => {

 

   const genomeData = await ctx.database.elastic.search({
    index: 'spark_mito',
    //type: 'variant',
    _source: [
      'alt',
      'chrom',
      'filters',
      'pos',
      'ref',
      'sortedTranscriptConsequences',
      'haplogroups',
      'populations',
      'variant_id',
      'xpos',
      'ac',
      'af',
      'an',
      'ac_het',
      'ac_hom',
      'max_heteroplasmy'
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
            //{ range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
          ],
        },
      },
    },
    size: 1,
  })

   /*
  return { exomeData: exomeData.hits.hits[0] ? exomeData.hits.hits[0]._source : undefined , 
           genomeData: genomeData.hits.hits[0] ? genomeData.hits.hits[0]._source : undefined,
           sscGenomeData: sscGenomeData.hits.hits[0] ? sscGenomeData.hits.hits[0]._source : undefined }
  */

  return { genomeData: genomeData.hits.hits[0] ? genomeData.hits.hits[0]._source : undefined }


}


const fetchColocatedVariants = async (ctx, variantId) => {
  const parts = variantId.split('-')
  const chrom = parts[0]
  const pos = Number(parts[1])

  /*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]

  const [exomeResponse, genomeResponse] = await Promise.all(
    requests.map(({ index, subset: requestSubset }) =>
      ctx.database.elastic.search({
        index,
        type: 'variant',
        _source: ['variant_id'],
        body: {
          query: {
            bool: {
              filter: [
                { term: { chrom } },
                { term: { pos } },
                { range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
              ],
            },
          },
        },
      })
    )
  )
  */

  const exomeResponse = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    index: 'pcgc_exomes',
    type: 'variant',
    _source: ['variant_id'],
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            { term: { pos } },
            { range: { ['AC_raw']: { gt: 0 } } },
          ],
        },
      },
    },
  })

  const genomeResponse = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    index: 'spark_genomes',
    type: 'variant',
    _source: ['variant_id'],
    body: {
      query: {
        bool: {
          filter: [
            { term: { chrom } },
            { term: { pos } },
          ],
        },
      },
    },
  })


  //console.log(exomeResponse)
  //console.log(genomeResponse)



  

  // eslint-disable no-underscore-dangle
  const exomeVariants = exomeResponse.hits.hits.map(doc => doc._source.variant_id)
  const genomeVariants = genomeResponse.hits.hits.map(doc => doc._source.variant_id)
  // eslint-enable no-underscore-dangle 

  //console.log(exomeVariants)
  //console.log(genomeVariants)

  const combinedVariants = exomeVariants.concat(genomeVariants)

  //return combinedVariants

  
  return combinedVariants
    .filter(otherVariantId => otherVariantId !== variantId)
    .sort()
    .filter(
      (otherVariantId, index, allOtherVariantIds) =>
        otherVariantId !== allOtherVariantIds[index + 1]
    )

  


}



const fetchRSID = async (ctx, variantId) => {

  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      rsid
      variantId    
    }
  }
  ` 

  try{
    //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)

    const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
      body: JSON.stringify({
        query
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }}).then(response => response.json())

    return gnomad_data.json()
  }catch(error){
    return undefined
  }

}

const fetchGnomadPopFreq = async (ctx, variantId) => {

  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      ... on VariantDetails{
        genome{
          ac
          an
          faf95 {
            popmax
            popmax_population
          }

          populations{
            id
            ac
            an
            ac_hemi
            ac_hom
          }
        }
      }
    }
  }
  ` 

  try{
    //const gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)    
    const gnomad_data = await fetch("https://gnomad.broadinstitute.org/api", {
      body: JSON.stringify({
        query
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }}).then(response => response.json())

    //console.log(gnomad_data.variant.genome.populations)

    return gnomad_data.variant.genome
    //return gnomad_data
  }catch(error){
    return undefined
  }

}




const fetchMitoVariantDetails = async (ctx, variantId) => {


  const { genomeData } = await fetchVariantData(ctx, variantId)


  const sharedData = genomeData 

  const sharedVariantFields = {
    alt: sharedData.alt,
    chrom: sharedData.chrom,
    pos: sharedData.pos,
    ref: sharedData.ref,
    variantId: sharedData.variant_id,
    xpos: sharedData.xpos,
  }

  /*
  const [colocatedVariants, multiNucleotideVariants] = await Promise.all([
    fetchColocatedVariants(ctx, variantId, subset),
    fetchGnomadMNVSummariesByVariantId(ctx, variantId),
  ])
  */

  //const colocatedVariants = await fetchColocatedVariants(ctx, variantId)
  // console.log(colocatedVariants)
  console.log(sharedData)
  return {
    gqlType: 'MitoVariantDetails',
    // variant interface fields
    ...sharedVariantFields,

    //colocatedVariants,
    
    //flags: ['lcr', 'segdup', 'lc_lof', 'lof_flag'].filter(flag => sharedData.flags[flag]),
    spark_genome: genomeData
      ? {
          ...sharedVariantFields,
          
          ac: genomeData.ac,
          an: genomeData.an,
          ac_hom: genomeData.ac_hom,
          ac_het: genomeData.ac_het,
          max_heteroplasmy: genomeData.max_heteroplasmy          
        }
      : null,

    sortedTranscriptConsequences: sharedData.sortedTranscriptConsequences || [],
    haplogroups: sharedData.haplogroups || [],
    populations: sharedData.populations || [],    
  }
}

export default fetchMitoVariantDetails
