// safe math on possibly null values
const add = (n1, n2, n3) => (n1 || 0) + (n2 || 0) + (n3 || 0)


const mergeExomeAndGenomeData = variants =>
  variants.map(variant => {
    const { spark_genome, ssc_genome } = variant

    var totalAC = 0
    var totalAN = 0

    //var totalProband = 0
    var totalHom = 0
    var totalHet = 0
    var max_cohort_heteroplasmy = 0

    if(spark_genome){
      totalAC += spark_genome.ac
      totalAN += spark_genome.an
      //totalProband += spark_genome.ac_proband
      totalHom += spark_genome.ac_hom
      totalHet += spark_genome.ac_het
      max_cohort_heteroplasmy = spark_genome.max_heteroplasmy
    }
    
    if(ssc_genome){
      totalAC += ssc_genome.ac
      totalAN += ssc_genome.an

      totalHom += ssc_genome.ac_hom
      totalHet += ssc_genome.ac_het

      //max_cohort_heteroplasmy = spark_genome.max_heteroplasmy

      //totalProband += ssc_genome.ac_proband
      //totalHom += ssc_genome.ac_hom
    }
        
    //const totalAC = add(spark_exome.ac,spark_genome.ac,ssc_genome.ac)
    //const totalAN = add(spark_exome.an,spark_genome.an,ssc_genome.an)
    
    const totalAF = totalAN ? totalAC / totalAN : 0
    


    //const totalProband = add(spark_exome.ac_proband, spark_genome.ac_proband,ssc_genome.ac_proband)
    //const totalHom = add(spark_exome.ac_hom, spark_genome.ac_hom,ssc_genome.ac_hom)
    //console.log("Done adding data")

    return{
      ...variant,
      ac: totalAC,
      an: totalAN,
      af: totalAF,
      ac_hom: totalHom,
      //ac_proband: totalProband,
      allele_freq: totalAF,
      ac_het: totalHet,
      max_heteroplasmy: max_cohort_heteroplasmy 
      //gnomad_freq: variant.an_gnomad ? variant.ac_gnomad/variant.an_gnomad : 0
    }


    /*
    // working exome only code
    if(variant.exome){
      return{
        ...variant,
        ...variant.exome,
        allele_freq: variant.exome.af,
        gnomad_freq: variant.an_gnomad ? variant.ac_gnomad/variant.an_gnomad : 0
      }
    }
    else{
      return{
        ...variant,
        ...variant.genome,
        allele_freq: variant.genome.af
      }      
    }
    */
    /*
    return {
      ...variant,
      ac: totalAC,
      an: totalAN,
      af: totalAF,
      allele_freq: totalAF, // hack for variant track which expects allele_freq field
      ac_hemi: add(exome.ac_hemi, genome.ac_hemi),
      ac_hom: add(exome.ac_hom, genome.ac_hom),
      filters: exome.filters.concat(genome.filters),
      populations: exome.populations.map((_, i) => ({
        id: exome.populations[i].id.toUpperCase(),
        ac: exome.populations[i].ac + genome.populations[i].ac,
        an: exome.populations[i].an + genome.populations[i].an,
        ac_hemi: exome.populations[i].ac_hemi + genome.populations[i].ac_hemi,
        ac_hom: exome.populations[i].ac_hom + genome.populations[i].ac_hom,
      })),
    }*/
  })


/*
const mergeExomeAndGenomeData = variants =>
  variants.map(variant => {
    const { exome, genome } = variant
    if (!exome) {
      return {
        ...variant,
        ...variant.genome,
        allele_freq: variant.genome.af, // hack for variant track which expects allele_freq field
      }
    }
    if (!genome) {
      return {
        ...variant,
        ...variant.exome,
        allele_freq: variant.exome.af, // hack for variant track which expects allele_freq field
      }
    }

    const totalAC = add(exome.ac, genome.ac)
    const totalAN = add(exome.an, genome.an)
    const totalAF = totalAN ? totalAC / totalAN : 0

    return {
      ...variant,
      ac: totalAC,
      an: totalAN,
      af: totalAF,
      allele_freq: totalAF, // hack for variant track which expects allele_freq field
      ac_hemi: add(exome.ac_hemi, genome.ac_hemi),
      ac_hom: add(exome.ac_hom, genome.ac_hom),
      filters: exome.filters.concat(genome.filters),
      populations: exome.populations.map((_, i) => ({
        id: exome.populations[i].id.toUpperCase(),
        ac: exome.populations[i].ac + genome.populations[i].ac,
        an: exome.populations[i].an + genome.populations[i].an,
        ac_hemi: exome.populations[i].ac_hemi + genome.populations[i].ac_hemi,
        ac_hom: exome.populations[i].ac_hom + genome.populations[i].ac_hom,
      })),
    }
  })
*/
export default mergeExomeAndGenomeData
