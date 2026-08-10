/*!
 * Copyright © 2023 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { useSubmit } from '@remix-run/react'
import {
  Button,
  CardBody,
  Checkbox,
  Grid,
  Icon,
  Radio,
} from '@trussworks/react-uswds'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import DetailsDropdownContent from '~/components/DetailsDropdownContent'
import { eventTypes } from '~/routes/circulars/circulars.lib'

export function EventTypeSelector({
  form,
  defaultLogic = 'OR',
  defaultTypes = [],
  defaultExceptTypes = [],
}: {
  form?: string
  defaultLogic?: string
  defaultTypes?: string[]
  defaultExceptTypes?: string[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const submit = useSubmit()
  const [showContent, setShowContent] = useState(false)

  useOnClickOutside(ref, () => {
    setShowContent(false)
  })

  function handleTriggerSubmit(targetForm?: HTMLFormElement | null) {
    if (targetForm) submit(targetForm)
  }

  const formatLabel = (val: string) => val.toUpperCase()

  return (
    <div ref={ref}>
      <Button
        type="button"
        className="padding-y-1 padding-x-2"
        onClick={() => setShowContent((shown) => !shown)}
      >
        <Icon.FilterList role="presentation" />
        Event Types
        {showContent ? (
          <Icon.ExpandLess role="presentation" />
        ) : (
          <Icon.ExpandMore role="presentation" />
        )}
      </Button>

      <DetailsDropdownContent
        className={classNames('maxw-card-xlg', {
          'display-none': !showContent,
        })}
      >
        <CardBody>
          <div className="margin-bottom-2">
            <label className="usa-label text-bold margin-bottom-1">
              Match Logic
            </label>
            <Grid row gap={2}>
              <Grid col={6}>
                <Radio
                  id="logic-or"
                  name="eventLogic"
                  value="OR"
                  label="Any (OR)"
                  form={form}
                  defaultChecked={defaultLogic === 'OR'}
                  onChange={({ target }) => handleTriggerSubmit(target.form)}
                />
              </Grid>
              <Grid col={6}>
                <Radio
                  id="logic-and"
                  name="eventLogic"
                  value="AND"
                  label="All (AND)"
                  form={form}
                  defaultChecked={defaultLogic === 'AND'}
                  onChange={({ target }) => handleTriggerSubmit(target.form)}
                />
              </Grid>
            </Grid>
          </div>

          <Grid row gap={2}>
            <Grid col={6}>
              <label className="usa-label text-bold margin-bottom-1">
                Include
              </label>
              {eventTypes.map((type) => (
                <Checkbox
                  key={`include-${type}`}
                  id={`include-${type}`}
                  name="eventType"
                  value={type}
                  label={formatLabel(type)}
                  form={form}
                  defaultChecked={defaultTypes.includes(type)}
                  onChange={({ target }) => handleTriggerSubmit(target.form)}
                />
              ))}
            </Grid>

            <Grid col={6}>
              <label className="usa-label text-bold margin-bottom-1">
                Exclude (EXCEPT)
              </label>
              {eventTypes.map((type) => (
                <Checkbox
                  key={`exclude-${type}`}
                  id={`exclude-${type}`}
                  name="exceptEventType"
                  value={type}
                  label={formatLabel(type)}
                  form={form}
                  defaultChecked={defaultExceptTypes.includes(type)}
                  onChange={({ target }) => handleTriggerSubmit(target.form)}
                />
              ))}
            </Grid>
          </Grid>
        </CardBody>
      </DetailsDropdownContent>
    </div>
  )
}
