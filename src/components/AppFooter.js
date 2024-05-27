import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://isptec.co.ao" target="_blank" rel="noopener noreferrer">
          ISPTEC
        </a>
        <span className="ms-1">&copy; 2024 Rui & José & Cristóvão.</span>
      </div>

    </CFooter>
  )
}

export default React.memo(AppFooter)
