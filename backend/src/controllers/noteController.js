import { User } from '../models/user.js';
import { Note } from '../models/note.js';
import { CustomException } from '../exceptions/CustomException.js';

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = async (req, res) => {
  // Get all notes from MongoDB
  const notes = await Note.find().lean();

  // If no notes
  if (!notes?.length) {
    return res.json([]);
  }

  // Add username to each note before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user.username };
    })
  );

  return res.json(notesWithUser);
};

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = async (req, res) => {
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    throw new CustomException('All fields are required');
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean();

  if (duplicate) {
    throw new CustomException('Duplicate note title', 409);
  }

  // Create and store the new user
  const note = new Note({
    user,
    title,
    text,
  });

  await note.save();

  return res.status(201).json({ message: 'New note created' });
};

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    throw new CustomException('All fields are required');
  }

  // Confirm note exists to update
  const note = await Note.findById(id).exec();

  if (!note) {
    throw new CustomException('Note not found');
  }

  // Check for duplicate title
  const duplicate = await Note.findOne({ title }).lean().exec();

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    throw new CustomException('Duplicate note title', 409);
  }

  note.user = user;
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();

  res.json(`'${updatedNote.title}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    throw new CustomException('Note ID required');
  }

  // Confirm note exists to delete
  const note = await Note.findById(id).exec();

  if (!note) {
    throw new CustomException('Note not found');
  }

  const result = await note.deleteOne();

  const reply = `Note '${result.title}' with ID ${result._id} deleted`;

  return res.json(reply);
};

export { getAllNotes, createNewNote, updateNote, deleteNote };
