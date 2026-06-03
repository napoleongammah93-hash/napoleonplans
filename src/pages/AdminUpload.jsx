import React, { useState } from "react";
import "../styles/AdminUpload.css";

export default function AdminUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "residential",
    architect_name: "",
    email: "",
    image: null,
    pdf_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "residential",
    "commercial",
    "industrial",
    "mixed-use",
    "hospitality",
    "healthcare",
    "educational",
    "sports",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        setErrorMessage("Please upload a valid PDF file");
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage("PDF file must be less than 50MB");
        return;
      }

      setFormData((prev) => ({ ...prev, pdf_file: file }));
    }
  };

  const validateForm = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.price ||
      !formData.architect_name ||
      !formData.email ||
      !formData.image ||
      !formData.pdf_file
    ) {
      setErrorMessage("Please fill in all required fields");
      return false;
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      setErrorMessage("Please enter a valid price");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("price", formData.price);
      uploadFormData.append("category", formData.category);
      uploadFormData.append("architect_name", formData.architect_name);
      uploadFormData.append("email", formData.email);
      uploadFormData.append("image", formData.image);
      uploadFormData.append("pdf_file", formData.pdf_file);

      const response = await fetch(
        "http://localhost/napoleonplans/api/upload_design.php",
        {
          method: "POST",
          body: uploadFormData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          "Design uploaded successfully! Your design is now visible on the marketplace."
        );
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "residential",
          architect_name: "",
          email: "",
          image: null,
          pdf_file: null,
        });
        setImagePreview(null);
      } else {
        setErrorMessage(data.message || "Failed to upload design");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-upload-page">
      {/* HERO SECTION */}
      <section className="upload-hero">
        <div className="upload-hero-content">
          <h1>🏗️ Upload Your Design</h1>
          <p>Share your architecture designs and start earning with NapoleonPlans</p>
        </div>
      </section>

      {/* UPLOAD FORM SECTION */}
      <section className="upload-section">
        <div className="upload-container">
          {/* FORM */}
          <div className="upload-form-wrapper">
            <h2>Upload Architecture Design</h2>
            <p className="upload-subtitle">
              Fill in the details below and upload your design files
            </p>

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="upload-form">
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Design Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Modern Villa Design"
                  className="form-input"
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your design details, features, dimensions, etc."
                  rows="4"
                  className="form-input"
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() +
                        cat.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Price (MWK) *</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 50000"
                  min="1"
                  className="form-input"
                />
              </div>

              {/* Architect Name */}
              <div className="form-group">
                <label htmlFor="architect_name">Your Name *</label>
                <input
                  id="architect_name"
                  type="text"
                  name="architect_name"
                  value={formData.architect_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>

              {/* Image Upload */}
              <div className="form-group">
                <label htmlFor="image">Design Image *</label>
                <div className="file-input-wrapper">
                  <input
                    id="image"
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                    className="file-input"
                  />
                  <span className="file-input-label">
                    {formData.image ? formData.image.name : "Choose image..."}
                  </span>
                </div>
                <p className="file-note">JPG, PNG up to 5MB</p>

                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              {/* PDF Upload */}
              <div className="form-group">
                <label htmlFor="pdf_file">Design Plans (PDF) *</label>
                <div className="file-input-wrapper">
                  <input
                    id="pdf_file"
                    type="file"
                    name="pdf_file"
                    onChange={handlePdfChange}
                    accept=".pdf"
                    required
                    className="file-input"
                  />
                  <span className="file-input-label">
                    {formData.pdf_file ? formData.pdf_file.name : "Choose PDF..."}
                  </span>
                </div>
                <p className="file-note">PDF files up to 50MB</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="upload-submit-btn"
              >
                {loading ? "Uploading..." : "Upload Design"}
              </button>
            </form>
          </div>

          {/* INFO SECTION */}
          <div className="upload-info-section">
            <h3>📋 Upload Guidelines</h3>

            <div className="info-card">
              <h4>✓ File Requirements</h4>
              <ul>
                <li>Image: JPG or PNG, max 5MB</li>
                <li>Plans: PDF format, max 50MB</li>
              </ul>
            </div>

            <div className="info-card">
              <h4>✓ Design Details</h4>
              <ul>
                <li>Clear title and description</li>
                <li>Accurate pricing in MWK</li>
                <li>Proper category selection</li>
                <li>High-quality images</li>
              </ul>
            </div>

            <div className="info-card">
              <h4>✓ After Upload</h4>
              <ul>
                <li>Design appears on marketplace</li>
                <li>Clients can view and purchase</li>
                <li>You receive notifications</li>
                <li>Instant payment processing</li>
              </ul>
            </div>

            <div className="info-card featured">
              <h4>🎯 Pro Tip</h4>
              <p>
                Upload high-quality images and detailed descriptions for better
                visibility and higher chances of sales!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
