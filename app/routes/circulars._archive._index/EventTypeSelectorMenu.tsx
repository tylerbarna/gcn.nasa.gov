/*!
 * Copyright © 2023 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Link, useSubmit } from '@remix-run/react'
import {
  Button,
  ButtonGroup,
  CardBody,
  CardFooter,
  Checkbox,
  Icon,
  Tag,
  TextInput,
} from '@trussworks/react-uswds'
import classNames from 'classnames'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'

import DetailsDropdownContent from '~/components/DetailsDropdownContent'
import {
  type EventType,
  eventTypes,
  eventTypesHumanReadable,
  formatEventTypeSlug,
} from '~/routes/circulars/circulars.lib'

/**
 * Feature flag for the in-menu search filter box.
 * Set to false (or pass `enableSearchFilter={false}`) to easily disable or remove.
 */
export const ENABLE_SEARCH_FILTER = true

export type EventTypeState = 'neutral' | 'include' | 'exclude'

export type EventTypeSelectorMenuProps = {
  form?: string
  defaultEventTypes?: string[]
  defaultEventTypesLogic?: 'AND' | 'OR'
  defaultEventTypesExclude?: string[]
  enableSearchFilter?: boolean
}

function EventTypeSelectorButton({
  includeCount,
  excludeCount,
  expanded,
  className,
  ...props
}: {
  includeCount: number
  excludeCount: number
  expanded?: boolean
} & Omit<Parameters<typeof Button>[0], 'children' | 'type'>) {
  const hasFilters = includeCount > 0 || excludeCount > 0
  let badgeText = ''
  if (includeCount > 0 && excludeCount > 0) {
    badgeText = `+${includeCount}, −${excludeCount}`
  } else if (includeCount > 0) {
    badgeText = `${includeCount}`
  } else if (excludeCount > 0) {
    badgeText = `−${excludeCount}`
  }

  return (
    <Button
      type="button"
      className={classNames(className, 'padding-y-1 padding-x-2')}
      aria-label={
        hasFilters
          ? `Filter by event type (${badgeText} active)`
          : 'Filter by event type'
      }
      {...props}
    >
      <Icon.FilterList role="presentation" />
      {hasFilters ? 'Event types' : 'Filter by event type'}
      {hasFilters && (
        <span
          className="usa-tag margin-left-1 font-sans-2xs padding-x-05 padding-y-2px text-bold"
          style={{
            borderRadius: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            color: 'inherit',
          }}
        >
          {badgeText}
        </span>
      )}
      {expanded ? (
        <Icon.ExpandLess role="presentation" />
      ) : (
        <Icon.ExpandMore role="presentation" />
      )}
    </Button>
  )
}

function TriStateRow({
  eventType,
  state,
  onCycle,
}: {
  eventType: EventType
  state: EventTypeState
  onCycle: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const slug = formatEventTypeSlug(eventType)
  const humanReadable = eventTypesHumanReadable[eventType]?.singular ?? eventType

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state === 'exclude'
    }
  }, [state])

  return (
    <div
      onClick={onCycle}
      className={classNames(
        'display-flex flex-align-center flex-justify flex-row padding-y-1 padding-x-1 radius-md cursor-pointer margin-bottom-05',
        {
          'bg-primary-lightest': state === 'include',
          'bg-secondary-lightest': state === 'exclude',
          'hover:bg-base-lightest': state === 'neutral',
        }
      )}
      style={{
        border:
          state === 'include'
            ? '1px solid #73b3e7'
            : state === 'exclude'
              ? '1px solid #f2938c'
              : '1px solid transparent',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onCycle()
        }
      }}
      aria-label={`${humanReadable}: ${state}`}
    >
      <div className="display-flex flex-align-center flex-fill">
        <Checkbox
          id={`event-type-check-${slug}`}
          name={`event-type-check-${slug}`}
          label=""
          className="margin-0"
          checked={state === 'include'}
          aria-checked={state === 'exclude' ? 'mixed' : state === 'include'}
          inputRef={inputRef}
          onChange={() => {
            // Managed by container click
          }}
          onClick={(e) => {
            e.stopPropagation()
            onCycle()
          }}
        />
        <div className="margin-left-1 display-flex flex-align-center flex-wrap">
          <span className="font-sans-xs text-bold text-ink">{humanReadable}</span>
          {eventType !== humanReadable && (
            <span className="usa-tag font-mono font-sans-3xs padding-x-05 padding-y-2px margin-left-05 bg-base-lighter text-base-dark">
              {eventType}
            </span>
          )}
        </div>
      </div>
      <div>
        {state === 'include' && (
          <Tag className="bg-success text-white font-sans-3xs padding-x-1 padding-y-2px">
            ✓ Include
          </Tag>
        )}
        {state === 'exclude' && (
          <Tag className="bg-error text-white font-sans-3xs padding-x-1 padding-y-2px">
            ✕ Exclude
          </Tag>
        )}
        {state === 'neutral' && (
          <span className="font-sans-3xs text-base-light padding-right-05">
            Off
          </span>
        )}
      </div>
    </div>
  )
}

