# Jörn - 13.11.19

## Installation

The application consists of two individual parts: The react based fronted and the API server.
Start each part in its own terminal:

### Api-Server

```
cd api-server
yarn install
yarn start
```

Files will be uploaded to `./api-server/uploads`

### React App

```
yarn install
yarn start
```

Navigate to [http://localhost:3000](http://localhost:3000)

Due to tailwinds file watcher, which gets started in a second process and sometimes takes a while, the browser might load be a blank screen initially. Simply reload any your're good to go.

### Testing

Run tests via `yarn test` or get a coverage report via `yarn coverage`. You'll find the report at [./coverage/index.html](./coverage/index.html)

## Security

// List security concerns:
// - that have been addressed
// - that have _not_ been addressed

## Improvements

// What could be added to the app / API?

## Libraries

// What external libraries have you used and why?

## API

The API tend to follow the response layout of the https://jsonapi.org/ specification. Following a generalized API specification (with good documentation) allows developers to work more independently on different parts and sides of the API to e.g. introduce new endpoints or consume endpoints in (during construction) unintended ways.

### Objects

#### File Object

### Endpoints

The following endpoints are implemented right now:

### GET /files

The `/files` endpoint returns a list of allowed files stored on the server.

#### Parameters

You can enhance requests by optionally applying the following parameters:

| Name | Example           | Description                                      |
| ---- | ----------------- | ------------------------------------------------ |
| `q`  | `/files?q=MyName` | Filters the file list by name (case insensitive) |

#### Response

##### No files available

```json
{
  "data": []
}
```

##### No files available

```json
{
  "data": [
    {
      "type": "file",
      "id": "6fc6ff794b7101af013fa8ec300879d1ed245c3926619c1625753bf34ef8ccbd",
      "attributes": {
        "name": "1-bsSpf1dNMQ6NIotoSMQQrA",
        "size": 26492,
        "mime": "image/png"
      }
    },
    {
      "type": "file",
      "id": "4c1700116bfc788eca30ab1561a5f7821c686c6302b78e17f107e2c96a59d51c",
      "attributes": {
        "name": "1552892759_00cd432e47_o",
        "size": 1193928,
        "mime": "image/jpeg"
      }
    }
  ]
}
```

### POST /upload

The `/upload` endpoint lets you upload a file via multipart form. This differs from the approach to only send json back and forth.

A request will be rejected if one of the following conditions applies:

- **Invalid mime type**: Only `image/jpeg` and `image/png` are allowed
- **Exceeded file size**: Only files up to `10MB` are allowed (TODO)

#### Parameters

No parameters available

#### Request

Requests need to be of content type `multipart/form-data`.
Send file data in a form field named `file` (`<input type="file" name="file" />`) or append it to `FormData` as shown below.

```js
const data = new FormData()
data.append('file', yourFileData)

axios.post('/upload', data, () => ...)
```

#### Response

##### Error during upload

Status: 400 Bad Request

```json
{
  "errors": [
    {
      "title": "Only \"image/jpeg\" allowed!"
    }
  ]
}
```

##### Successfully uploaded

The successfully uploaded file is returned in the response data.

Status: 201 Created

```json
{
  "data": {
    "type": "file",
    "id": "6fc6ff794b7101af013fa8ec300879d1ed245c3926619c1625753bf34ef8ccbd",
    "attributes": {
      "name": "1-bsSpf1dNMQ6NIotoSMQQrA",
      "size": 26492
    }
  }
}
```

### DELETE /files/:id

The `/files/:id` endpoint lets you delete a file previously created.

Right now the API will always return `200 OK` status code – simulating the removal of the file.

#### Parameters

No parameters available

#### Content

No need to send content

---

## Other notes

// Anything else you want to mention
