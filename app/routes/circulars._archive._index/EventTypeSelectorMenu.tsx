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
  CardFooter,
  Checkbox,
  Icon,
  Radio,
} from '@trussworks/react-uswds'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import DetailsDropdownContent from '~/components/DetailsDropdownContent'
import {
  type EventType,
  eventTypes,
  eventTypesHumanReadable,
  formatEventTypeSlug,
} from '~/routes/circulars/circulars.lib'

type EventTypeSelectorMenuProps = {
  form?: string
  defaultEventTypes?: string[]
  defaultEventTypesLogic?: 'AND' | 'OR'
  defaultEventTypesExclude?: string[]
}

type EventTypeState = 'neutral' | 'include' | 'exclude'

function EventTypeSelectorButton({
  selectedCount,
  expanded,
  ...props
}: {
  selectedCount: number
  expanded?: boolean
} & Omit<Parameters<typeof Button>[0], 'children' | 'type'>) {
  return (
    <Button
      type="button"
      className={classNames(props.className, 'minw-15 padding-y-1 padding-x-2')}
      style={{ minWidth: '15rem', whiteSpace: 'nowrap' }}
      aria-label={
        selectedCount
          ? `Filter by event type (${selectedCount} selected)`
          : 'Filter by event type'
      }
      {...props}
    >
      <Icon.FilterList role="presentation" />
      Filter by event type
      {expanded ? (
        <Icon.ExpandLess role="presentation" />
      ) : (
        <Icon.ExpandMore role="presentation" />
      )}
    </Button>
  )
}

function TriStateCheckbox({
  eventType,
  state,
  form,
  onChange,
}: {
  eventType: EventType
  state: EventTypeState
  form?: string
  onChange: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = state === 'exclude'
  }, [state])

  return (
    <>
      <Checkbox
        id={`event-type-${formatEventTypeSlug(eventType)}`}
        name="eventTypes"
        value={eventType}
        label={eventTypesHumanReadable[eventType].singular}
        form={form}
        checked={state === 'include'}
        aria-checked={state === 'exclude' ? 'mixed' : state === 'include'}
        inputRef={inputRef}
        onChange={onChange}
        onClick={(event) => {
          event.preventDefault()
          onChange()
        }}
      />
      {state === 'exclude' && (
        <input
          type="hidden"
          name="eventTypesExclude"
          value={eventType}
          form={form}
        />
      )}
    </>
  )
}

export function EventTypeSelectorMenu({
  form,
  defaultEventTypes = [],
  defaultEventTypesLogic = 'OR',
  defaultEventTypesExclude = [],
}: EventTypeSelectorMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [eventTypeStates, setEventTypeStates] = useState<
    Record<EventType, EventTypeState>
  >(
    () =>
      Object.fromEntries(
        eventTypes.map((eventType) => [
          eventType,
          defaultEventTypesExclude.includes(eventType)
            ? 'exclude'
            : defaultEventTypes.includes(eventType)
              ? 'include'
              : 'neutral',
        ])
      ) as Record<EventType, EventTypeState>
  )
  const [logic, setLogic] = useState(defaultEventTypesLogic)
  const submit = useSubmit()

  useOnClickOutside(ref, () => {
    setShowContent(false)
  })

  function submitForm() {
    const formElement =
      ref.current?.querySelector<HTMLInputElement>('input')?.form
    if (formElement) submit(formElement)
    setShowContent(false)
  }

  function toggleEventType(eventType: EventType) {
    setEventTypeStates((current) => ({
      ...current,
      [eventType]:
        current[eventType] === 'neutral'
          ? 'include'
          : current[eventType] === 'include'
            ? 'exclude'
            : 'neutral',
    }))
  }

  const selectedCount = Object.values(eventTypeStates).filter(
    (state) => state !== 'neutral'
  ).length

  return (
    <div ref={ref}>
      <EventTypeSelectorButton
        selectedCount={selectedCount}
        expanded={showContent}
        onClick={() => setShowContent((shown) => !shown)}
      />
      <DetailsDropdownContent
        className={classNames('maxw-card-lg', {
          'display-none': !showContent,
        })}
      >
        <CardBody>
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Event type matching</legend>
            <Radio
              id="event-types-or"
              name="eventTypesLogic"
              value="OR"
              label="Match any selected event type"
              form={form}
              checked={logic === 'OR'}
              onChange={() => setLogic('OR')}
            />
            <Radio
              id="event-types-and"
              name="eventTypesLogic"
              value="AND"
              label="Match all selected event types"
              form={form}
              checked={logic === 'AND'}
              onChange={() => setLogic('AND')}
            />
          </fieldset>

          <fieldset
            className="usa-fieldset margin-top-2"
            style={{ maxHeight: '15rem', overflowY: 'auto' }}
          >
            <legend className="usa-legend">Event types</legend>
            {eventTypes.map((eventType) => (
              <TriStateCheckbox
                key={eventType}
                eventType={eventType}
                state={eventTypeStates[eventType]}
                form={form}
                onChange={() => toggleEventType(eventType)}
              />
            ))}
          </fieldset>
        </CardBody>
        <CardFooter>
          <Button
            type="button"
            className="usa-button--outline"
            onClick={() => {
              setEventTypeStates(
                Object.fromEntries(
                  eventTypes.map((eventType) => [eventType, 'neutral'])
                ) as Record<EventType, EventTypeState>
              )
              setLogic('OR')
            }}
          >
            Clear
          </Button>
          <Button type="button" onClick={submitForm}>
            Apply
          </Button>
        </CardFooter>
      </DetailsDropdownContent>
    </div>
  )
}
