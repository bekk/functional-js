# Case: Making a simple Record Collection App

Start the project by cloning the repo, change directory to `small-case`,
and install dependencies:

```
npm install
```


## Running project

You only need to run one command, it will take care of everything and open the
approperiate page in your browser.

```
npm start
```


## Working on the case.

The implementation should be done in [/app.js](./app.js).

A mock API has been written for this case, and is located in
[/api.js](./api.js). It has the following methods:

- **records()** Returns a promise which resolves to the contents of the record collection.
- **newRecord(record)** Returns a promise which resolves to the newly added record.

Both methods can be rejected with an Error.

### Result

The result should be a fully functional app for storing records in memory.

- It should validate each field and the whole form
- It should fetch the existing records
- It should add new records to the existing records (in memory only)
- It should show spinners for async tasks
- It should display error-messages

![BaconChat](https://raw.githubusercontent.com/bekkopen/funksjonell-js/gh-pages/dag2/small-case/recordapp.png)
