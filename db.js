const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost:5432/acme-web-seq-practice');

const Page = db.define('page', {
  name: Sequelize.STRING,
  is_home_page: Sequelize.BOOLEAN,
});
const Content = db.define('content', {
  name: Sequelize.STRING,
  body: Sequelize.TEXT,
});

Content.belongsTo(Page);
Page.hasMany(Content);

const syncAndSeed = () => {
  db.sync({ force: true }).then(async () => {
    const [home, employees, contact] = await Promise.all([
      Page.create({
        name: 'Home',
        is_home_page: true,
      }),
      Page.create({
        name: 'Employees',
        is_home_page: false,
      }),
      Page.create({
        name: 'Contact',
        is_home_page: false,
      }),
    ]);
    await Promise.all([
      Content.create({
        name: 'Home',
        body: 'Welcome Home',
        pageId: home.id,
      }),
      Content.create({
        name: 'Moe',
        body: 'Moe is the CEO',
        pageId: employees.id,
      }),
      Content.create({
        name: 'Larry',
        body: 'Larry is the CTO',
        pageId: employees.id,
      }),
      Content.create({
        name: 'Curly',
        body: 'Curly is the COO',
        pageId: employees.id,
      }),
      Content.create({
        name: 'Phone',
        body: 'Call us at 555-555-5555',
        pageId: contact.id,
      }),
      Content.create({
        name: 'Fax',
        body: 'Fax us at 555-555-5556',
        pageId: contact.id,
      }),
    ]);
  });
};

syncAndSeed();

module.exports = { db, syncAndSeed, Page, Content };
