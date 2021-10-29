const { v4: uuidv4 } = require('uuid');

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const name = req.query.region;

  const wines = [
    {
      id: uuidv4(),
      name: 'D2',
      winery: 'DeLille',
      region: 'WA',
    },
    {
      id: uuidv4(),
      name: 'Panther Creek',
      winery: 'DeLille',
      region: 'WA',
    },
  ];

  context.res = {
    body: wines,
  };
};
