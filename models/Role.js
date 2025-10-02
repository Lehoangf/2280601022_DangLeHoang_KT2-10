const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: "",
    trim: true
  },
  isDelete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index for better performance
roleSchema.index({ name: 1 });
roleSchema.index({ isDelete: 1 });

// Virtual for role ID
roleSchema.virtual('roleId').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
roleSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Role', roleSchema);