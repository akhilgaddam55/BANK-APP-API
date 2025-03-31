import jwt from 'jsonwebtoken';

async function authenticate(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const splitToken = authorization.split('Bearer ');
      const token = splitToken[1];

      if (!token) {
        return res.status(403).send({ message: 'Unauthorized! No token!' });
      }

      try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        if (Math.round(new Date().getTime() / 1000) < decodedUser.exp) {
          req.locals = decodedUser;
          return next();
        } else {
          return res.status(401).send({ message: 'Unauthorized!' });
        }
      } catch (error) {
        return res.status(403).send({ message: 'Unauthorized!' });
      }
    } else {
      return res.status(403).send({ message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(403).send({ message: 'Unauthorized' });
  }
}

export default authenticate;
