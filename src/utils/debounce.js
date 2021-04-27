let timeout = {}

function debounce(fn, wait) {
  if (timeout[fn]) clearTimeout(timeout[fn])
  timeout[fn] = setTimeout(fn, wait)
}

export default debounce
