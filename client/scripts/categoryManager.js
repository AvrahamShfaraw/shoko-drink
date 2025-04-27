import agent from "../api/agent.js";
import { loadHeader } from "../utils/navbar.js";

document.addEventListener("DOMContentLoaded", async () => {
    await loadHeader();

    const categoryList = document.getElementById("category-list");
    const form = document.getElementById("add-category-form");
    const input = document.getElementById("category-name");

    let editMode = false;
    let editingId = null;

    const fetchCategories = async () => {
        const categories = await agent.Categories.list();
        categoryList.innerHTML = "";
        categoryList.style = "max-width: 700px; width: 90%";

        categories.forEach(cat => {
            const div = document.createElement("div");
            div.classList.add("category-item");
            div.dir = "rtl";

            div.innerHTML = `
                <span>${cat.name}</span>
                <div>
                    <button data-id="${cat.id}" class="edit-btn remove-from-cart">
                        <img src="../assets/edit.svg" alt="Edit" class="action-icon">
                    </button>
                    <button data-id="${cat.id}" class="delete-btn remove-from-cart">
                        <img src="../assets/delete.svg" alt="Delete" class="action-icon">
                    </button>
                </div>
            `;

            categoryList.appendChild(div);
        });
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = input.value.trim();
        if (!name) return;

        if (editMode && editingId) {
            await agent.Categories.update(editingId, { name });
            editMode = false;
            editingId = null;
        } else {
            await agent.Categories.create({ name });
        }

        input.value = "";
        fetchCategories();
    });

    categoryList.addEventListener("click", async (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        const editBtn = e.target.closest(".edit-btn");

        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            await agent.Categories.delete(id);
            fetchCategories();
        }

        if (editBtn) {
            const id = editBtn.dataset.id;
            const categoryDiv = editBtn.closest(".category-item");
            const nameSpan = categoryDiv?.querySelector("span");

            if (nameSpan) {
                input.value = nameSpan.textContent.trim();
                editMode = true;
                editingId = id;
            }
        }
    });

    fetchCategories();
});
