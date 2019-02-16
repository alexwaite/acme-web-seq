const express = require('express');
const app = express();
const ejs = require('ejs');

const db = require('./db');
const { Page, Content } = require('./db');

module.exports = app;

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.get('/', (req, res, next) => {
  Page.findOne({
    where: {
      is_home_page: true,
    },
  })
    .then(page => {
      res.redirect(`pages/${page.id}`);
    })
    .catch(next);
});

app.get('/pages/:id', (req, res, next) => {
  Promise.all([
    Page.findByPk(req.params.id, { include: [Content] }),
    Page.findAll(),
  ])
    .then(([page, pages]) => res.render('index', { page, pages }))
    .catch(next);
});
