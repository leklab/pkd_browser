import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const MitoVariantInterface = new GraphQLInterfaceType({
  name: 'MitoVariant',
  fields: {
    alt: { type: new GraphQLNonNull(GraphQLString) },
    chrom: { type: new GraphQLNonNull(GraphQLString) },
    pos: { type: new GraphQLNonNull(GraphQLInt) },
    ref: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: new GraphQLNonNull(GraphQLString) },
    xpos: { type: new GraphQLNonNull(GraphQLFloat) },
  },
})

const MitoVariantSequencingDataType = new GraphQLObjectType({
  name: 'MitoVariantSequencingData',
  fields: {
    ac: { type: GraphQLInt },
    ac_het: { type: GraphQLInt },
    ac_hom: { type: GraphQLInt },
    an: { type: GraphQLInt },
    af: { type: GraphQLFloat },
    max_heteroplasmy : { type: GraphQLFloat },
    
    //ac_proband: { type: GraphQLInt },
    //an_proband: { type: GraphQLInt },
    //af_proband: { type: GraphQLFloat },
    
    filters: { type: new GraphQLList(GraphQLString) },
    /*
    populations: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'VariantPopulations',
          fields: {
            id: { type: new GraphQLNonNull(GraphQLString) },
            ac: { type: new GraphQLNonNull(GraphQLInt) },
            an: { type: new GraphQLNonNull(GraphQLInt) },
            //ac_hemi: { type: new GraphQLNonNull(GraphQLInt) },
            ac_hom: { type: new GraphQLNonNull(GraphQLInt) },
          },
        })
      ),
    },
    */

  },
})


export const MitoVariantSummaryType = new GraphQLObjectType({
  name: 'MitoVariantSummary',
  fields: {
    // Variant ID fields
    alt: { type: new GraphQLNonNull(GraphQLString) },
    chrom: { type: new GraphQLNonNull(GraphQLString) },
    pos: { type: new GraphQLNonNull(GraphQLInt) },
    ref: { type: new GraphQLNonNull(GraphQLString) },
    variantId: { type: new GraphQLNonNull(GraphQLString) },
    xpos: { type: new GraphQLNonNull(GraphQLFloat) },
    // Other fields
    consequence: { type: GraphQLString },
    consequence_in_canonical_transcript: { type: GraphQLBoolean },
    flags: { type: new GraphQLList(GraphQLString) },
    hgvs: { type: GraphQLString },
    hgvsc: { type: GraphQLString },
    hgvsp: { type: GraphQLString },
    //rsid: { type: GraphQLString },

    //ac_gnomad: { type: GraphQLInt },
    //an_gnomad: { type: GraphQLInt },    

    // will keep with this name for future
    //spark_exome: { type: VariantSequencingDataType },
    spark_genome: { type: MitoVariantSequencingDataType },
    ssc_genome: { type: MitoVariantSequencingDataType },
    //ssc_genome: { type: VariantSequencingDataType },
    // genome: { type: VariantSequencingDataType },
  },
})
