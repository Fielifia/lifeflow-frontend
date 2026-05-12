export default function StatsHero({
  selectedRange = '1 Month',
  onChangeRange,
}) {
  const ranges = [
    '1 Month',
    '3 Months',
    '6 Months',
    '1 Year',
    'All Time',
  ]

  return (
    <div className="stats-header">
      <div className="stats-range-picker">
        {ranges.map((range) => (
          <button
            key={range}
            className={
              range === selectedRange
                ? 'stats-range-btn active'
                : 'stats-range-btn'
            }
            onClick={() => onChangeRange?.(range)}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  )
}
