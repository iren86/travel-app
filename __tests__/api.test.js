import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API test suite', () => {
  let server;
  beforeEach(() => {
    server = require('../src/server/index.js', { bustCache: true });
  });

// closing the server
  afterEach(() => {
    server.close();
  });

// Test to get positive status code
  it('should return status 200', (done) => {
    chai.request(server)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(200);
        done();
      })
      .catch((err) => expect(err).to.be.null);
  });

// Test to get object
  it('should return html', (done) => {
    chai.request(server)
      .get('/geo-info')
      .then((res) => {
        expect(res).to.be.html;
        done();
      })
      .catch((err) => expect(err).to.be.null);
  });
});
