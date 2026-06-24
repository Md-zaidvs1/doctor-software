import { useEffect, useState } from "react";

export default function CategoryForm({
  onSubmit,
  editingCategory,
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        slug: editingCategory.slug || "",
        description: editingCategory.description || "",
      });
    }
  }, [editingCategory]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);

    if (!editingCategory) {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Category Name"
        value={formData.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="slug"
        placeholder="Slug"
        value={formData.slug}
        onChange={handleChange}
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <button type="submit">
        {editingCategory ? "Update Category" : "Add Category"}
      </button>
    </form>
  );
}