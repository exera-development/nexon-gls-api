const isValidLanguage = (language: string) => {
  return ['EN', 'HR', 'CS', 'HU', 'RO', 'SK', 'SL'].includes(language)
}

export default isValidLanguage
