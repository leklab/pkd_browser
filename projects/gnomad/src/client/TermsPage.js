import React from 'react'

import { ExternalLink, PageHeading } from '@broad/ui'

import DocumentTitle from './DocumentTitle'
import InfoPage from './InfoPage'
import Link from './Link'

export default () => (
  <InfoPage>
    <DocumentTitle title="Terms and Data Information" />
    <PageHeading>Terms and Data Information</PageHeading>

    <h2>Terms of use</h2>
    <p>
	The PKD Genome Browser is funded by the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK). <br /><br />
	Publications that use the PKD Genome Browser should cite (www.pkdgenes.org) Grants: U24DK126110 and U54 DK126114.  
	There is no need to include us as authors on your manuscript, unless we contributed specific advice or analysis for your work.
  	</p>
  </InfoPage>
)
