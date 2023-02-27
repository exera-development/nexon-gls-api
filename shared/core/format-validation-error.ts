import { fromZodError } from 'zod-validation-error'

function formatValidationError(err: any) {
  return fromZodError(err).toString()
}

export default formatValidationError
