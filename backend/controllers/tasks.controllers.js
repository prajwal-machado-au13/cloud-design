import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import Task from '../models/taskModel.js'

/*
@desc    Fetch all tasks
@route   GET /api/v1/tasks
*/
export const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({})
  res.json(tasks)
})

/*
@desc Post the task related data
@route POST /api/v1/tasks
 */

export const postTask = asyncHandler(async (req, res) => {
  const { title, description, media, status } = req.body
  const task = new Task({
    title,
    description,
    media: req.resultantUrlCloud,
    status,
  })
  await task.save()

  res.status(201).json({
    task,
  })
})
/*
@desc GET the specific task related data
@route GET /api/v1/tasks/:id
*/

export const getTaskByID = asyncHandler(async (req, res) => {
  const id = req.params.id
  const task = await Task.findOne({ _id: id })
  if (task) {
    res.json(task)
  } else {
    res.status(404)
    throw new Error('Task not found')
  }
})

/*
@desc Update the specific task details
@route PUT /api/v1/tasks/:id
 */

export const updateTaskDetails = asyncHandler(async (req, res) => {
  // const updates = Object.keys(req.body)
  // const allowedUpdates = ['description', 'media']
  const { id } = req.params
  const { title, description, media } = req.body

  //updated image url
  const task = await Task.findOne({ _id: id })
  let mediaUrl = task.media
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id${id}`)
  // updates.forEach((update) => (task[update] = req.body[update]))
  // await task.save()
  const updatedTaskDetails = {
    _id: id,
    title,
    description,
    media: req.resultantUrlCloud ? req.resultantUrlCloud : mediaUrl,
  }
  await Task.findByIdAndUpdate(id, updatedTaskDetails, { new: true })
  if (!updatedTaskDetails) {
    res.status(404)
    throw new Error('Task not found')
  }
  res.send(updatedTaskDetails)
})

/*
@desc Update the status of specific task details
@route PUT /api/v1/tasks/:id
 */
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const task = await Task.findOne({ _id: id })
  const updatableValues = ['status']
  const isValidUpdate = updatableValues.every((update) =>
    updatableValues.includes(update)
  )
  if (!isValidUpdate) {
    res.status(401)
    throw new Error('Not a valid status update')
  }
  const updateStatus = {
    _id: id,
    title: task.title,
    description: task.description,
    media: task.media,
    status: status,
  }
  const updatedStatus = await Task.findByIdAndUpdate(id, updateStatus, {
    new: true,
  })
  if (!updateStatus) {
    res.status(401)
    throw new Error('Task not found')
  }
  res.send(updatedStatus)
})
/*
@desc Delete the task details
@route PUT /api/v1/tasks/:id
 */
export const deleteTaskById = asyncHandler(async (req, res) => {
  const id = req.params.id
  const deletedTask = await Task.findOneAndDelete({ _id: id })
  if (!deletedTask) {
    res.status(404)
    throw new Error('Task not found')
  }
  res.send(deletedTask)
})
