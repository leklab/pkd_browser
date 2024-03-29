/* eslint-disable camelcase */

import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
} from 'graphql'

import { withCache } from '../../utilities/redis'

/*
import { datasetArgumentTypeForMethod } from '../datasets/datasetArgumentTypes'
import datasetsConfig from '../datasets/datasetsConfig'
import fetchGnomadStructuralVariantsByGene from '../datasets/gnomad_sv_r2/fetchGnomadStructuralVariantsByGene'
*/

import fetchGnomadStructuralVariantsByGene from '../datasets/fetchGnomadStructuralVariantsByGene'
import { StructuralVariantSummaryType } from './structuralVariant'

import {
  ClinvarVariantType,
  fetchClinvarVariantsInGene,
  fetchClinvarVariantsInTranscript,
} from '../datasets/clinvar'
// import { UserVisibleError } from '../errors'


import transcriptType, {
  CompositeTranscriptType,
  fetchCompositeTranscriptByGene,
  lookupTranscriptsByTranscriptId,
  lookupAllTranscriptsByGeneId,
} from './transcript'

import exonType, { lookupExonsByGeneId } from './exon'

/*
import constraintType, { lookUpConstraintByTranscriptId } from './constraint'

import { PextRegionType, fetchPextRegionsByGene } from './pext'
import {
  RegionalMissenseConstraintRegionType,
  fetchExacRegionalMissenseConstraintRegions,
} from './regionalConstraint'

*/

import { VariantSummaryType } from './variant'

import fetchVariantsByGene from '../datasets/fetchVariantsByGene'

const geneType = new GraphQLObjectType({
  name: 'Gene',
  fields: () => ({
    _id: { type: GraphQLString },
    omim_description: { type: GraphQLString },
    gene_id: { type: GraphQLString },
    omim_accession: { type: GraphQLString },
    chrom: { type: GraphQLString },
    strand: { type: GraphQLString },
    full_gene_name: { type: GraphQLString },
    gene_name_upper: { type: GraphQLString },
    other_names: { type: new GraphQLList(GraphQLString) },
    canonical_transcript: { type: GraphQLString },
    start: { type: GraphQLInt },
    stop: { type: GraphQLInt },
    xstop: { type: GraphQLFloat },
    xstart: { type: GraphQLFloat },
    gene_name: { type: GraphQLString },
    composite_transcript: {
      type: CompositeTranscriptType,
      resolve: (obj, args, ctx) => fetchCompositeTranscriptByGene(ctx, obj),
    },
    
    clinvar_variants: {
      type: new GraphQLList(ClinvarVariantType),
      args: {
        transcriptId: { type: GraphQLString },
      },
      resolve: (obj, args, ctx) => {
        return args.transcriptId
          ? fetchClinvarVariantsInTranscript(args.transcriptId, ctx)
          : fetchClinvarVariantsInGene(obj.gene_id, ctx)
      },
    },
    /*
    pext: {
      type: new GraphQLList(PextRegionType),
      resolve: (obj, args, ctx) => fetchPextRegionsByGene(ctx, obj.gene_id),
    },*/
    transcript: {
      type: transcriptType,
      resolve: (obj, args, ctx) =>
        lookupTranscriptsByTranscriptId(ctx.database.gnomad, obj.canonical_transcript, obj.gene_name),
    },
    transcripts: {
      type: new GraphQLList(transcriptType),
      resolve: (obj, args, ctx) =>
        lookupAllTranscriptsByGeneId(ctx.database.gnomad, obj.gene_id),
    },
    exons: {
      type: new GraphQLList(exonType),
      resolve: (obj, args, ctx) => lookupExonsByGeneId(ctx.database.gnomad, obj.gene_id),
    },
    /*
    exacv1_constraint: {
      type: constraintType,
      resolve: (obj, args, ctx) =>
        lookUpConstraintByTranscriptId(ctx.database.gnomad, obj.canonical_transcript),
    },
    exac_regional_missense_constraint_regions: {
      type: new GraphQLList(RegionalMissenseConstraintRegionType),
      resolve: (obj, args, ctx) => fetchExacRegionalMissenseConstraintRegions(ctx, obj.gene_name),
    },
    */
    structural_variants: {
      type: new GraphQLList(StructuralVariantSummaryType),
      resolve: async (obj, args, ctx) => fetchGnomadStructuralVariantsByGene(ctx, obj),
    },
    
    variants: {
      type: new GraphQLList(VariantSummaryType),
      args: {
        //dataset: { type: datasetArgumentTypeForMethod('fetchVariantsByGene') },
        transcriptId: { type: GraphQLString },
      },
      resolve: (obj, args, ctx) => {

        /*
        if (args.transcriptId) {
          const fetchVariantsByTranscript = datasetsConfig[args.dataset].fetchVariantsByTranscript
          return fetchVariantsByTranscript(ctx, args.transcriptId, obj)
        }
        */

        console.log(obj.gene_id)
        console.log(obj.chrom)
        //const fetchVariantsByGene = datasetsConfig[args.dataset].fetchVariantsByGene

        
        return withCache(ctx, `gene_cache:${obj.gene_id}`, async () => {
          return fetchVariantsByGene(ctx, obj.gene_id, obj.canonical_transcript)
        })
        

        //return fetchVariantsByGene(ctx, obj.gene_id, obj.canonical_transcript)
      },
    },
  }),
})

export default geneType

export const lookupGeneByGeneId = (db, gene_id) =>
  db.collection('genes').findOne({ gene_id })

export const lookupGeneByName = async (db, geneName) => {
  const gene = await db.collection('genes').findOne({ gene_name_upper: geneName.toUpperCase() })
  if (!gene) {
    throw new UserVisibleError('Gene not found')
  }
  return gene
}

export const fetchGenesByInterval = (ctx, { xstart, xstop }) =>
  ctx.database.gnomad
    .collection('genes')
    .find({ $and: [{ xstart: { $lte: xstop } }, { xstop: { $gte: xstart } }] })
    .toArray()
