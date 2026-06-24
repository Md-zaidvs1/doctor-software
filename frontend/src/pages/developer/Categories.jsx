import React from "react";

const Categories = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Category Management</h2>

      <button>Add Category</button>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Dental</td>
            <td>dental</td>
            <td>Dental Clinic</td>
            <td>Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Categories;