/**
 * Axel Boberg © 2019
 */

/**
 * Serialize an object into a query-string
 * @param { Object } obj 
 * @returns { String }
 */
function serialize (obj = {}) {
  return Object.entries(obj)
    .map(([key, val]) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(val)
    })
    .join('&')
}
exports.serialize = serialize

/**
 * A convenience-function for concatenating
 * a uri with query parameters in the form
 * of an object.
 * 
 * The params-object will be query-serialized.
 * 
 * @param { String } uri 
 * @param { Object } params 
 * @returns { String }
 */
function appendQueryParameters (uri, params = {}) {
  const serialized = '?' + exports.serialize(params)
  return `${uri}${serialized.length > 1 ? serialized : ''}`
}
exports.appendQueryParameters = appendQueryParameters