import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'


export const HaplogroupType = new GraphQLObjectType({
  name: 'Haplogroup',
  fields: {
    id: { type: GraphQLString },
    an: { type: GraphQLInt },
    ac_het: { type: GraphQLInt },
    ac_hom: { type: GraphQLInt },
  },
})


export const PopulationType = new GraphQLObjectType({
  name: 'Population',
  fields: {
    id: { type: GraphQLString },
    an: { type: GraphQLInt },
    ac_het: { type: GraphQLInt },
    ac_hom: { type: GraphQLInt },
  },
})
