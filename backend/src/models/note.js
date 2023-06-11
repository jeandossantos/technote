import mongoose, { Schema } from 'mongoose';
import mongoSequence from 'mongoose-sequence';

const AutoIncrement = mongoSequence(mongoose);

const noteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: 'Employee',
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

const Note = mongoose.model('Note', noteSchema);

export { Note };
