const mergeExomeAndsscVariantsummaries = (sparkVariants, sscVariants) => {
  const mergedVariants = []

  
  while (sparkVariants.length || sscVariants.length) {
    const currentSparkVariant = sparkVariants[0]
    const currentSscVariant = sscVariants[0]

    if (currentSscVariant === undefined) {
      mergedVariants.push(sparkVariants.shift())
    } else if (currentSparkVariant === undefined) {
      mergedVariants.push(sscVariants.shift())
    } else if (currentSparkVariant.pos < currentSscVariant.pos) {
      mergedVariants.push(sparkVariants.shift())
    } else if (currentSscVariant.pos < currentSparkVariant.pos) {
      mergedVariants.push(sscVariants.shift())
    } else {
      const currentPosition = currentSparkVariant.pos

      const sparkVariantsAtThisPosition = []
      while (sparkVariants.length && sparkVariants[0].pos === currentPosition) {
        sparkVariantsAtThisPosition.push(sparkVariants.shift())
      }
      const sscVariantsAtThisPosition = []
      while (sscVariants.length && sscVariants[0].pos === currentPosition) {
        sscVariantsAtThisPosition.push(sscVariants.shift())
      }

      sparkVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))
      sscVariantsAtThisPosition.sort((v1, v2) => v1.variantId.localeCompare(v2.variantId))

      while (sparkVariantsAtThisPosition.length || sscVariantsAtThisPosition.length) {
        const currentSparkVariantAtThisPosition = sparkVariantsAtThisPosition[0]
        const currentSscVariantAtThisPosition = sscVariantsAtThisPosition[0]

        if (currentSscVariantAtThisPosition === undefined) {
          mergedVariants.push(sparkVariantsAtThisPosition.shift())
        } else if (currentSparkVariantAtThisPosition === undefined) {
          mergedVariants.push(sscVariantsAtThisPosition.shift())
        } else if (
          currentSparkVariantAtThisPosition.variantId.localeCompare(
            currentSscVariantAtThisPosition.variantId
          ) < 0
        ) {
          mergedVariants.push(sparkVariantsAtThisPosition.shift())
        } else if (
          currentSparkVariantAtThisPosition.variantId.localeCompare(
            currentSscVariantAtThisPosition.variantId
          ) > 0
        ) {
          mergedVariants.push(sscVariantsAtThisPosition.shift())
        } else {
          mergedVariants.push({
            ...sparkVariantsAtThisPosition.shift(),
            //genome: sscVariantsAtThisPosition.shift().genome,
            ssc_genome: sscVariantsAtThisPosition.shift().ssc_genome,

          })
        }
      }
    }
  }
  
  return mergedVariants
}

export default mergeExomeAndsscVariantsummaries
