document.addEventListener("DOMContentLoaded", function () {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Filter only sellers
    let sellers = users.filter(user => user.role == 0);

    const sellersList = document.getElementById("sellers-list");

    if (sellers.length === 0) {
        sellersList.innerHTML = "<p>אין מוכרים זמינים</p>";
    } else {
        sellers.forEach(seller => {
            const sellerDiv = document.createElement("div");
            sellerDiv.classList.add("seller");

            sellerDiv.innerHTML = `
                <h3>${seller.displayName}</h3>
                <p>${seller.email}</p>
                <button onclick="redirectToSeller(${seller.id})">עבור לחנות</button>
            `;

            sellersList.appendChild(sellerDiv);
        });
    }
});

// Make the function globally available
window.redirectToSeller = function (sellerId) {
    window.location.href = `index.html?sellerId=${sellerId}`;
};
