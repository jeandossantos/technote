import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { Note } from '../models/note.js';
import { CustomException } from '../exceptions/CustomException.js';

/**
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const getAllUsers = async function (req, res) {
  const users = await User.find().select('-password').lean();

  return res.json(users);
};

/**
 * @desc Create a new User
 * @route POST /users
 * @access Private
 */
const createUser = async function (req, res) {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || roles.length === 0) {
    throw new CustomException('All fields are required.');
  }

  const duplicate = await User.findOne({ username }).lean();

  if (duplicate) {
    throw new CustomException('Duplicate username', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await User.create({
    username,
    password: hashedPassword,
    roles,
  });

  return res
    .status(201)
    .json({ message: `new user ${username} created successfully` });
};

/**
 * @desc Update a User
 * @route PUT /users
 * @access Private
 */
const updateUser = async function (req, res) {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    roles.length === 0 ||
    typeof active !== 'boolean'
  ) {
    throw new CustomException('All fields are required.');
  }

  const user = await User.findById(id).exec();

  if (!user) throw new CustomException('User not found');

  const duplicate = await User.findOne({ username }).lean();

  if (duplicate && duplicate._id.toString() !== id) {
    throw new CustomException('Duplicate username', 409);
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 12);
  }

  const updatedUser = await user.save();

  return res
    .status(201)
    .json({ message: `User ${updatedUser.username} updated successfully` });
};

/**
 * @desc Delete a new User
 * @route DELETE /users
 * @access Private
 */
const deleteUser = async function (req, res) {
  const { id } = req.body;

  if (!id) throw new CustomException('User ID is required');

  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) throw new CustomException('User has assigned notes');

  const user = await User.findById(id).exec();

  if (!user) throw new CustomException('User not found');

  const deletedUser = await user.deleteOne({ id });

  return res.json({
    message: `User with ID ${deletedUser._id} deleted`,
  });
};

export { getAllUsers, createUser, updateUser, deleteUser };
