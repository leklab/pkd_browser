import React from 'react'
import styled from 'styled-components'

import { ExternalLink } from '@broad/ui'

import DocumentTitle from './DocumentTitle'
import InfoPage from './InfoPage'
import Link from './Link'
import Searchbox from './Searchbox'
import GnomadHeading from './GnomadHeading'

const HomePage = styled(InfoPage)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 740px;
  margin-top: 90px;
`

const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
`

const SubHeading = styled.h2`
  padding-top: 0;
  padding-bottom: 0;
  font-size: 1.2em;
  font-weight: lighter;
  letter-spacing: 2px;
  text-align: center;
`

export default () => (
  <HomePage>
    <DocumentTitle />
    <HeadingContainer>
      {/* <GnomadHeading width="60%" /> */}
      <img src="/PKD_GenomeBrower_Logo.jpg" width="50%" height="50%"></img>
      <SubHeading>PKD Genome Browser</SubHeading>
      <Searchbox width="100%" />
      <p>
        Examples - Gene:{' '}
        <Link preserveSelectedDataset={false} to="/gene/PKD1">
          PKD1
        </Link>
        , Variant:{' '}
        <Link preserveSelectedDataset={false} to="/variant/16-2090943-G-A">
          16-2090943-G-A
        </Link>
      </p>
    </HeadingContainer>
    <p>
      The PKD Genome Browser serves as a repository of variants across the exomes and targeted panel sequencing of individuals with polycystic kidney disease (PKD).  
      Our goal is to aggregate and harmonize exome and genome sequencing data from sequencing projects of PKD and to make summary data available to the 
      wider scientific community.
    </p>

    <p>
      The PKD Genome Browser is <b>actively seeking additional cohorts</b> to include in the aggregation efforts. If you want to contribute targeted sequencing, exome or genome 
      data to the PKD Genome Browser, please contact the <ExternalLink href="mailto:info@pkd-rcc.org">PKD RRC.</ExternalLink>
    </p>

    <br /><br />
  </HomePage>
)