export function EventTypeSelectorMenu({
  form,
  defaultEventTypes = [],
  defaultEventTypesLogic = 'OR',
  defaultEventTypesExclude = [],
  enableSearchFilter = ENABLE_SEARCH_FILTER,
}: EventTypeSelectorMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const searchInputId = useId()

  const initialStates = useMemo<Record<EventType, EventTypeState>>(() => {
    return Object.fromEntries(
      eventTypes.map((type) => [
        type,
        defaultEventTypesExclude.includes(type)
          ? 'exclude'
          : defaultEventTypes.includes(type)
            ? 'include'
            : 'neutral',
      ])
    ) as Record<EventType, EventTypeState>
  }, [defaultEventTypes, defaultEventTypesExclude])

  // Working / pending state inside the menu until applied:
  const [pendingStates, setPendingStates] =
    useState<Record<EventType, EventTypeState>>(initialStates)
  const [pendingLogic, setPendingLogic] = useState<'AND' | 'OR'>(
    defaultEventTypesLogic
  )

  // Committed state that drives hidden inputs in the form:
  const [committedStates, setCommittedStates] =
    useState<Record<EventType, EventTypeState>>(initialStates)
  const [committedLogic, setCommittedLogic] = useState<'AND' | 'OR'>(
    defaultEventTypesLogic
  )

  const submit = useSubmit()

  // Reset pending state to committed state whenever dropdown reopens
  function openDropdown() {
    setPendingStates(committedStates)
    setPendingLogic(committedLogic)
    setSearchFilter('')
    setShowContent(true)
  }

  function closeDropdown() {
    setShowContent(false)
    setSearchFilter('')
  }

  useOnClickOutside(ref, () => {
    closeDropdown()
  })

  function cycleEventType(eventType: EventType) {
    setPendingStates((curr) => {
      const currentState = curr[eventType]
      const nextState: EventTypeState =
        currentState === 'neutral'
          ? 'include'
          : currentState === 'include'
            ? 'exclude'
            : 'neutral'
      return {
        ...curr,
        [eventType]: nextState,
      }
    })
  }

  function handleSelectAll() {
    setPendingStates(
      Object.fromEntries(
        eventTypes.map((type) => [type, 'include'])
      ) as Record<EventType, EventTypeState>
    )
  }

  function handleResetAll() {
    setPendingStates(
      Object.fromEntries(
        eventTypes.map((type) => [type, 'neutral'])
      ) as Record<EventType, EventTypeState>
    )
    setPendingLogic('OR')
  }

  function handleApply() {
    setCommittedStates(pendingStates)
    setCommittedLogic(pendingLogic)
    closeDropdown()

    // Trigger form submit in the next tick after state updates have mounted to DOM
    setTimeout(() => {
      const formElement =
        ref.current?.querySelector<HTMLInputElement>('input[type="hidden"]')
          ?.form
      if (formElement) {
        submit(formElement)
      }
    }, 0)
  }

  const pendingIncludeCount = Object.values(pendingStates).filter(
    (s) => s === 'include'
  ).length
  const pendingExcludeCount = Object.values(pendingStates).filter(
    (s) => s === 'exclude'
  ).length

  const committedIncludeCount = Object.values(committedStates).filter(
    (s) => s === 'include'
  ).length
  const committedExcludeCount = Object.values(committedStates).filter(
    (s) => s === 'exclude'
  ).length

  // Filter items if search filter is active:
  const filteredEventTypes = useMemo(() => {
    if (!enableSearchFilter || !searchFilter.trim()) return eventTypes

    const query = searchFilter.toLowerCase().trim()
    return eventTypes.filter((type) => {
      const human = eventTypesHumanReadable[type]?.singular?.toLowerCase() || ''
      const acronym = type.toLowerCase()
      return human.includes(query) || acronym.includes(query)
    })
  }, [searchFilter, enableSearchFilter])

  return (
    <div ref={ref} className="position-relative display-inline-block">
      {/* Hidden inputs synced to committed state so they belong to the search form */}
      {Object.entries(committedStates).map(([type, state]) => {
        if (state === 'include') {
          return (
            <input
              key={`committed-inc-${type}`}
              type="hidden"
              name="eventTypes"
              value={type}
              form={form}
            />
          )
        }
        if (state === 'exclude') {
          return (
            <input
              key={`committed-exc-${type}`}
              type="hidden"
              name="eventTypesExclude"
              value={type}
              form={form}
            />
          )
        }
        return null
      })}
      {(committedIncludeCount > 1 || committedExcludeCount > 0) && (
        <input
          type="hidden"
          name="eventTypesLogic"
          value={committedLogic}
          form={form}
        />
      )}

      {/* Toolbar Trigger Button */}
      <EventTypeSelectorButton
        includeCount={committedIncludeCount}
        excludeCount={committedExcludeCount}
        expanded={showContent}
        onClick={() => {
          if (showContent) closeDropdown()
          else openDropdown()
        }}
      />

      {/* Popover Dropdown Card */}
      <DetailsDropdownContent
        className={classNames('width-card-lg', {
          'display-none': !showContent,
        })}
        style={{ width: '22rem', minWidth: '20rem' }}
      >
        <CardBody className="padding-2">
          {/* Header styled like Option 1: Title, (?) docs link, and clean inline AND/OR toggle */}
          <div className="display-flex flex-align-center flex-justify padding-bottom-1 border-bottom-1px border-base-lighter">
            <div className="display-flex flex-align-center">
              <span className="font-sans-xs text-bold text-ink">
                Filter by event type
              </span>
              <Link
                to="/docs/circulars/archive#event-types"
                className="usa-link margin-left-05 text-base hover:text-primary display-flex flex-align-center"
                title="Learn more about event types documentation"
                aria-label="Event types documentation"
              >
                <Icon.Help role="presentation" size={3} />
              </Link>
            </div>

            {/* AND / OR Segmented Match Toggle */}
            <div className="display-flex flex-align-center">
              <ButtonGroup type="segmented" className="margin-0">
                <Button
                  type="button"
                  onClick={() => setPendingLogic('OR')}
                  className={classNames(
                    'padding-y-05 padding-x-1 font-sans-3xs height-3',
                    {
                      'usa-button--outline': pendingLogic !== 'OR',
                    }
                  )}
                  title="Match ANY included event type"
                >
                  Any (OR)
                </Button>
                <Button
                  type="button"
                  onClick={() => setPendingLogic('AND')}
                  className={classNames(
                    'padding-y-05 padding-x-1 font-sans-3xs height-3',
                    {
                      'usa-button--outline': pendingLogic !== 'AND',
                    }
                  )}
                  title="Match ALL included event types"
                >
                  All (AND)
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {/* Quick Actions & Counter */}
          <div className="display-flex flex-align-center flex-justify font-sans-3xs text-base-dark margin-top-1 margin-bottom-05">
            <div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="usa-button usa-button--unstyled text-primary hover:text-primary-dark text-bold"
              >
                Select all 15
              </button>
              <span className="margin-x-05 text-base-light">•</span>
              <button
                type="button"
                onClick={handleResetAll}
                className="usa-button usa-button--unstyled text-primary hover:text-primary-dark text-bold"
              >
                Reset
              </button>
            </div>
            <span className="text-base font-mono">
              Displaying {filteredEventTypes.length}
            </span>
          </div>

          {/* Modular Search Filter (easily enabled/disabled with boolean or prop) */}
          {enableSearchFilter && (
            <div className="position-relative margin-y-1">
              <TextInput
                id={searchInputId}
                name="eventTypeFilterQuery"
                type="search"
                inputRef={searchInputRef}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search event types..."
                className="margin-0 height-4 font-sans-xs padding-left-4 padding-right-3"
              />
              <span
                className="position-absolute text-base-light"
                style={{ left: '0.6rem', top: '0.5rem', pointerEvents: 'none' }}
              >
                <Icon.Search role="presentation" size={3} />
              </span>
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchFilter('')
                    searchInputRef.current?.focus()
                  }}
                  className="usa-button usa-button--unstyled position-absolute text-base-light hover:text-ink padding-1"
                  style={{ right: '0.2rem', top: '0.1rem' }}
                  aria-label="Clear search filter"
                >
                  <Icon.Close role="presentation" size={3} />
                </button>
              )}
            </div>
          )}

          {/* Scrollable list of 15 Tri-State Event Types */}
          <div
            className="margin-top-1 padding-right-05"
            style={{ maxHeight: '16rem', overflowY: 'auto' }}
          >
            {filteredEventTypes.map((eventType) => (
              <TriStateRow
                key={eventType}
                eventType={eventType}
                state={pendingStates[eventType]}
                onCycle={() => cycleEventType(eventType)}
              />
            ))}
            {filteredEventTypes.length === 0 && (
              <div className="padding-3 text-center text-base font-sans-xs">
                No matching event types found for "{searchFilter}"
              </div>
            )}
          </div>
        </CardBody>

        {/* Card Footer with Summary and Action Buttons */}
        <CardFooter className="padding-2 border-top-1px border-base-lighter display-flex flex-align-center flex-justify">
          <div className="font-sans-3xs text-base-dark">
            {pendingIncludeCount > 0 || pendingExcludeCount > 0 ? (
              <span>
                <strong>{pendingIncludeCount}</strong> included,{' '}
                <strong>{pendingExcludeCount}</strong> excluded
              </span>
            ) : (
              <span className="text-base-light">All circulars shown</span>
            )}
          </div>
          <div className="display-flex gap-1">
            <Button
              type="button"
              className="usa-button--outline padding-y-1 padding-x-2 font-sans-xs"
              onClick={closeDropdown}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="padding-y-1 padding-x-2 font-sans-xs"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </CardFooter>
      </DetailsDropdownContent>
    </div>
  )
}
