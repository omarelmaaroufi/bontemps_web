const express = require('express');
const router = new express.Router();
const authentication = require('./authentication.js');
const gerechten = require('../controllers/gerechten.js');

router.route('/gerechten/:id?')
  .all(authentication.ensureAuthenticated())
  .get(gerechten.get)
  .post(gerechten.post)
  .put(gerechten.put)
  .delete(gerechten.delete);
 
module.exports = router;