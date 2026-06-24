export default function CategoryList({
  categories,
  onDelete,
  onEdit,
}) {
  return (
    <table border="1" cellPadding="10" width="100%">
      <thead>
        <tr>
          <th>Name</th>
          <th>Slug</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {categories.map((category) => (
          <tr key={category._id}>
            <td>{category.name}</td>
            <td>{category.slug}</td>
            <td>
              {category.isActive ? "Active" : "Inactive"}
            </td>
            <td>
              <button
                onClick={() => onEdit(category)}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  onDelete(category._id)
                }
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}