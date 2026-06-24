import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import CategoryList from "../components/categories/CategoryList";
import CategoryForm from "../components/categories/CategoryForm";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
        setEditingCategory(null);
      } else {
        await createCategory(formData);
      }

      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this category?"
      );

      if (!confirmed) return;

      await deleteCategory(id);

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Category Management</h2>

      <CategoryForm
        onSubmit={handleCreateOrUpdate}
        editingCategory={editingCategory}
      />

      <br />

      <CategoryList
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}