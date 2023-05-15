//import fetch from 'graphql-fetch'

import 'whatwg-fetch'

export const fetchGnomadGenePage = geneName => {
  const argument = geneName.startsWith('ENSG')
    ? `gene_id: "${geneName}"`
    : `gene_name: "${geneName}"`

    /*
    const query = `{
    gene(${argument}) {
      gene_id
      gene_name
      omim_accession
      full_gene_name
      start
      stop
      xstart
      xstop
      chrom
      strand
      composite_transcript {
        exons {
          feature_type
          start
          stop
        }
      }
      canonical_transcript
      transcript {
        exons {
          feature_type
          start
          stop
          strand
        }
      }
      transcripts {
        start
        transcript_id
        strand
        stop
        xstart
        chrom
        gene_id
        xstop
        exons {
          start
          transcript_id
          feature_type
          strand
          stop
          chrom
          gene_id
        }
      }
    }
  }`
  */

    // Gnomad API
    
    const query = `{
    gene(${argument}) {
      gene_id
      gene_name
      omim_accession
      full_gene_name
      start
      stop
      xstart
      xstop
      chrom
      strand
      composite_transcript {
        exons {
          feature_type
          start
          stop
        }
      }
      canonical_transcript
      transcript {
        exons {
          feature_type
          start
          stop
          strand
        }
      }
      transcripts {
        start
        transcript_id
        strand
        stop
        xstart
        chrom
        gene_id
        xstop
        exons {
          start
          transcript_id
          feature_type
          strand
          stop
          chrom
          gene_id
        }
        gtex_tissue_tpms_by_transcript {
          adiposeSubcutaneous
          adiposeVisceralOmentum
          adrenalGland
          arteryAorta
          arteryCoronary
          arteryTibial
          bladder
          brainAmygdala
          brainAnteriorcingulatecortexBa24
          brainCaudateBasalganglia
          brainCerebellarhemisphere
          brainCerebellum
          brainCortex
          brainFrontalcortexBa9
          brainHippocampus
          brainHypothalamus
          brainNucleusaccumbensBasalganglia
          brainPutamenBasalganglia
          brainSpinalcordCervicalc1
          brainSubstantianigra
          breastMammarytissue
          cellsEbvTransformedlymphocytes
          cellsTransformedfibroblasts
          cervixEctocervix
          cervixEndocervix
          colonSigmoid
          colonTransverse
          esophagusGastroesophagealjunction
          esophagusMucosa
          esophagusMuscularis
          fallopianTube
          heartAtrialappendage
          heartLeftventricle
          kidneyCortex
          liver
          lung
          minorSalivaryGland
          muscleSkeletal
          nerveTibial
          ovary
          pancreas
          pituitary
          prostate
          skinNotsunexposedSuprapubic
          skinSunexposedLowerleg
          smallIntestineTerminalileum
          spleen
          stomach
          testis
          thyroid
          uterus
          vagina
          wholeBlood
        }
      }
    }
  }`




  console.log(query)
  //return fetch(process.env.GNOMAD_API_URL)(query)
  
  //const variables = {geneName: geneName}
  

  console.log("Running new fetch!")
  //console.log(variables)
  return fetch('/api/', {
        body: JSON.stringify({
          query
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }}).then(response => response.json())



}

    /*const query = `{
    gene(${argument}) {
      gene_id
      gene_name
      omim_accession
      full_gene_name
      start
      stop
      xstart
      xstop
      chrom
      strand
      composite_transcript {
        exons {
          feature_type
          start
          stop
        }
      }
      canonical_transcript
      transcript {
        exons {
          feature_type
          start
          stop
          strand
        }
      }
      exacv1_constraint {
        mu_syn
        exp_syn
        cnv_z
        pLI
        syn_z
        n_lof
        n_mis
        n_syn
        lof_z
        tx_start
        mu_mis
        transcript
        n_cnv
        exp_lof
        mis_z
        exp_cnv
        tx_end
        n_exons
        mu_lof
        bp
        exp_mis
      }
      exac_regional_missense_constraint_regions {
        start
        stop
        obs_mis
        exp_mis
        obs_exp
        chisq_diff_null
      }
      pext {
        start
        stop
        mean
        tissues {
          adipose_subcutaneous
          adipose_visceral_omentum
          adrenal_gland
          artery_aorta
          artery_coronary
          artery_tibial
          bladder
          brain_amygdala
          brain_anterior_cingulate_cortex_ba24
          brain_caudate_basal_ganglia
          brain_cerebellar_hemisphere
          brain_cerebellum
          brain_cortex
          brain_frontal_cortex_ba9
          brain_hippocampus
          brain_hypothalamus
          brain_nucleus_accumbens_basal_ganglia
          brain_putamen_basal_ganglia
          brain_spinal_cord_cervical_c_1
          brain_substantia_nigra
          breast_mammary_tissue
          cells_ebv_transformed_lymphocytes
          cells_transformed_fibroblasts
          cervix_ectocervix
          cervix_endocervix
          colon_sigmoid
          colon_transverse
          esophagus_gastroesophageal_junction
          esophagus_mucosa
          esophagus_muscularis
          fallopian_tube
          heart_atrial_appendage
          heart_left_ventricle
          kidney_cortex
          liver
          lung
          minor_salivary_gland
          muscle_skeletal
          nerve_tibial
          ovary
          pancreas
          pituitary
          prostate
          skin_not_sun_exposed_suprapubic
          skin_sun_exposed_lower_leg
          small_intestine_terminal_ileum
          spleen
          stomach
          testis
          thyroid
          uterus
          vagina
          whole_blood
        }
      }
      transcript {
        exons {
          feature_type
          start
          stop
          strand
        }
      }
      transcripts {
        start
        transcript_id
        strand
        stop
        xstart
        chrom
        gene_id
        xstop
        exons {
          start
          transcript_id
          feature_type
          strand
          stop
          chrom
          gene_id
        }
        gtex_tissue_tpms_by_transcript {
          adiposeSubcutaneous
          adiposeVisceralOmentum
          adrenalGland
          arteryAorta
          arteryCoronary
          arteryTibial
          bladder
          brainAmygdala
          brainAnteriorcingulatecortexBa24
          brainCaudateBasalganglia
          brainCerebellarhemisphere
          brainCerebellum
          brainCortex
          brainFrontalcortexBa9
          brainHippocampus
          brainHypothalamus
          brainNucleusaccumbensBasalganglia
          brainPutamenBasalganglia
          brainSpinalcordCervicalc1
          brainSubstantianigra
          breastMammarytissue
          cellsEbvTransformedlymphocytes
          cellsTransformedfibroblasts
          cervixEctocervix
          cervixEndocervix
          colonSigmoid
          colonTransverse
          esophagusGastroesophagealjunction
          esophagusMucosa
          esophagusMuscularis
          fallopianTube
          heartAtrialappendage
          heartLeftventricle
          kidneyCortex
          liver
          lung
          minorSalivaryGland
          muscleSkeletal
          nerveTibial
          ovary
          pancreas
          pituitary
          prostate
          skinNotsunexposedSuprapubic
          skinSunexposedLowerleg
          smallIntestineTerminalileum
          spleen
          stomach
          testis
          thyroid
          uterus
          vagina
          wholeBlood
        }
      }
    }
}
`*/
