const AddInterview = require('../schema/interview');
const path = require('path');
const fs = require('fs');

// Add Interview
const addInterview = async (req, res) => {
  try {
    const { Name, CompanyName, Description, Position, CompanyURL } = req.body;
    const Image = req.file ? req.file.filename : null;

    const newInterview = new AddInterview({
      Name,
      CompanyName,
      Description,
      Position,
      CompanyURL,
      Image
    });

    await newInterview.save();
    res.status(201).json({ message: 'Interview added successfully', interview: newInterview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding interview' });
  }
};

// Function to get the total count of interviews
const getInterviewsCount = async (req, res) => {
    try {
        // This Mongoose method counts the total documents.
        const count = await AddInterview.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//  Get All Interviews
const getAllInterviews = async (req, res) => {
  try {
    const interviews = await AddInterview.find().sort({ createdAt: -1 });
    res.status(200).json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching interviews' });
  }
};


// Get Single Interview by ID  <--- ADD THIS NEW FUNCTION
const getInterviewById = async (req, res) => {
  try {
    const interview = await AddInterview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    console.error('Error fetching single interview:', error);
    // Handle invalid MongoDB ID format specifically if needed
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid interview ID format' });
    }
    res.status(500).json({ message: 'Error fetching interview' });
  }
};

//  Edit Interview
const editInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, CompanyName, Description, Position, CompanyURL } = req.body;

    const existingInterview = await AddInterview.findById(id);
    if (!existingInterview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // 🛠 If a new image was uploaded, delete old one
    let updatedImage = existingInterview.Image;
    if (req.file) {
      if (existingInterview.Image) {
        const oldPath = path.join(__dirname, '../uploads/interviews', existingInterview.Image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      updatedImage = req.file.filename;
    }

    const updatedData = {
      Name,
      CompanyName,
      Description,
      Position,
      CompanyURL,
      Image: updatedImage, //  Keep old image if no new upload
    };

    const updatedInterview = await AddInterview.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Interview updated successfully', interview: updatedInterview });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating interview' });
  }
};


//  Delete Interview
const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await AddInterview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    //  Correct folder name here: "interviews"
    if (interview.Image) {
      const imagePath = path.join(__dirname, '../uploads/interviews', interview.Image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await AddInterview.findByIdAndDelete(id);
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Error deleting interview' });
  }
};

module.exports = {
  addInterview,
  getAllInterviews,
  editInterview,
  deleteInterview,
  getInterviewById,
  getInterviewsCount
};
