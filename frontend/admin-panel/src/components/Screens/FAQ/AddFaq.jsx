// src/components/FAQ/AddFaq.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import '../../Styles/Faq/AddFaq.css'; 

const AddFaq = ({ onClose, fetchFaqs, editingFaq }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (editingFaq) {
      setQuestion(editingFaq.question);
      setAnswer(editingFaq.answer);
    }
  }, [editingFaq]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || !answer) {
      toast.error("Both question and answer are required.");
      return;
    }

    const faqData = { question, answer };
    const apiUrl = editingFaq
      ? `http://localhost:5000/api/faqs/${editingFaq._id}`
      : "http://localhost:5000/api/faqs";
    const method = editingFaq ? "PUT" : "POST";
    const successMessage = editingFaq ? "FAQ updated successfully!" : "FAQ added successfully!";
    const failureMessage = editingFaq ? "Failed to update FAQ." : "Failed to add FAQ.";

    try {
      const res = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faqData),
      });

      if (res.ok) {
        toast.success(successMessage);
        fetchFaqs();
        onClose();
      } else {
        toast.error(failureMessage);
      }
    } catch (error) {
      console.error("Error submitting FAQ:", error);
      toast.error(failureMessage);
    }
  };

  return (
    <div className="faq-popup-overlay">
      <form onSubmit={handleSubmit} className="faq-modal-container">
        <div className="faq-modal-header">
          <h2>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</h2>
          <span className="faq-modal-close" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="faq-form-group">
          <label htmlFor="question">Enter the question:</label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>
        <div className="faq-form-group">
          <label htmlFor="answer">Enter an answer for it:</label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>
        <button type="submit" className="faq-submit-btn">
          {editingFaq ? "Update FAQ" : "Add FAQ"}
        </button>
      </form>
    </div>
  );
};

export default AddFaq;