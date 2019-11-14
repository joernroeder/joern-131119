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

User input, as well as potential malicious API responses are a potential security concern.

### that have been addressed

- No direct injecting of values into the DOM.
- No spreading of props
- No `dangerouslySetInnerHTML`
- Explicit
- urlEncoding for user queries (during search/filtering) as well as file during file removal.
- Validation of format of individual props once received from the API and put into the central FileStore

### that have _not_ been addressed

- Full JSON Schema validation for incoming requests. It is still possible to send additional fields.
- Content Security Policy
- X-XSS-Protection Header
- XSRF Cross-site request forgery
- Rate Limiting of requests
- Validation of Requests via some (incremental) Nonce

## Improvements

The application can be improved on various layers:

### Interface

- The interface can be visually enhanced with more direct feedback like focus styles, progress bars tooltips, modals etc.
- Accessibility via ARIA tags

### Code quality

My goal for this point in time was to set up a solid foundation for an easy use and extendable architecture.
The api modules, store validators, file validators might be a good example.
Code quality can be improved by adding more delicate control to individual components (which is required for more visual feedback) and further decoupling of components.
Securing its own in- and outputs should be the job of every component to make them more self contained and atomic.

### Security

Main issue right now is the connector to the API. JSON parsing is done via axios and therefore i'm relying on their security.
I think that additional checks the upload procedure may also have some weak points.

### API

- pagination for file list
- search could only return ids, ui fetches data independently

## Libraries

I'm trying to use as less external libraries as possible but included the following for various reasons:

### Developer Experience

- [prop-types](https://www.npmjs.com/package/prop-types) documents the intended type of properties passed to components and ensures correctness in conjunction with eslint.

- [@testing-library/react](https://testing-library.com/react) Integration focused testing library
- [jest-prop-type-error](https://www.npmjs.com/package/jest-prop-type-error) Improves prop-types support in Jest by failing tests on prop-type errors instead of ignoring them.

### Utility CSS

- [tailwindcss](https://tailwindcss.com/)
- [purgeCSS](https://www.purgecss.com/) PurgeCSS removes unused CSS. This is essential in combination with utility CSS libraries as they normally provide the full set of options to choose from.

### "Functional Async React"

Dealing with async state in functional components without dealing with repetitive `const [isLoading, setLoading] = useState(false)` statements in each component is hard. Also abstracting it into custom hooks has its downside in combination with data fetching.
My approach to create a custom hook to handle async operations nicely and behind the scenes (for most component authors) failed badly and also the switch to [axios](https://github.com/axios/axios) driven async state was unconvincing for me.
Going "back" to class based components also felt like a step in the wrong direction.

Now it seems so obvious, but I did not recognize https://github.com/async-library/react-async before – which solves the mentioned problems in an elegant way. Therefore API modules are rewritten with `react-async`, `axios` module removed and all requests are done with `fetch` now.
The Components are therefore much cleaner, API and async related functionality is hidden again, requests are still cancelable.

TODO: update tests.

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
