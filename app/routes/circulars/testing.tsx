/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */
import type { DataFunctionArgs } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from '@remix-run/react'
import {
  Button,
  ButtonGroup,
  Icon,
  Label,
  Menu,
  Select,
  TextInput,
} from '@trussworks/react-uswds'
import classNames from 'classnames'
import { useState } from 'react'

import { circularRedirect, put, search } from './circulars.server'
import Hint from '~/components/Hint'
import { Popup, hideableElement } from '~/components/Popup'
import { usePagination } from '~/lib/pagination'
import { getFormDataString } from '~/lib/utils'

import searchImg from 'app/theme/img/usa-icons-bg/search--white.svg'

function toggleVisibility(target: string) {
  const element = document.getElementById(target)
  if (element) {
    element.style.visibility =
      element.style.visibility === 'hidden' ? 'visible' : 'hidden'
  }
}

export default function () {
  var expanded = 'none'
  const [expandedState] = useState(true)
  const onChangeCaptureHandler = (e: any) => {
    console.log('value changed to', e.target.value)
    const searchParams = new URLSearchParams()
    searchParams.set('query', e.target.value)
    if (e.target.value === 'dateRange') {
      console.log('set a custom dateRange')
    } else {
      console.log('setting a fuzzy date Range')
      //expanded = !expanded
      //expanded = 'block'
      toggleVisibility('expandingMenu')
    }
  }
  return (
    <>
      <div> you are in testing.tsx </div>
      {/* <Button
        type="button"
        className="height-4 padding-top-0 padding-bottom-0"
        onClick={() => {
          expanded = !expanded
          console.log('clicked')
          console.log(expanded)
        }}
        children={undefined}
      ></Button> */}
      <select
        className="usa-button"
        name="options"
        id="options"
        defaultValue={undefined}
        onChangeCapture={onChangeCaptureHandler}
      >
        {/* <img
            className="usa-button__icon usa-button__icon--size-2"
            src={searchImg}
            alt="Search"
          /> */}
        <option value=""></option>
        <option value="lastHour">Last Hour</option>
        <option value="lastDay">Last Day</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
        <option value="ytd">Year To Date</option>
        <option
          value="dateRange"
          onSelect={
            (e) => console.log('clicked')
            // console.log(clickState)
          }
        >
          Custom Range
        </option>
      </select>
      <p className="usa-menu" id="expandingMenu">
        t
      </p>
    </>
  )
}
