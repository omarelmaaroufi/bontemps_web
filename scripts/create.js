const webServer = require('../services/web-server.js');
const database  = require('../services/database.js');
const dbConfig  = require('../config/database.js');
const oracledb  = require('oracledb')
const express = require('express')
const http = require('http')


connection =  oracledb.getConnection(dbConfig);

connection.execute(`CREATE TABLE gerechten(id NUMBER PRIMARY KEY, soort VARCHAR2(15) not null, naam VARCHAR2(30) not null, prijs NUMBER not null, bijzonderheden CHAR not null)`);
 