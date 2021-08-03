const {
  models: { User },
} = require('./db');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(req.headers);
  if (token) {
    try {
      const user = await User.findByToken(token);
      // console.log(user);
      req.user = user;
      next();
    } catch (error) {
      console.log('Error in requireToken middleware', error);
    }
  } else res.sendStatus(401);
};
