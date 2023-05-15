//import { UserVisibleError } from '../../errors'
//import { fetchGnomadMNVSummariesByVariantId } from './gnomadMultiNucleotideVariants'
//import { request } from "graphql-request"
//import fetch from 'node-fetch'
import 'whatwg-fetch'

const formatHistogram = histogramData => ({
  bin_edges: histogramData.bin_edges.split('|').map(s => Number(s)),
  bin_freq: histogramData.bin_freq.split('|').map(s => Number(s)),
  n_larger: histogramData.n_larger,
  n_smaller: histogramData.n_smaller,
})



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

/*
  const requests = [
    { index: 'gnomad_exomes_2_1_1', subset },
    // All genome samples are non_cancer, so separate non-cancer numbers are not stored
    { index: 'gnomad_genomes_2_1_1', subset: subset === 'non_cancer' ? 'gnomad' : subset },
  ]
*/

/*
  const [exomeData, genomeData] = await Promise.all(
    requests.map(({ index, subset: requestSubset }) =>
      ctx.database.elastic
        .search({
          index,
          type: 'variant',
          _source: [
            requestSubset,
            'ab_hist_alt',
            'allele_info',
            'alt',
            'chrom',
            'dp_hist_all',
            'dp_hist_alt',
            'filters',
            'flags',
            'gnomad_age_hist_het',
            'gnomad_age_hist_hom',
            'gq_hist_all',
            'gq_hist_alt',
            'nonpar',
            'pab_max',
            'pos',
            'qual',
            'ref',
            'rf_tp_probability',
            'rsid',
            'sortedTranscriptConsequences',
            'variant_id',
            'xpos',
          ],
          body: {
            query: {
              bool: {
                filter: [
                  { term: { variant_id: variantId } },
                  { range: { [`${requestSubset}.AC_raw`]: { gt: 0 } } },
                ],
              },
            },
          },
          size: 1,
        })
        .then(response => response.hits.hits[0])
        // eslint-disable-next-line no-underscore-dangle
        .then(doc => (doc ? { ...doc._source, ...doc._source[requestSubset] } : undefined))
    )
  )
  */


  /*
  return {
    exomeData,
    genomeData,
  }
  */

  //console.log("In here 2")

  const exomeData = await ctx.database.elastic.search({
  //await ctx.database.elastic.search({
    index: 'bpkd_exomes',
    _source: [
//      requestSubset,
//      'ab_hist_alt',
//      'allele_info',
      'alt',
      'chrom',
//      'dp_hist_all',
//      'dp_hist_alt',
      'filters',
//      'flags',
//      'gnomad_age_hist_het',
//      'gnomad_age_hist_hom',
//      'gq_hist_all',
//      'gq_hist_alt',
//      'nonpar',
//      'pab_max',
      'pos',
//      'qual',
      'ref',
//      'rf_tp_probability',
//      'rsid',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC_adj',
      'AN_adj',
      'AF_adj',
      'nhomalt_adj',
      'AC',
      'AF',
      'AN',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'AC_male',
      'AN_male',
      'nhomalt_male',
      'AC_female',
      'AN_female',
      'nhomalt_female',
      'genotype_quality',
      'genotype_depth',
      'allele_balance',
      'in_silico_predictors'
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
  //.then(function (response){
    //console.log("In here 3") 
    //console.log(response.hits.hits[0]._source)
    //return response.hits.hits[0]._source

  //})
  //.then(response => console.log(response.hits.hits[0]))
  //.then(response => return response.hits.hits[0])
  //.then(doc => (doc ? { ...doc._source } : undefined))
  //.then(response => response.hits.hits[0])
  console.log("Showing exome data")
  //console.log(exomeData.hits.hits[0]._source)

  //return esHit => {
  //  return esHit.hits.hits[0]
  //}
  //console.log("In here 3.1") 
  /*
  const genomeData = await ctx.database.elastic.search({
    index: 'spark_genomes',
    type: 'variant',
    _source: [
      'alt',
      'chrom',
      'filters',
      'pos',
      'ref',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC_adj',
      'AN_adj',
      'AF_adj',
      'nhomalt_adj',
      'AC',
      'AF',
      'AN',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'AC_male',
      'AN_male',
      'nhomalt_male',
      'AC_female',
      'AN_female',
      'nhomalt_female',
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

 const sscGenomeData = await ctx.database.elastic.search({
    index: 'ssc_genomes',
    type: 'variant',
    _source: [
      'alt',
      'chrom',
      'filters',
      'pos',
      'ref',
      'sortedTranscriptConsequences',
      'variant_id',
      'xpos',
      'AC_adj',
      'AN_adj',
      'AF_adj',
      'nhomalt_adj',
      'AC',
      'AF',
      'AN',
      'nhomalt',
      'AC_raw',
      'AN_raw',
      'AF_raw',
      'AC_male',
      'AN_male',
      'nhomalt_male',
      'AC_female',
      'AN_female',
      'nhomalt_female',
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
  */
  //console.log(exomeData.hits.hits[0]._source) 

  //console.log("In here 3") 
  //console.log(genomeData.hits.hits[0]) 

  //console.log("In here 4") 
  console.log(exomeData)

  return exomeData.hits.hits[0]._source

  /*
  return { exomeData: exomeData.hits.hits[0] ? exomeData.hits.hits[0]._source : undefined , 
           genomeData: genomeData.hits.hits[0] ? genomeData.hits.hits[0]._source : undefined,
           sscGenomeData: sscGenomeData.hits.hits[0] ? sscGenomeData.hits.hits[0]._source : undefined }
  */

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
    index: 'bpkd_exomes',
    //type: 'variant',
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

  /*
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
  */

  //console.log(exomeResponse)
  //console.log(genomeResponse)



  

  // eslint-disable no-underscore-dangle
  const exomeVariants = exomeResponse.hits.hits.map(doc => doc._source.variant_id)
  //const genomeVariants = genomeResponse.hits.hits.map(doc => doc._source.variant_id)
  // eslint-enable no-underscore-dangle 

  //console.log(exomeVariants)
  //console.log(genomeVariants)

  //const combinedVariants = exomeVariants.concat(genomeVariants)
  const combinedVariants = exomeVariants

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


    return gnomad_data
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




const fetchVariantDetails = async (ctx, variantId) => {
  //const { exomeData, genomeData } = await fetchGnomadVariantData(ctx, variantId, subset)


  //if (!exomeData && !genomeData) {
  //  throw new UserVisibleError('Variant not found')
  //}

  //const sharedData = exomeData || genomeData

  //console.log("In here 1")
  //const exomeData = await fetchVariantData(ctx, variantId)
  //console.log("In here 4")
  //console.log(exomeData)


  //const { exomeData, genomeData, sscGenomeData } = await fetchVariantData(ctx, variantId)
  const exomeData  = await fetchVariantData(ctx, variantId)


  //console.log(sscGenomeData) 

  // const sharedData = exomeData


  const clinVarES = await ctx.database.elastic.search({
    index: 'clinvar_grch38',
    //type: 'variant',
    _source: [
      'allele_id',
      'alt',
      'chrom',
      'clinical_significance',
      'gene_id_to_consequence_json',
      'gold_stars',
      'pos',
      'ref',
      'variant_id',
      'xpos',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
          ],
        },
      }
    },
    size: 1,
  })

  
  const clinVarData = clinVarES.hits.hits[0] ? clinVarES.hits.hits[0]._source : undefined
  //console.log(clinVarData)


  const mayoDB = await ctx.database.elastic.search({
    index: 'mayo_database',
    _source: [
      'variant_id',
      'MayoVariantID',
      'VariantTypeName',
      'ClinicalSignificanceShortName'
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
          ],
        },
      }
    },
    size: 1,
  })

  
  const mayoData = mayoDB.hits.hits[0] ? mayoDB.hits.hits[0]._source : undefined
  //console.log(mayoData)
  
  /*
  const denovoES = await ctx.database.elastic.search({
    index: 'autism_dnms',
    type: 'variant',
    _source: [
      'variant_id',
      'high_confidence_dnm',
    ],
    body: {
      query: {
        bool: {
          filter: [
            { term: { variant_id: variantId } },
          ],
        },
      }
    },
    size: 1,
  })

  
  const denovoData = denovoES.hits.hits[0] ? denovoES.hits.hits[0]._source : undefined
  */
  //console.log("In here")
  //console.log(denovoData)

  


  /*
  const query = `{
    variant(variantId: "${variantId}", dataset: gnomad_r3){
      rsid
      variantId    
    }
  }
  `
  const gnomad_data = undefined
    


  try{
    console.log("In here1")
    gnomad_data = await request("https://gnomad.broadinstitute.org/api", query)
  //console.log(gnomad_data.data)

  }catch(error){
  }
  */

  const gnomad_data = await fetchRSID(ctx, variantId)
  //console.log("Showing gnomod rsID data")
  //console.log(gnomad_data)  

  const gnomad_pop_data = await fetchGnomadPopFreq(ctx, variantId)

  //console.log("Showing gnomod population data")
  //console.log(gnomad_pop_data)

  //const sharedData = exomeData || genomeData || sscGenomeData
  const sharedData = exomeData
  //console.log(sharedData)

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

  const colocatedVariants = await fetchColocatedVariants(ctx, variantId)
  // console.log(colocatedVariants)
  //console.log(exomeData.genotype_depth.all_raw)

  return {
    gqlType: 'VariantDetails',
    // variant interface fields
    ...sharedVariantFields,
    // gnomAD specific fields

    /*
    age_distribution: {
      het: formatHistogram(sharedData.gnomad_age_hist_het),
      hom: formatHistogram(sharedData.gnomad_age_hist_hom),
    },
    colocatedVariants,
    multiNucleotideVariants,
    */

    colocatedVariants,
    gnomadPopFreq: gnomad_pop_data ? gnomad_pop_data.populations : null,
    gnomadAF: gnomad_pop_data ? gnomad_pop_data.ac/gnomad_pop_data.an : null,
    

    bpkd_exome: exomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: exomeData.AC_adj.total,
          //an: exomeData.AN_adj.total,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          //ac_hom: exomeData.nhomalt_adj.total,

          ac: exomeData.AC,
          an: exomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: exomeData.nhomalt,

          ac_male: exomeData.AC_male,
          an_male: exomeData.AN_male,
          ac_male_hom: exomeData.nhomalt_male,


          ac_female: exomeData.AC_female,
          an_female: exomeData.AN_female,
          ac_female_hom: exomeData.nhomalt_female,
          
          //faf95: formatFilteringAlleleFrequency(exomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(exomeData, 'faf99_adj'),
          //filters: exomeData.filters,
          populations: formatPopulations(exomeData),
                    
          qualityMetrics: {
            
            alleleBalance: {
              //alt: formatHistogram(exomeData.ab_hist_alt),
              alt: exomeData.allele_balance.alt_raw,
            },
            
            genotypeDepth: {
              //all: formatHistogram(exomeData.genotype_depth.all_raw),
              //alt: formatHistogram(exomeData.genotype_depth.alt_raw),
              all: exomeData.genotype_depth.all_raw,
              alt: exomeData.genotype_depth.alt_raw,

            },            
            genotypeQuality: {
              //all: formatHistogram(exomeData.gq_hist_all),
              //alt: formatHistogram(exomeData.gq_hist_alt),

              all: exomeData.genotype_quality.all_raw,
              alt: exomeData.genotype_quality.alt_raw,

            },

            /*
            siteQualityMetrics: {
              ...exomeData.allele_info,
              pab_max: exomeData.pab_max,
              RF: exomeData.rf_tp_probability,
              SiteQuality: exomeData.qual,
            },*/
          },

        }
      : null,


    /*
    spark_exome: exomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: exomeData.AC_adj.total,
          //an: exomeData.AN_adj.total,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          //ac_hom: exomeData.nhomalt_adj.total,

          ac: exomeData.AC,
          an: exomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: exomeData.nhomalt,

          ac_male: exomeData.AC_male,
          an_male: exomeData.AN_male,
          ac_male_hom: exomeData.nhomalt_male,


          ac_female: exomeData.AC_female,
          an_female: exomeData.AN_female,
          ac_female_hom: exomeData.nhomalt_female,
          
          //faf95: formatFilteringAlleleFrequency(exomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(exomeData, 'faf99_adj'),
          //filters: exomeData.filters,
          populations: formatPopulations(exomeData),
                    
          qualityMetrics: {
            
            alleleBalance: {
              //alt: formatHistogram(exomeData.ab_hist_alt),
              alt: exomeData.allele_balance.alt_raw,
            },
            
            genotypeDepth: {
              //all: formatHistogram(exomeData.genotype_depth.all_raw),
              //alt: formatHistogram(exomeData.genotype_depth.alt_raw),
              all: exomeData.genotype_depth.all_raw,
              alt: exomeData.genotype_depth.alt_raw,

            },            
            genotypeQuality: {
              //all: formatHistogram(exomeData.gq_hist_all),
              //alt: formatHistogram(exomeData.gq_hist_alt),

              all: exomeData.genotype_quality.all_raw,
              alt: exomeData.genotype_quality.alt_raw,

            },

            
            siteQualityMetrics: {
              ...exomeData.allele_info,
              pab_max: exomeData.pab_max,
              RF: exomeData.rf_tp_probability,
              SiteQuality: exomeData.qual,
            },
          },

        }
      : null,

    
    //flags: ['lcr', 'segdup', 'lc_lof', 'lof_flag'].filter(flag => sharedData.flags[flag]),
    spark_genome: genomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: genomeData.AC_adj.total,
          //an: genomeData.AN_adj.total,
          //ac_hemi: genomeData.nonpar ? genomeData.AC_adj.male : 0,
          //ac_hom: genomeData.nhomalt_adj.total,
          //faf95: formatFilteringAlleleFrequency(genomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(genomeData, 'faf99_adj'),
          //filters: genomeData.filters,
          
          ac: genomeData.AC,
          an: genomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: genomeData.nhomalt,

          ac_male: genomeData.AC_male,
          an_male: genomeData.AN_male,
          ac_male_hom: genomeData.nhomalt_male,


          ac_female: genomeData.AC_female,
          an_female: genomeData.AN_female,
          ac_female_hom: genomeData.nhomalt_female,


          populations: formatPopulations(genomeData),
          
          
          qualityMetrics: {
            alleleBalance: {
              alt: formatHistogram(genomeData.ab_hist_alt),
            },
            genotypeDepth: {
              all: formatHistogram(genomeData.dp_hist_all),
              alt: formatHistogram(genomeData.dp_hist_alt),
            },
            genotypeQuality: {
              all: formatHistogram(genomeData.gq_hist_all),
              alt: formatHistogram(genomeData.gq_hist_alt),
            },
            siteQualityMetrics: {
              ...genomeData.allele_info,
              pab_max: genomeData.pab_max,
              RF: genomeData.rf_tp_probability,
              SiteQuality: genomeData.qual,
            },
          },
        }
      : null,

    ssc_genome: sscGenomeData
      ? {
          // Include variant fields so that the reads data resolver can access them.
          ...sharedVariantFields,
          //ac: genomeData.AC_adj.total,
          //an: genomeData.AN_adj.total,
          //ac_hemi: genomeData.nonpar ? genomeData.AC_adj.male : 0,
          //ac_hom: genomeData.nhomalt_adj.total,
          //faf95: formatFilteringAlleleFrequency(genomeData, 'faf95_adj'),
          //faf99: formatFilteringAlleleFrequency(genomeData, 'faf99_adj'),
          //filters: genomeData.filters,
          
          ac: sscGenomeData.AC,
          an: sscGenomeData.AN,
          //ac_hemi: exomeData.nonpar ? exomeData.AC_adj.male : 0,
          ac_hom: sscGenomeData.nhomalt,

          ac_male: sscGenomeData.AC_male,
          an_male: sscGenomeData.AN_male,
          ac_male_hom: sscGenomeData.nhomalt_male,


          ac_female: sscGenomeData.AC_female,
          an_female: sscGenomeData.AN_female,
          ac_female_hom: sscGenomeData.nhomalt_female,


          populations: formatPopulations(sscGenomeData),
          
        }
      : null,
    */

    //rsid: sharedData.rsid,
    //faf95: { popmax: 0.00000514, popmax_population: 'NFE' }
    mayo_variant_details: mayoData ? mayoData : null,
    gnomad_faf95_popmax: gnomad_pop_data ? gnomad_pop_data.faf95.popmax : null,
    gnomad_faf95_population: gnomad_pop_data ? gnomad_pop_data.faf95.popmax_population : null,

    rsid: gnomad_data.data.variant ? gnomad_data.data.variant.rsid : null,
    //rsid: null,
    clinvarAlleleID:  clinVarData ? clinVarData.allele_id : null,
    //denovoHC: denovoData ? denovoData.high_confidence_dnm : null,
    sortedTranscriptConsequences: sharedData.sortedTranscriptConsequences || [],
    in_silico_predictors: exomeData ? exomeData.in_silico_predictors : null
  }
}

export default fetchVariantDetails
