import PropTypes from 'prop-types'
import { useEffect } from 'react'

const DocumentTitle = ({ title }) => {
  useEffect(
    () => {
      const fullTitle = title ? `${title} | PKD` : 'PKD'
      document.title = fullTitle
    },
    [title]
  )
  return null
}

DocumentTitle.propTypes = {
  title: PropTypes.string,
}

DocumentTitle.defaultProps = {
  title: null,
}

export default DocumentTitle
