function createTempId(): string {
    return `NEW-${Math.random() * 100}`
}

function isTempId(id: string): boolean {
    return id.includes("NEW-")
}

export {
    createTempId,
    isTempId
}