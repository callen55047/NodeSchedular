interface ICreateSortable {
  created_at: string
}

function sortByCreatedAt<T>(arr: T[], order?: string): T[] {
  if (order === 'desc') {
    return arr.sort((a, b) => {
      return new Date((a as ICreateSortable).created_at).getTime() -
        new Date((b as ICreateSortable).created_at).getTime()
    })
  } else {
    return arr.sort((a, b) => {
      return new Date((b as ICreateSortable).created_at).getTime() -
        new Date((a as ICreateSortable).created_at).getTime()
    })
  }
}

export {
  sortByCreatedAt
}