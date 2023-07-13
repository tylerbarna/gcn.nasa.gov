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

export default function () {
  var expanded = true
  const [expandedState] = useState(true)
  return (
    <>
      <div> you are in testing.tsx </div>

      <Button
        type="button"
        className="height-4 padding-top-0 padding-bottom-0"
        onClick={() => {
          expanded = !expanded
          console.log('clicked')
          console.log(expanded)
        }}
        children={undefined}
      ></Button>

      {expanded && (
        <p className="usa-button">
          <select className="usa-button" name="options" id="options">
            <option value="">- Select -</option>
            <option value="value1">Option A</option>
            <option value="value2">Option B</option>
            <option value="value3">Option C</option>
            <option value="dateRange">
              <></>
            </option>
          </select>
        </p>
      )}

      {expanded && <p className="usa-menu">t</p>}
    </>
  )
}
