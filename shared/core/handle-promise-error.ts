async function handlePromiseError<T>(
  promise: Promise<T>,
  errorMessage: string
): Promise<T> {
  try {
    return await promise
  } catch (err) {
    console.error(err)
    throw new Error(errorMessage)
  }
}

export default handlePromiseError
