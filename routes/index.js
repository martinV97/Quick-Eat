/*
 * GET home page.
 */
var express = require('express');
var router = express();

exports.index = function(req, res){
  res.render('index', { title: 'Prueba' });
};
