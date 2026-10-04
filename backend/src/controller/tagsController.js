const Tag = require("../schema/tagsSchema");

exports.createTag = async (req, res) => {
  try {
    const tag = new Tag({ name: req.body.name });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTags = async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.json(tags);
};

exports.updateTag = async (req, res) => {
  try {
    const updated = await Tag.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: "Tag deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
