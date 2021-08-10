var expect = require('chai').expect;
var request = require('request');
let loginToken;
let id;

let base_url = 'http://localhost:8000/';

describe('Api endpoints', () => {
  before((done) => {
    let form = {
      email: 'peterpaul@gmail.com',
      password: 'peter',
    };
    request.post(
      { url: base_url + 'signin', form },
      function (error, response, body) {
        if (error) {
          return console.error('upload failed:', error);
        }
        loginToken = JSON.parse(body).data.token;
        id = JSON.parse(body).data.userId;
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });

  describe('/employees', () => {
    it('get all employees', (done) => {
      request.get(
        {
          url: base_url + 'employees',
          headers: {
            authorization: loginToken,
          },
        },
        function (error, response) {
          if (error) {
            return console.error('Error:', error);
          }
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
  });

  describe('/employee/:id', () => {
    it('get a single employee', (done) => {
      request.get(
        {
          url: base_url + 'employee/' + id,
          headers: {
            authorization: loginToken,
          },
        },
        function (error, response) {
          if (error) {
            return console.error('Error:', error);
          }
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
  });

  describe('/article/empId', () => {
    it('get a single article', (done) => {
      request.get(
        {
          url: base_url + 'article/' + id,
          headers: {
            authorization: loginToken,
          },
        },
        function (error, response) {
          if (error) {
            return console.error('Error:', error);
          }
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
  });

  describe('/articles/empId', () => {
    it('get all articles', (done) => {
      request.get(
        {
          url: base_url + 'articles/' + id,
          headers: {
            authorization: loginToken,
          },
        },
        function (error, response) {
          if (error) {
            return console.error('Error:', error);
          }
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
  });
});
