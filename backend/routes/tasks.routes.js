import express from 'express'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
const router = express.Router()
import {
  getTasks,
  postTask,
  getTaskByID,
  deleteTaskById,
  updateTaskDetails,
  updateTaskStatus,
} from '../controllers/tasks.controllers.js'

dotenv.config()
//cloudinary cloud configuration
const cloud = cloudinary.v2
cloud.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

const upload = async (req, res, next) => {
  if (req.files) {
    // console.log(req.files)
    if (
      req.files.media.mimetype === 'image/jpeg' ||
      'image/png' ||
      'image/gif' ||
      'application/pdf'
    ) {
      const file = req.files.media
      let result = await cloud.uploader.upload(file.tempFilePath)
      req.resultantUrlCloud = result.url
      return next()
    }
    //415 Unsupported Media Type client error response code
    res.status(415)
    throw new Error(
      'please upload single image file in jpg/ jpeg, png, gif, pdf format'
    )
  }
}

/*
@desc    Fetch all tasks
@route   GET /api/v1/tasks
 */
router.route('/').post(upload, postTask)
/*
@desc    Fetch all tasks
@route   GET /api/v1/tasks
 */

router.route('/').get(getTasks)

// @desc    Fetch single task
// @route   GET /api/v1/tasks/:id
// router.route('/:id').get(getTaskById)

router.route('/:id').get(getTaskByID)

/*
@desc Update the specific task details (desc,media)
@route PUT /api/v1/tasks/:id
*/
router.route('/:id').put(upload, updateTaskDetails)

/*
@desc Update the status of specific task details
@route PUT /api/v1/tasks/:id
 */
router.route('/:id').patch(updateTaskStatus)

/*
@desc Delete the task details
@route PUT /api/v1/tasks/:id
 */
router.route('/:id').delete(deleteTaskById)

export default router
