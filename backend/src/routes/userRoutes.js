const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('../controller/userController');
const {
  addInterview,
  getAllInterviews,
  editInterview,
  deleteInterview,
  getInterviewById,
  getInterviewsCount
} = require('../controller/userinterview');

const upload = require('../controller/uploadinterview');
// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.put('/:id', updateUser);     
router.delete('/:id', deleteUser); 

// Interview routes
router.post('/addInterview', upload.single('Image'), addInterview);
router.get('/interviews/count', getInterviewsCount);
router.get('/interviews', getAllInterviews);
router.get('/interviews/:id', getInterviewById);
router.put('/updateinterview/:id', upload.single('Image'), editInterview); // <-- Changed from .patch to .put
router.delete('/interviews/:id', deleteInterview); 
module.exports = router;
