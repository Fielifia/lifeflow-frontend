import { useEffect, useRef } from 'react'

export default function StatsHeader({
  selectedRange,
  onChangeRange,
}) {
  const activeRef = useRef(null)

  const ranges = [
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
    { label: 'All Time', value: 'all' },
  ]

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [selectedRange])

  return (
    <div className="stats-ranges">
      {ranges.map((range) => (
        <button
          key={range.value}
          ref={
            range.value === selectedRange
              ? activeRef
              : null
          }
          className={
            range.value === selectedRange
              ? 'stats-range-btn active'
              : 'stats-range-btn'
          }
          onClick={() =>
            onChangeRange(range.value)
          }
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
