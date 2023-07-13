/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */
import {
  Accordion,
  Button,
  Card,
  Grid,
  GridContainer,
  Select,
} from '@trussworks/react-uswds'
import { useState } from 'react'

import { NavDropDownButton } from '~/components/Header'

// create an expanding acordion where other react components can be passed in as rows within the grid

function toggleHidden(hidden: boolean) {
  return !hidden
}

function toggleElement(hidden: boolean, element: any) {
  const newState = toggleHidden(hidden)
  return <Grid hidden={newState}>{element}</Grid>
}

function hidableCard() {
  return (
    <p className="usa-button">
      <select className="usa-select" name="options" id="options">
        <option value="">- Select -</option>
        <option value="value1">Option A</option>
        <option value="value2">Option B</option>
        <option value="value3">Option C</option>
      </select>
    </p>
  )
}

function hidableCardWithToggleElement() {
  const [hidden, setHidden] = useState(true)
  return (
    <Card>
      <Button
        type="button"
        className="usa-button"
        onClick={() => setHidden(toggleHidden(hidden))}
      >
        Toggle
      </Button>
      <Grid hidden={hidden}>
        <Grid tablet={{ col: true }}>test content</Grid>
        <Grid tablet={{ col: true }}>test content</Grid>
        <Grid tablet={{ col: true }}>test content</Grid>
      </Grid>
    </Card>
  )
}

export function hideableElement(hidden: boolean, element: any) {
  return <>{hidden && element}</>
}

export function Popup() {
  const items = ['test1', 'test2', 'test3']
  const [expanded, setExpanded] = useState(false)
  const onClick = () => setExpanded((prvExpanded) => !prvExpanded)

  return (
    <>
      {hidableCard()}
      {/* {hidableCardWithToggleElement()} */}
      {/* grid that is hidden but appears when expanded */}

      {/* <GridContainer
  >
    <Grid 
    hidden={!expanded}
    row>
    
      <Grid tablet={{ col: true }}>test content</Grid>
      <Grid tablet={{ col: true }}>test content</Grid>
      <Grid tablet={{ col: true }}>test content</Grid>
    </Grid>
  </GridContainer> */}
      {/* <div className="usa-accordion"> */}
      {/* <h4 className="usa-accordion__heading">
        <button
          type="button"
          className="usa-accordion__button"
          aria-expanded="true"
          aria-controls="a1"
        >
          First Amendment
        </button>
      </h4>
      <div id="a1" className="usa-accordion__content usa-prose">
        <p>
          Congress shall make no law respecting an establishment of religion, or
          prohibiting the free exercise thereof; or abridging the freedom of
          speech, or of the press; or the right of the people peaceably to
          assemble, and to petition the Government for a redress of grievances.
        </p>
      </div> */}
    </>
  )
}
