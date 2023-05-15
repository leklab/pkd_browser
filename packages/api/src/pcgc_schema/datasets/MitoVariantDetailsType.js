import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

//import { UserVisibleError } from '../../errors'
import { MitoVariantInterface } from '../types/mito_variant'
//import { resolveReads, ReadDataType } from '../shared/reads'
import { TranscriptConsequenceType } from './transcriptConsequence'
import { HaplogroupType } from './haplogroups'
import { PopulationType } from './haplogroups'
//import { MultiNucleotideVariantSummaryType } from './gnomadMultiNucleotideVariants'


/*
const PopulationType = new GraphQLObjectType({
  name: 'VariantPopulation',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLString) },
    ac: { type: new GraphQLNonNull(GraphQLInt) },
    an: { type: new GraphQLNonNull(GraphQLInt) },
    ac_hemi: { type: new GraphQLNonNull(GraphQLInt) },
    ac_hom: { type: new GraphQLNonNull(GraphQLInt) },
    //subpopulations: { type: new GraphQLList(GnomadSubpopulationType) },
  },
})
*/

const MitoVariantDetailsType = new GraphQLObjectType({
  name: 'MitoVariantDetails',
  interfaces: [MitoVariantInterface],
  fields: {
    // variant interface fields
    alt: { type: new GraphQLNonNull(GraphQLString) },
    chrom: { type: new GraphQLNonNull(GraphQLString) },
    pos: { type: new GraphQLNonNull(GraphQLInt) },
    ref: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: new GraphQLNonNull(GraphQLString) },
    xpos: { type: new GraphQLNonNull(GraphQLFloat) },

    //colocatedVariants: { type: new GraphQLList(GraphQLString) },
        
    //flags: { type: new GraphQLList(GraphQLString) },
    spark_genome: {
      type: new GraphQLObjectType({
        name: 'MitoVariantDetailsGenomeData',
        fields: {
          ac: { type: GraphQLInt },
          an: { type: GraphQLInt },
          ac_het: { type: GraphQLInt },
          ac_hom: { type: GraphQLInt },
          max_heteroplasmy: {type: GraphQLFloat }          
        },
      }),
    },

    ssc_genome: {
      type: new GraphQLObjectType({
        name: 'MitoVariantDetailsGenomeDataX',
        fields: {
          ac: { type: GraphQLInt },
          an: { type: GraphQLInt },
          ac_het: { type: GraphQLInt },
          ac_hom: { type: GraphQLInt },
          max_heteroplasmy: {type: GraphQLFloat }          
        },
      }),
    },
    
    sortedTranscriptConsequences: { type: new GraphQLList(TranscriptConsequenceType) },
    haplogroups: { type: new GraphQLList(HaplogroupType)},
    populations: { type: new GraphQLList(PopulationType)},

  },
  isTypeOf: variantData => variantData.gqlType === 'MitoVariantDetails',
})

export default MitoVariantDetailsType
