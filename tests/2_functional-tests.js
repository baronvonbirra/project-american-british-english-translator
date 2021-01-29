const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
  test("Translation with text and locale fields: POST request to /api/translate", function (done) {
    chai.request(server)
      .post('/api/translate')
      .send({ locale: 'british-to-american', text: 'We watched the footie match for a while.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'We watched the footie match for a while.');
        assert.equal(res.body.translation, 'We watched the <span class="highlight">soccer</span> match for a while.');
        done();
      });
  });

  test("Translation with text and invalid locale field: POST request to /api/translate", function (done) {
    chai.request(server)
      .post('/api/translate')
      .send({ locale: 'spanish', text: 'I ate yogurt for breakfast.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value for locale field');
        done();
      });
  });

  test("Translation with missing text field: POST request to /api/translate", function (done) {
    chai.request(server)
      .post('/api/translate')
      .send({ locale: 'british-to-american'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test("Translation with missing locale field: POST request to /api/translate", function (done) {
    chai.request(server)
      .post('/api/translate')
      .send({ text: 'Can you toss this in the trashcan for me?'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test("Translation with empty text: POST request to /api/translate", function (done) {
    chai.request(server)
      .post('/api/translate')
      .send({ locale: 'british-to-american', text: ' '
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'No text to translate');
        done();
      });
  });

  test("Translation with text that needs no translation: POST request to /api/translate", function (done) {
    chai.request(server)
      .post('/api/translate')
      .send({ locale: 'american-to-british', text: 'We watched the footie match for a while.'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
  });

});
