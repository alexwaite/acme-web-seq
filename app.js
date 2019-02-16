const express = require('express');
const app = express();
const ejs = require('ejs');

const methodOverride = require('method-override');

const db = require('./db');
const { Page, Content } = require('./db');

module.exports = app;

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(methodOverride('_method'));

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

app.post('/pages/:id/contents', (req, res, next) => {
  Content.create({
    pageId: req.params.id,
    name: 'A num',
    body: `Math.random()`,
  })
    .then(content => res.redirect(`/pages/${req.params.id}`))
    .catch(next);
});

app.delete('/pages/:pageId/contents/:id', (req, res, next) => {
  Content.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.redirect(`/pages/${req.params.pageId}`);
    })
    .catch(next);
});
