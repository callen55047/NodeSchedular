interface IThread {
    _id: string,
    artist_id: string,
    user_id: string,
    created_at: string,
    updated_at: string,
    archived_at?: string
}

export {
    IThread
}