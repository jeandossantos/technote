import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomException } from '../exceptions/CustomException.js';
import { User } from '../models/user.js';

/**
 * @desc Login
 * @route POST /auth
 * @access Public
 */
const login = async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new CustomException('All fields are required');
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser || !foundUser.active) {
    throw new CustomException('Unauthorized');
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) throw new CustomException('Unauthorized');

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15s' }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: 'None', //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  return res.json({ accessToken });
};

/**
 * @desc Refresh a token
 * @route POST /auth/refresh
 * @access Public - if token is expired
 */
const refresh = async function (req, res) {
  const cookies = req.cookies;

  if (!cookies?.jwt) throw new CustomException('Unauthorized');

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        throw new CustomException('Forbidden');
      }

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) throw new CustomException('Unauthorized');

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      return res.json({ accessToken });
    }
  );
};

/**
 * @desc Logout a user
 * @route POST /auth
 * @access Public - just clear the cookie if exists
 */
const logout = async function (req, res) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);
  //No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  return res.json({ message: 'Cookie cleared' });
};

export { login, refresh, logout };
