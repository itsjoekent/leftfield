const ms = require('ms');
const { auth } = require('pkg.technician');

module.exports = function(router) {
  router.get('/login', async (req, res) => {
    try {
      const token = await auth.sign(
        process.env.JWT_SECRET,
        'test_account_id',
        {},
        '2 days',
      );

      if (token instanceof Error) {
        throw token;
      }

      const cookieOptions = {
        maxAge: ms('2 days'),
        secure: true,
        domain: process.env.DOMAIN,
      };

      res.cookie('authToken', token, cookieOptions);
      res.status(201).send();
    } catch (error) {
      console.error('error', error);
      res.status(400).send('error');
    }
  });
}
