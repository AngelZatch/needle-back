import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { DI } from '../index';
import { User } from '../models/user.model';

const bcrypt = require('bcrypt');

const router = Router();
const SALT_ROUNDS = 10;
const JWTSecret = process.env.JWT_SECRET || 'localSecret';

router.post('/signup', async (request, response) => {
  const { mail, password, nickname } = request.body;

  if (!mail || !password || !nickname) {
    return response
      .status(412)
      .send(
        'You need to provide a mail address, a password and a nickname to register',
      );
  }

  if (await DI.userRepository.findOne({ mail })) {
    return response
      .status(409)
      .send('The mail address is invalid or already in use.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User(nickname, hashedPassword, mail);
    await DI.userRepository.persistAndFlush(user);

    const accessToken = jwt.sign({ userId: user.id }, JWTSecret, {
      expiresIn: '7d',
    });

    response.cookie('accessToken', accessToken);

    response.json(user);
  } catch (error) {
    return response.status(400).json({ message: error.message });
  }
});

router.post('/login', async (request, response) => {
  const { mail, password } = request.body;

  if (!mail || !password) {
    return response
      .status(412)
      .send('You need to provide a mail address and a password to login.');
  }

  try {
    const user = await DI.userRepository.findOneOrFail({ mail });
    await bcrypt.compare(password, user!.password);

    const accessToken = jwt.sign({ userId: user.id }, JWTSecret, {
      expiresIn: '7d',
    });

    response.cookie('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      signed: true,
      sameSite: true,
      secure: true,
    });

    response.json(user);
  } catch (error) {
    return response
      .status(401)
      .json({ message: 'Your credentials are invalid' });
  }
});

router.post('/logout', async (request, response) => {
  response.clearCookie('accessToken');
  response.clearCookie('refreshToken');
  response.status(200).send('');
});

export const AuthController = router;
