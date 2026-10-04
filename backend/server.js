const express = require("express");
const userRoutes = require("./src/routes/userRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const blogRoutes = require('./src/routes/blogRoutes');
const cors = require("cors");
const categoryRoutes = require("./src/routes/categoryRoutes");
const tagRoutes = require("./src/routes/tagsRoutes");
const serviceRoutes = require('./src/routes/serviceRoutes');
const serviceCategoryRoutes = require('./src/routes/serviceCategoryRoutes');
const faqRoutes = require('./src/routes/faqRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
dotenv.config();

const app = express();
// inside your Express backend (server.js or app.js)
app.get("/ping", (req, res) => {
  res.status(200).send("OK");
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.use('/api', userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', serviceRoutes);
app.use("/api/servicecategories", serviceCategoryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', dashboardRoutes);
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err))
.then(() => {
  console.log("MongoDB Connected Successfully", mongoose.connection.name);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server started on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});