const mergePcgcAndGnomadVariantSummaries = (pcgcVariants, gnomadVariants) => {
  const mergedVariants = []

  while (pcgcVariants.length) {
    const currentPcgcVariant = pcgcVariants[0]
    const currentGnomadVariant = gnomadVariants[0]

    if (currentGnomadVariant === undefined) {
      mergedVariants.push(pcgcVariants.shift())
    } 
    else if (currentPcgcVariant === undefined) {
      //mergedVariants.push(genomeVariants.shift())
      gnomadVariants.shift()

    } 
    else if (currentPcgcVariant.pos < currentGnomadVariant.pos) {
      mergedVariants.push(pcgcVariants.shift())
    } 
    else if (currentGnomadVariant.pos < currentPcgcVariant.pos) {
      gnomadVariants.shift()      
      //mergedVariants.push(genomeVariants.shift())
    } 

    else {
      const currentPosition = currentPcgcVariant.pos

      const pcgcVariantsAtThisPosition = []
      
      while (pcgcVariants.length && pcgcVariants[0].pos === currentPosition) {
        pcgcVariantsAtThisPosition.push(pcgcVariants.shift())
      }
      const gnomadVariantsAtThisPosition = []
      
      while (gnomadVariants.length && gnomadVariants[0].pos === currentPosition) {
        gnomadVariantsAtThisPosition.push(gnomadVariants.shift())
      }

      pcgcVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      gnomadVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (pcgcVariantsAtThisPosition.length || gnomadVariantsAtThisPosition.length) {
        const currentPcgcVariantAtThisPosition = pcgcVariantsAtThisPosition[0]
        const currentGnomadVariantAtThisPosition = gnomadVariantsAtThisPosition[0]

        if (currentGnomadVariantAtThisPosition === undefined) {
          mergedVariants.push(pcgcVariantsAtThisPosition.shift())
        } 
        else if (currentPcgcVariantAtThisPosition === undefined) {
          //mergedVariants.push(genomeVariantsAtThisPosition.shift())
          gnomadVariantsAtThisPosition.shift()
        } 
        else if (currentPcgcVariantAtThisPosition.variantId.localeCompare(currentGnomadVariantAtThisPosition.variantId) < 0) {
          mergedVariants.push(pcgcVariantsAtThisPosition.shift())
        } 
        else if (currentPcgcVariantAtThisPosition.variantId.localeCompare(currentGnomadVariantAtThisPosition.variantId) > 0) {
          //mergedVariants.push(genomeVariantsAtThisPosition.shift())
          gnomadVariantsAtThisPosition.shift()
        } 
        else {
          const tmp_gnomad = gnomadVariantsAtThisPosition.shift()
          const tmp_push = pcgcVariantsAtThisPosition.shift()
          

          if(tmp_gnomad.exome){
            tmp_push.ac_gnomad += tmp_gnomad.exome.ac
            tmp_push.an_gnomad += tmp_gnomad.exome.an
            //console.log(tmp_push.variantId)
            //console.log(tmp_gnomad.exome.ac)
            //console.log(tmp_push.exome.ac_gnomad)
            //console.log(tmp_push)
          }

          if(tmp_gnomad.genome){
            tmp_push.ac_gnomad += tmp_gnomad.genome.ac
            tmp_push.an_gnomad += tmp_gnomad.genome.an
            //console.log(tmp_push.variantId)
            //console.log(tmp_gnomad.exome.ac)
            //console.log(tmp_push.exome.ac_gnomad)
            //console.log(tmp_push)
          }

          // take rsid from gnomAD
          if(tmp_gnomad.rsid){
            tmp_push.rsid = tmp_gnomad.rsid
          }

          mergedVariants.push(tmp_push)

          /*
          mergedVariants.push({
            ...pcgcVariantsAtThisPosition.shift(),
            //gnomad_ac: gnomadVariantsAtThisPosition.shift().exome.ac,
          })*/
        }
      }
    }
  }


  /* 
  while (exomeVariants.length || genomeVariants.length) {
    const currentExomeVariant = exomeVariants[0]
    const currentGenomeVariant = genomeVariants[0]

    if (currentGenomeVariant === undefined) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentExomeVariant === undefined) {
      mergedVariants.push(genomeVariants.shift())
    } else if (currentExomeVariant.pos < currentGenomeVariant.pos) {
      mergedVariants.push(exomeVariants.shift())
    } else if (currentGenomeVariant.pos < currentExomeVariant.pos) {
      mergedVariants.push(genomeVariants.shift())
    } else {
      const currentPosition = currentExomeVariant.pos

      const exomeVariantsAtThisPosition = []
      while (exomeVariants.length && exomeVariants[0].pos === currentPosition) {
        exomeVariantsAtThisPosition.push(exomeVariants.shift())
      }
      const genomeVariantsAtThisPosition = []
      while (genomeVariants.length && genomeVariants[0].pos === currentPosition) {
        genomeVariantsAtThisPosition.push(genomeVariants.shift())
      }

      exomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      genomeVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (exomeVariantsAtThisPosition.length || genomeVariantsAtThisPosition.length) {
        const currentExomeVariantAtThisPosition = exomeVariantsAtThisPosition[0]
        const currentGenomeVariantAtThisPosition = genomeVariantsAtThisPosition[0]

        if (currentGenomeVariantAtThisPosition === undefined) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (currentExomeVariantAtThisPosition === undefined) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) < 0
        ) {
          mergedVariants.push(exomeVariantsAtThisPosition.shift())
        } else if (
          currentExomeVariantAtThisPosition.variantId.localeCompare(
            currentGenomeVariantAtThisPosition.variantId
          ) > 0
        ) {
          mergedVariants.push(genomeVariantsAtThisPosition.shift())
        } else {
          mergedVariants.push({
            ...exomeVariantsAtThisPosition.shift(),
            genome: genomeVariantsAtThisPosition.shift().genome,
          })
        }
      }
    }
  }
  */
  return mergedVariants
}

export default mergePcgcAndGnomadVariantSummaries
