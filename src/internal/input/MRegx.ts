const MRegx = {
  caseSensitive: (source: string): RegExp => {
    return new RegExp('^' + source, 'i')
  }
}

export default MRegx