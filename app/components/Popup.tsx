/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */
import {
  Grid,
  GridContainer,
} from '@trussworks/react-uswds'
import { useState } from 'react'




export function Popup(elements: Object) {
  // var elementRows = new(elements, function(element) {
  //   return <Grid tablet={{ col: true }}>element</Grid>
  // })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [expanded, setExpanded] = useState(false)
  // const [isOpen, setIsOpen] = useState(false)
  // const onClick = () => setExpanded((prvExpanded) => !prvExpanded)

  return (
    <>
    {/* grid that is hidden but appears when expanded */}
    
  <GridContainer
  >
    <Grid 
    hidden={!expanded}
    row>
    
      <Grid tablet={{ col: true }}>test content</Grid>
      <Grid tablet={{ col: true }}>test content</Grid>
      <Grid tablet={{ col: true }}>test content</Grid>
    </Grid>
  </GridContainer>
    </>
  )
}