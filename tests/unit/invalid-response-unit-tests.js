const Clarifai = require('./../../src');
const {BASE_URL, SAMPLE_API_KEY} = require('./helpers');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

let app;

let mock;

describe('Unit Tests - Invalid Response', () => {
  beforeAll(() => {
    app = new Clarifai.App({
      apiKey: SAMPLE_API_KEY,
      apiEndpoint: BASE_URL
    });
  });

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  it('Handles invalid JSON', done => {
    mock.onGet(BASE_URL + '/v2/inputs/%40modelID').reply(200, `
{
  "status": {
    "code": 10000,
    "description": "Ok"
  },
  "model": {
    `);
    app.models.get('@modelID')
      .catch(response => {
        done();
      });
  });

  it('Handles predict with invalid URL', done => {
    mock.onPost(BASE_URL + '/v2/models/%40modelID/outputs').reply(400, `
{
  "status": {
    "code": 10020,
    "description": "Failure"
  },
  "outputs": [
  {
    "id": "@outputID",
    "status": {
      "code": 30002,
      "description": "Download failed; check URL",
      "details": "404 Client Error: Not Found for url: @invalidURL"
    },
    "created_at": "2019-01-20T19:39:15.460417224Z",
    "model": {
      "id": "@modelID",
      "name": "color",
      "created_at": "2016-05-11T18:05:45.924367Z",
      "app_id": "main",
      "output_info": {
        "message": "Show output_info with: GET /models/{model_id}/output_info",
        "type": "color",
        "type_ext": "color"
      },
      "model_version": {
        "id": "@modelVersionID",
        "created_at": "2016-07-13T01:19:12.147644Z",
        "status": {
          "code": 21100,
          "description": "Model trained successfully"
        },
        "train_stats": {}
      },
      "display_name": "Color"
    },
    "input": {
      "id": "@inputID",
      "data": {
        "image": {
          "url": "@invalidURL"
        }
      }
    },
    "data": {}
  }
  ]
}
    `);

    app.models.predict('@modelID', {url: '@invalidURL'})
      .then(response => {
        done.fail('Did not throw');
      })
      .catch(response => {
        done();
      });
  });

  // TODO(Rok) MEDIUM: Add testing mixed success.
});
