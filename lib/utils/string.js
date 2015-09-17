/** @babel */

export default function stringUtil(str) {
  return {
    endsWith: (suffix) => {
      return str.indexOf(suffix, str.length - suffix.length) !== -1
    },
    contains: (otherStr) => {
      return str.indexOf(otherStr) !== -1
    }
  }
}
