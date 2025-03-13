interface IRating {
  receiver_id: string,
  sender_id: string,
  session_id: string | null,
  quality: number,
  tags: string,
  comment: string,
  created_at: string,
  updated_at: string
}

export {
  IRating
}