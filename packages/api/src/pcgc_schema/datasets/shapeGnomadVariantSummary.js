//import POPULATIONS from './populations'

const POPULATIONS = ['afr', 'amr', 'eas', 'eur', 'oth', 'sas']


const getFlags = (variantData, transcriptConsequence) => {
  const flags = []

  if (variantData.flags.lcr) {
    flags.push('lcr')
  }

  if (variantData.flags.segdup) {
    flags.push('segdup')
  }

  if (variantData.flags.lof_flag) {
    flags.push('lof_flag')
  }

  // gnomAD 2.1 variants may have an LC LoF flag if they have some LoF category VEP anotations
  // on non-protein-coding transcripts. However, other transcript consequences will be sorted
  // above the non-coding consequences. Checking the displayed consequence's category here
  // prevents the case where an LC LoF flag will be shown next to a missense/synonymous/other
  // VEP annotation on the gene page.
  // See #364.
  const isLofOnNonCodingTranscript =
    transcriptConsequence.lof === 'NC' ||
    (transcriptConsequence.category === 'lof' && !transcriptConsequence.lof)
  if (
    variantData.flags.lc_lof &&
    transcriptConsequence.category === 'lof' &&
    !isLofOnNonCodingTranscript
  ) {
    flags.push('lc_lof')
  }

  // This flag isn't working properly
  /*
  if (isLofOnNonCodingTranscript) {
    flags.push('nc_transcript')
  }
  */

  return flags
}

const shapeGnomadVariantSummary = (context) => {
  
  let getConsequence
  switch (context.type) {
    case 'gene':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(csq => csq.gene_id === context.geneId)
      break
    case 'region':
      getConsequence = variant => (variant.sortedTranscriptConsequences || [])[0]
      break
    case 'transcript':
      getConsequence = variant =>
        (variant.sortedTranscriptConsequences || []).find(
          csq => csq.transcript_id === context.transcriptId
        )
      break
    default:
      throw Error(`Invalid context for shapeGnomadVariantSummary: ${context.type}`)
  }
  

  // console.log("In function")
  return esHit => {
    // eslint-disable-next-line no-underscore-dangle
    const variantData = esHit._source
    // console.log(variantData)

    
    // eslint-disable-next-line no-underscore-dangle
    const isExomeVariant = esHit._index === 'spark_exomes'

    //const isExomeVariant = esHit._index === 'pcgc_exomes'

    /*
    const ac = variantData[subsetKey].AC_adj.total
    const an = variantData[subsetKey].AN_adj.total
    */
    const transcriptConsequence = getConsequence(variantData) || {}
    

    //console.log(variantData.AN_adj['eur'])
    const data_block = {
      
      //ac: variantData.AC_raw,
      //ac_hom: variantData.nhomalt_raw,
      //an: variantData.AN_raw,
      //af: variantData.AF_raw,        

      ac: variantData.AC,
      ac_hom: variantData.nhomalt,
      an: variantData.AN,
      af: variantData.AF,        
      
      ac_proband: variantData.AC_proband,
      an_proband: variantData.AN_proband,
      af_proband: variantData.AF_proband,

      filters: variantData.filters || [],
      populations: POPULATIONS.map(popId => ({
        id: popId.toUpperCase(),
        ac: variantData.AC_adj[popId] || 0,
        an: variantData.AN_adj[popId] || 0,
        //an: variantData.AN_adj[popId],

        //ac_hemi: variantData.nonpar ? (variantData[subsetKey].AC_adj[popId] || {}).male || 0 : 0,
        ac_hom: variantData.nhomalt_adj[popId] || 0,
      }))
    }

    return {
      // Variant ID fields
      alt: variantData.alt,
      chrom: variantData.chrom,
      pos: variantData.pos,
      ref: variantData.ref,
      variantId: variantData.variant_id,
      xpos: variantData.xpos,
      // Other fields
      
      consequence: transcriptConsequence.major_consequence,
      consequence_in_canonical_transcript: !!transcriptConsequence.canonical,
      flags: getFlags(variantData, transcriptConsequence),
      //flags: [],
      hgvs: transcriptConsequence.hgvs,
      hgvsc: transcriptConsequence.hgvsc ? transcriptConsequence.hgvsc.split(':')[1] : null,
      hgvsp: transcriptConsequence.hgvsp ? transcriptConsequence.hgvsp.split(':')[1] : null,
      rsid: variantData.rsid,
      ac_gnomad: 0,
      an_gnomad: 0,

      //bpkd_exome: esHit._index === 'bpkd_exomes' ? data_block : null,
      bpkd_exome: esHit._index === 'pkd_exomes' ? data_block : null,

      //spark_genome: esHit._index === 'spark_genomes' ? data_block : null,
      //spark_exome: esHit._index === 'spark_exomes' ? data_block : null,
      //ssc_genome: esHit._index === 'ssc_genomes' ? data_block : null,
      
      //spark_exome{
      //[isExomeVariant ? 'spark_genome' : 'spark_exome']: null,
      //[isExomeVariant ? 'spark_exome' : 'spark_genome']: {
      //[esHit._index === 'pcgc_exomes' ? 'spark_genome' : 'spark_exome']

      //[esHit._index === 'pcgc_exomes' ? 'spark_exome' : 'spark_genome'] : { 

      //exome: {
        /*
        ac: variantData.AC,
        ac_hom: variantData.nhomalt,
        an: variantData.AN,
        af: variantData.AF,
        */
        //ac_hemi: variantData.nonpar ? variantData[subsetKey].AC_adj.male : 0,
        //af: an ? ac / an : 0,

        /*
        ac: variantData.AC_raw,
        ac_hom: variantData.nhomalt_raw,
        an: variantData.AN_raw,
        af: variantData.AF_raw,        

        ac_proband: variantData.AC_proband,
        an_proband: variantData.AN_proband,
        af_proband: variantData.AF_proband,

        filters: variantData.filters || [],
        populations: POPULATIONS.map(popId => ({
          id: popId.toUpperCase(),
          ac: variantData.AC_adj[popId] || 0,
          an: variantData.AN_adj[popId] || 0,
          //an: variantData.AN_adj[popId],

          //ac_hemi: variantData.nonpar ? (variantData[subsetKey].AC_adj[popId] || {}).male || 0 : 0,
          ac_hom: variantData.nhomalt_adj[popId] || 0,
        })),
      },*/

    } //return

  }// return eHit

}// function

//sudo lsof -i -P -n | grep LISTEN
export default shapeGnomadVariantSummary
