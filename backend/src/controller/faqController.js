const FAQ = require('../schema/faq');

// Add a new FAQ
const addFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: 'Both question and answer are required.' });
    }

    const newFaq = new FAQ({ question, answer });
    await newFaq.save();
    res.status(201).json({ message: 'FAQ added successfully', faq: newFaq });
  } catch (error) {
    console.error('Error adding FAQ:', error);
    res.status(500).json({ message: 'Error adding FAQ.' });
  }
};

// Get all FAQs
const getAllFaqs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.status(200).json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Error fetching FAQs.' });
  }
};

// Get a single FAQ by ID
const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }
    res.status(200).json(faq);
  } catch (error) {
    console.error('Error fetching FAQ by ID:', error);
    res.status(500).json({ message: 'Error fetching FAQ.' });
  }
};

// Update an existing FAQ
const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ message: 'Both question and answer are required.' });
    }

    const updatedFaq = await FAQ.findByIdAndUpdate(id, { question, answer }, { new: true, runValidators: true });
    if (!updatedFaq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }

    res.status(200).json({ message: 'FAQ updated successfully', faq: updatedFaq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Error updating FAQ.' });
  }
};

// Delete an FAQ
const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFaq = await FAQ.findByIdAndDelete(id);
    if (!deletedFaq) {
      return res.status(404).json({ message: 'FAQ not found.' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Error deleting FAQ.' });
  }
};

module.exports = {
  addFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
};