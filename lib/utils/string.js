/** @babel */

export function stringUtil(str) {
  return {
    endsWith: (suffix) => {
      str.indexOf(suffix, str.length - suffix.length) !== -1
    },
    contains: (otherStr) => {
      return str.indexOf(otherStr) !== -1
    }
  }
}
