import React from 'react'

import { ExternalLink, PageHeading } from '@broad/ui'
import styled from 'styled-components'

import DocumentTitle from './DocumentTitle'
import InfoPage from './InfoPage'


const TableStyled = styled.table`
  border: 1px solid black;
  border-collapse: collapse;
`

const TableHeader = styled.th`
  border: 1px solid black;
  border-collapse: collapse;
`

const TableData = styled.td`
  border: 1px solid black;
  border-collapse: collapse;
`


export default () => (
  <InfoPage>
    <DocumentTitle title="Contact" />
    <PageHeading>Contact</PageHeading>

    <p>
    <h2>General</h2>
    	All general queries should be sent to the <ExternalLink href="mailto:info@pkd-rcc.org">PKD RRC group email.</ExternalLink>
 	</p>
    <p>
    <h2>Website</h2>
    Report data problems or feature suggestions by <ExternalLink href="mailto:info@pkd-rcc.org">email</ExternalLink>. <br />
    Report errors in the website on <ExternalLink href="https://github.com/leklab/pkd_browser/issues">GitHub</ExternalLink> or by <ExternalLink href="mailto:info@pkd-rcc.org">email</ExternalLink>.
    </p>


  </InfoPage>
)
