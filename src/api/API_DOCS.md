# API Documentation

---------

## Accounts
Used to create, login, and retrieve account information for both mobile app and artist portal


### POST `/api/auth/register`

- user or artist
- returns email, username, access and refresh tokens

Request
```json
{
  "username": "johnny Appleseed",
  "email": "sample@io.com",
  "password": "12345",
  "is_artist": false
}
```

Response

```json
{
  "username": "johnny Appleseed",
  "email": "sample@io.com",
  "access_token": "123-123-123-123-123",
  "refresh_token": "123-123-123-123-123"
}
```


### POST `/api/auth/login`

- user or artist
- returns access and refresh tokens, and account role type

Request
```json
{
  "email": "sample@io.com",
  "password": "12345"
}
```

Response

```json
{
  "access_token": "123-123-123-123-123",
  "refresh_token": "123-123-123-123-123",
  "role": "user | artist"
}
```

### POST `/api/auth/refresh-access-token`

- user or artist
- returns new access_token

Request
```json
{
  "refresh_token": "123-123-123-123"
}
```

Response

```json
{
  "access_token": "123-123-123-123-123"
}
```

---------

## Files
file storage system. Mainly used for images so far


### POST `/api/file/upload/single`

- user or artist
- returns email, username, access and refresh tokens

Request
```json
{
  "file": "file object",
  "type": "storefront | message | inquiry | profile | none"
}
```

Response

```json
{
  "file": {
    "_id": "123-123-123",
    "name": "something",
    "metaType": "storefront | message | inquiry | profile | none",
    "owner_id": "123-123-123",
    "size": 1234,
    "contentType": "image/png | image/jpeg",
    "url": "base64 string of file"
  }
}
```


### GET `/api/file/user/all`

- user or artist
- returns all files where file.owner_id = request.user_id

Request
```json
{}
```

Response

```json
{
  "files": [
    {
      "_id": "123-123-123",
      "name": "something",
      "metaType": "storefront | message | inquiry | profile | none",
      "owner_id": "123-123-123",
      "size": 1234,
      "contentType": "image/png | image/jpeg",
      "url": "base64 string of file"
    }
  ]
}
```


### DELETE `/api/file/delete/:file_id`

- user or artist
- returns deleted file_id

Request
```json
{}
```

Response

```json
{
  "file_id": "123-123-123"
}
```

----------

## Transactions
Used primarily from the user perspective. The only transactions the artist will be initiating will be refunds, 
or credits to other uses, etc.


### GET `/api/transaction/session/price/:session_id`

- can be fetched from user or artist
- returns total price, deposit amount, and all applicable fees as individual amounts

Request
```json
{}
```

Response

```json
{
  "price": 0.0,
  "deposit": 0.0,
  "fee": 0.0
}
```


### POST `/api/transaction/session/deposit/intent`

- called from user
- creates Stripe API intent
- creates local transaction object with stripe_intent_id and product_id referencing session
- returns transaction object

Request

```json
{
  "session_id": "1233-123423-234235"
}
```

Response

```json
{
  "transaction": {
    "stripe_intent_id": "1234-1244-12341",
    "stripe_payment_success": false,
    "sender_id": "<user_id>",
    "receiver_id": "<artist_id>",
    "product_id": "<session_id>",
    "type": "deposit",
    "created_at": "2023-12-08T00:00:000Z",
    "updated_at": "2023-12-08T00:00:000Z"
  },
  "client_secret": "123-123-123"
}
```


### POST `/api/transaction/session/payment/intent`

- called from user
- calculate fees for total price (including deposit)
- creates Stripe API intent
- creates local transaction object with stripe_intent_id and product_id referencing session
- returns transaction object

Request

```json
{
  "session_id": "1233-123423-234235"
}
```

Response

```json
{
  "transaction": {
    "stripe_intent_id": "1234-1244-12341",
    "stripe_payment_success": false,
    "sender_id": "<user_id>",
    "receiver_id": "<artist_id>",
    "product_id": "<session_id>",
    "type": "payment",
    "created_at": "2023-12-08T00:00:000Z",
    "updated_at": "2023-12-08T00:00:000Z"
  },
  "client_secret": "123-123-123"
}
```


### POST `/api/transaction/session/confirm-payment`

- called from user
- loads stripe intent and checks completion status
- send email notification to artist of completed total payment
- send email receipt for total payment to user
- returns transaction object

Request

```json
{
  "transaction_id": "1233-123423-234235",
  "stripe_capture_id": "123-123-123-123"
}
```

Response

```json
{
  "transaction": {
    "stripe_intent_id": "1234-1244-12341",
    "stripe_payment_success": true,
    "sender_id": "<user_id>",
    "receiver_id": "<artist_id>",
    "product_id": "<session_id>",
    "type": "payment",
    "created_at": "2023-12-08T00:00:000Z",
    "updated_at": "2023-12-08T00:00:000Z"
  }
}
```


### GET `/api/transaction/all`

- called from either user or artist
- returns all transactions where current user is receiver or sender

Request

```json
{}
```

Response

```json
{
  "transactions": []
}
```