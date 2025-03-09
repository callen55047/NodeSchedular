const LocalizedText = {

  smsVerifyCode: (code: string): string => {
    return `Your NodeSchedular Account Code is: ${code}. Don't share it with anyone.
    \n@domain.com #${code} %domain.com`
  }

}

export default LocalizedText