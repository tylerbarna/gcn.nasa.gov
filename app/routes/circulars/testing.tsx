/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */
import type { DataFunctionArgs } from '@remix-run/node'
import { Form, useSubmit } from '@remix-run/react'
import {
  Button,
  ButtonGroup,
  DateRangePicker,
  Dropdown,
  Label,
} from '@trussworks/react-uswds'
import classNames from 'classnames'
import { useState } from 'react'
import React from 'react'

import { circularRedirect, put, search } from './circulars.server'
import DetailsDropdownButton from '~/components/DetailsDropdownButton'
import DetailsDropdownContent from '~/components/DetailsDropdownContent'
import Hint from '~/components/Hint'
import { Popup, hideableElement } from '~/components/Popup'

import searchImg from 'app/theme/img/usa-icons-bg/search--white.svg'

export default function () {
  const [expandedState] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [showDateRange, setShowDateRange] = useState(false)
  let displayText = 'Date Range'
  const submit = useSubmit()
  return (
    <>
      <div> you are in testing.tsx </div>

      <DetailsDropdownButton
        onClick={() => setShowContent(!showContent)}
        outline
      >
        {displayText}
      </DetailsDropdownButton>
      {showContent && (
        <DetailsDropdownContent>
          {!showDateRange && (
            <>
              <Button
                type="button"
                className="usa-button usa-button--unstyled"
                onClick={() => {
                  displayText = 'button1'
                }}
              >
                button1
              </Button>
              <Button type="button" className="usa-button usa-button--unstyled">
                button2
              </Button>
            </>
          )}
          {!showDateRange && (
            <Button
              type="button"
              className="usa-button"
              onClick={() => setShowDateRange(!showDateRange)}
            >
              expand date range
            </Button>
          )}
          {showDateRange && (
            <>
              <Button
                type="button"
                className="usa-button"
                onClick={() => setShowDateRange(!showDateRange)}
              >
                hide
              </Button>
              <DateRangePicker
                startDateHint="dd/mm/yyyy"
                startDateLabel="Start Date"
                startDatePickerProps={{
                  id: 'event-date-start',
                  name: 'event-date-start',
                  defaultValue: 'startDate',
                  // onChange: (value) => {
                  //   if (value) {
                  //     let params = new URLSearchParams(location.search)
                  //     params.set('startDate', value)
                  //     submit(params, {
                  //       method: 'get',
                  //       action: '/circulars',
                  //     })
                  //   }
                  // },
                }}
                endDateHint="dd/mm/yyyy"
                endDateLabel="End Date"
                endDatePickerProps={{
                  id: 'event-date-end',
                  name: 'event-date-end',
                  defaultValue: 'endDate',
                  // onChange: (value) => {
                  //   if (value) {
                  //     let params = new URLSearchParams(location.search)
                  //     params.set('endDate', value)
                  //     submit(params, {
                  //       method: 'get',
                  //       action: '/circulars',
                  //     })
                  //   }
                  // },
                }}
              />
              <Button
                type="button"
                className="usa-button margin-top-2"
                onClick={() => submit('test')}
              >
                submit dates
              </Button>
            </>
          )}
        </DetailsDropdownContent>
      )}
    </>
  )
}
