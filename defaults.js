/**
 * Axel Boberg © 2019
 */

/**
 * Add default values to a shallow 
 * clone of an object
 * @param { Object } target Target object
 * @param { Object } defaults Default values
 * @returns { Object }
 */
function defaults (target, defaults) {
  if (!typeof target === 'Object') throw new TypeError(`Parameter 'target' must be an object`)
  if (!typeof defaults === 'Object') throw new TypeError(`Parameter 'defaults' must be an object`)

  const mirror = Object.assign({}, defaults)
  return Object.assign(mirror, target)
}

module.exports = defaults