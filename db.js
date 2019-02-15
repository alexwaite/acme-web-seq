const Sequelize = require('sequelize');

const conn = new Sequelize('postgres://localhost:5432/acme-web-seq-practice');

const Page = conn.define('page', {
  name: Sequelize.STRING,
  is_home_page: Sequelize.BOOLEAN,
});
const Content = conn.define('content', {
  name: Sequelize.STRING,
  body: Sequelize.TEXT,
});

Content.belongsTo(Page);
Page.hasMany(Content);

conn
  .sync({ force: true })
  .then(() => {
    const createPages = Promise.all([
      Page.create({
        name: 'Home',
        is_home_page: true,
      }),
      Page.create({
        name: 'Employees',
        is_home_page: false,
      }),
      Page.create({
        name: 'Test',
        is_home_page: false,
      }),
    ]);
  })
  .then(() => {
    return Promise.all([createPages]);
  })
  .then(() => conn.close());

module.exports = { conn, Page, Content };
