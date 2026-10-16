/*!
 * Copyright © 2023 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { useSearchParams, useSubmit } from '@remix-run/react'
import { Button, Icon } from '@trussworks/react-uswds'

import {
  type EventType,
  eventTypesHumanReadable,
} from '~/routes/circulars/circulars.lib'

export function ActiveFilterChips({
  eventTypes = [],
  eventTypesExclude = [],
}: {
  eventTypes?: string[]
  eventTypesExclude?: string[]
}) {
  const [searchParams] = useSearchParams()
  const submit = useSubmit()

  if (eventTypes.length === 0 && eventTypesExclude.length === 0) {
    return null
  }

  function removeFilter(typeToRemove: string, isExclude = false) {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('index')

    if (isExclude) {
      const remaining = newParams
        .getAll('eventTypesExclude')
        .filter((t) => t !== typeToRemove)
      newParams.delete('eventTypesExclude')
      remaining.forEach((t) => newParams.append('eventTypesExclude', t))
    } else {
      const remaining = newParams
        .getAll('eventTypes')
        .filter((t) => t !== typeToRemove)
      newParams.delete('eventTypes')
      remaining.forEach((t) => newParams.append('eventTypes', t))
    }

    submit(newParams, { preventScrollReset: true })
  }

  function clearAllFilters() {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('index')
    newParams.delete('eventTypes')
    newParams.delete('eventTypesExclude')
    newParams.delete('eventTypesLogic')
    submit(newParams, { preventScrollReset: true })
  }

  return (
    <div
      className="display-flex flex-align-center flex-wrap margin-y-1 padding-y-05 padding-x-1 radius-md bg-base-lightest border-1px border-base-lighter font-sans-2xs"
      role="region"
      aria-label="Active filters"
    >
      <span className="text-bold text-base-dark margin-right-1 display-flex flex-align-center">
        <Icon.FilterList role="presentation" size={3} className="margin-right-05" />
        Active Filters:
      </span>

      <div className="display-flex flex-align-center flex-wrap gap-05">
        {eventTypes.map((type) => {
          const humanReadable =
            eventTypesHumanReadable[type as EventType]?.singular ?? type
          return (
            <span
              key={`chip-inc-${type}`}
              className="usa-tag font-sans-3xs bg-primary-lighter text-primary-darker padding-y-2px padding-left-1 padding-right-05 radius-pill display-inline-flex flex-align-center"
              style={{ border: '1px solid #73b3e7' }}
            >
              <span>{humanReadable}</span>
              <button
                type="button"
                onClick={() => removeFilter(type, false)}
                className="usa-button usa-button--unstyled margin-left-05 text-primary-darker hover:text-black display-flex flex-align-center"
                aria-label={`Remove ${humanReadable} filter`}
              >
                <Icon.Close role="presentation" size={3} />
              </button>
            </span>
          )
        })}

        {eventTypesExclude.map((type) => {
          const humanReadable =
            eventTypesHumanReadable[type as EventType]?.singular ?? type
          return (
            <span
              key={`chip-exc-${type}`}
              className="usa-tag font-sans-3xs bg-secondary-lighter text-secondary-darker padding-y-2px padding-left-1 padding-right-05 radius-pill display-inline-flex flex-align-center"
              style={{ border: '1px solid #f2938c' }}
            >
              <span>NOT {humanReadable}</span>
              <button
                type="button"
                onClick={() => removeFilter(type, true)}
                className="usa-button usa-button--unstyled margin-left-05 text-secondary-darker hover:text-black display-flex flex-align-center"
                aria-label={`Remove exclude ${humanReadable} filter`}
              >
                <Icon.Close role="presentation" size={3} />
              </button>
            </span>
          )
        })}

        <Button
          type="button"
          unstyled
          onClick={clearAllFilters}
          className="margin-left-1 text-primary hover:text-primary-dark font-sans-3xs text-bold"
        >
          Clear all
        </Button>
      </div>
    </div>
  )
}
