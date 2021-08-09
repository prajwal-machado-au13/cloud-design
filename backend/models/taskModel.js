import mongoose from 'mongoose'
// Title (text)
// o Description (text)
// o Media (can upload jpeg, png, gif, pdf)
// o Status (ENUM [Open, In-Progress, Completed])
// o Datetime stamp (timestamp)

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'InProgress', 'Completed'],
      // required: true,
      default: 'Open',
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model('Task', taskSchema)
export default Task
