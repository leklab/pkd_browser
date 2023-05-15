import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Badge, List, ListItem, ExternalLink } from '@broad/ui'


const Marker = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 0.5em;
  &::before {
    content: '';
    display: inline-block;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    border: 1px solid #000;
    border-radius: 5px;
    background: ${props => props.color};
  }
`

const markerColor = (value) => {

    //console.log("In markerColor")

    let color = null

    //console.log(parsedValue)

    if (value.localeCompare('Pathogenic') == 0 || value.localeCompare('Likely Pathogenic') == 0) {
      color = '#FF583F'
    } else if (value.localeCompare('VUS') == 0) {
      color = 'grey'
    } else {
      color = 'green'
    }

    //console.log(color)

    return color

}


const VariantInMayoDB = ({ variant }) => {
  //console.log("In VariantInMayoDB")
  //console.log(variant.mayo_variant_details)
  const mayo_pkd_url = `https://pkdb.mayo.edu/welcome`
  const mayo_pkd_variant_api = `https://adpkd-api.mayo.edu/api/Variants/3/${variant.mayo_variant_details.MayoVariantID}`

  return (
    <div>
      <p>
        Variant data retrieved from the <ExternalLink href={mayo_pkd_url}>Mayo Database</ExternalLink>
      </p>

      <List>
            <ListItem key={'variant_id'}>
              <ExternalLink href={mayo_pkd_variant_api}>Variant ID: {variant.mayo_variant_details.MayoVariantID} </ExternalLink>
            </ListItem>
            <ListItem key={'variant_type'}>
              <b>Variant Type:</b> {variant.mayo_variant_details.VariantTypeName}
            </ListItem>
            <ListItem key={'clinical_significance'}>
              {<Marker color={markerColor(variant.mayo_variant_details.ClinicalSignificanceShortName)} />}
              <b>Clinical Significance:</b> {variant.mayo_variant_details.ClinicalSignificanceShortName}
            </ListItem>
      </List>

    </div>
  )
}


export default VariantInMayoDB
