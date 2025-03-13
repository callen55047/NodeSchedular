function TrimString(str: string | null | undefined): string {
    return !!str ?
        str.length > 20 ? `${str.slice(0, 20)}...` : str : ""
}

export {
    TrimString
}