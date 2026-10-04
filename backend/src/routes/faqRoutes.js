const express = require('express');
const router = express.Router();
const { addFaq, getAllFaqs, getFaqById, updateFaq, deleteFaq } = require('../controller/faqController');

// FAQ routes
router.post('/', addFaq);
router.get('/', getAllFaqs);
router.get('/:id', getFaqById);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

module.exports = router;