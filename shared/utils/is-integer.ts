const isInteger = (str: string): boolean => {
  return /^-?\d+$/.test(str)
}

export default isInteger
