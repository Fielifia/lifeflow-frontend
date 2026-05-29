import {
  motivationQuotes,
  progressQuotes
} from './constants/quotes'

/**
 * Description:
 * Returns a random quote from the provided quote collection.
 * @param {string[]} quotes - Collection of quotes.
 * @returns {string} A randomly selected quote.
 */
function getRandomQuote(quotes) {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

/**
 * Description:
 * Returns a random motivation quote for dashboard-related views.
 * @returns {string} A randomly selected motivation quote.
 */
export function getRandomMotivationQuote() {
  return getRandomQuote(motivationQuotes)
}

/**
 * Description:
 * Returns a random progress quote for statistics-related views.
 * @returns {string} A randomly selected progress quote.
 */
export function getRandomProgressQuote() {
  return getRandomQuote(progressQuotes)
}
