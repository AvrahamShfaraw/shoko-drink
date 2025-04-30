import { store } from "../stores/store.js";
import { getLoggedInUser, showPopup } from "./global.js";


const orderStore = store.orderStore;; // Get the order store instance
const { loadOrders, orderRegistry, getOrderList, loadOrder, updateStatus, getOrder } = orderStore;


export async function loadOrdersData() {
    if (orderRegistry.size <= 1) {
        await loadOrders();
    } else {
        console.log("orders already loaded.");
    }
}

// Get orders
export function getOrders() {
    return getOrderList();
}


// Display orders history
export function displayOrders() {
    const ordersContainer = document.getElementById("orders-list");
    if (!ordersContainer) return;


    const user = getLoggedInUser();


    if (!user) {
        document.location.href = "https://avrahamshfaraw.github.io/shoko-drink/client/pages/index.html";

    }

    const userId = user.phoneNumber;
    const role = user.role;

    let orders = getOrders();

    const userOrders = role === 0 ? orders : orders.filter(order => order.customer.phoneNumber === userId);


    ordersContainer.innerHTML = "";
    ordersContainer.dir = "rtl";


    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `<p>אין הזמנות עדיין.</p>`;
        return;
    }

    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));


    userOrders.forEach(order => {
        const orderDate = new Date(order.date).toLocaleString("he-IL", {
            weekday: "long",    // יום בשבוע (רביעי)
            day: "numeric",     // יום (30)
            month: "long",      // חודש כתוב (אפריל)

        });

        const orderTotal = order.totalPrice.toFixed(2) || "0.00";



        const orderHTML = `
            <div class="order" >
                <div style="margin-bottom: 8px;">
                     <a href="https://avrahamshfaraw.github.io/shoko-drink/client/pages/orderDetails.html?orderId=${order.id}" style="color: black; display: flex; justify-content: space-between; align-items: center;">
                        <span class="order-label">הזמנה ${order.id.split('-').pop()}</span>
                        <span class="order-details">פרטי הזמנה &rsaquo;</span>
                    </a>
                </div>
                
        <div style="display: flex; align-items: center; justify-content: space-between;" >

            <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
                <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/calendar.svg" alt="Calendar" style="width: 16px; margin-left: 8px;">
                <label>תאריך: ${orderDate}</label>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
                <label style="color: var(--primary-color);">₪${orderTotal}</label>
            </div>

            
        </div>
    </div>
        `;

        ordersContainer.innerHTML += orderHTML;
    });
}


// Display order details
export async function displayOrderDetails() {
    const orderId = new URLSearchParams(window.location.search).get("orderId");
    document.getElementById("orders-list").dir = "rtl";

    const user = getLoggedInUser();

    if (!user) {
        document.location.href = "https://avrahamshfaraw.github.io/shoko-drink/client/pages/index.html";

    }
    if (!orderId) {
        document.location.href = "https://avrahamshfaraw.github.io/shoko-drink/client/pages/index.html";
    }


    const role = user.role;


    const order = await loadOrder(orderId);

    if (!order) {
        document.getElementById("orders-list").innerHTML = "<p>ההזמנה לא קיימת.</p>";
        return;
    }


    const customer = order.customer;
    const orderDate = new Date(order.date).toLocaleString("he-IL", {
        weekday: "long",    // יום בשבוע (רביעי)
        day: "numeric",     // יום (30)
        month: "long",      // חודש כתוב (אפריל)

    });
    const orderTotal = order.totalPrice.toFixed(2);
    const orderStatus = order.status || "ממתין לאישור";


    const statusHtml = role === 0
        ? `
<div style="display: flex; align-items: center; justify-content: space-between;" >
     <div style="display: flex; align-items: center; margin-bottom: 12px; font-weight: bold;">
        <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/clock.svg" alt="Status" style="width: 16px; margin-left: 8px;">
        <label>סטטוס: ${orderStatus}</label>
    </div>

    <div style="display: flex; align-items: center; margin-bottom: 4px; ">
        <select id="status-${order.id}" data-order-id="${order.id}" class="status-dropdown" style="padding: 4px 8px; border-radius: 6px; border: 1px solid #ccc;">      
        <option value="בטיפול" ${order.status === 'בטיפול' ? 'selected' : ''}>בטיפול</option>
        <option value="יצא למשלוח" ${order.status === 'יצא למשלוח' ? 'selected' : ''}>יצא למשלוח</option>
        <option value="סופק" ${order.status === 'סופק' ? 'selected' : ''}>סופק</option>
        <option value="בוטל" ${order.status === 'בוטל' ? 'selected' : ''}>בוטל</option>
        </select>
    </div>


 </div>
`
        : `
<div style="display: flex; align-items: center; margin-bottom: 12px; font-weight: bold;">
    <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/clock.svg" alt="Status" style="width: 16px; margin-left: 8px;">
    <label>סטטוס: ${orderStatus}</label>
</div>
`;


    const html = `
    <div class="order" >
        <div style="display: flex; align-items: center; justify-content: space-between;" >

            <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
                <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/calendar.svg" alt="Calendar" style="width: 16px; margin-left: 8px;">
                <label>תאריך: ${orderDate}</label>
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
                <label style="color: var(--primary-color);">₪${orderTotal}</label>
            </div>

        </div>
        
        <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
            <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/user.svg" alt="Customer" style="width: 16px; margin-left: 8px;">
            <label>לקוח: ${customer.displayName}</label>
        </div>

        <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
    <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/phone.svg" alt="Customer" style="width: 16px; margin-left: 8px;">
    <a href="https://wa.me/972${customer.phoneNumber}" target="_blank" style="color: inherit; text-decoration: none;">
        טלפון: ${customer.phoneNumber}
    </a>
</div>


      <div style="display: flex; align-items: center; margin-bottom: 4px; font-weight: bold;">
    <img src="https://avrahamshfaraw.github.io/shoko-drink/client/assets/marker.svg" alt="Address" style="width: 16px; margin-left: 8px;">
    <a href="https://waze.com/ul?q=${encodeURIComponent(order.address)}" target="_blank" style="color: inherit; text-decoration: none;">
        כתובת: ${order.address}
    </a>
</div>


        ${statusHtml}
        
        <h4>מוצרים:</h4>
        <ul>
            ${order.products.map(p => `
                <li style="display: flex; align-items: center; margin-bottom: 8px;">
                    <img src="${p.product.image}" alt="${p.product.name}" class="order-product-image">
                    <div>
                    <div>
                        <strong>${p.product.name}</strong>
                    </div>
                    <div >
                         ₪${p.product.price} × ${p.quantity}
                    </div>
                    </div>
                </li>
            `).join('')}
        </ul>
    </div>
    `;

    document.getElementById("orders-list").innerHTML = html;
}



document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("status-dropdown")) {
        const id = e.target.dataset.orderId;
        const status = e.target.value;

        try {
            await updateStatus({ id, status });
            await displayOrderDetails();

            const order = getOrder(id);

            const phone = order.customer.phoneNumber.replace(/^0/, '972'); // מחליף 0 בתחילת המספר
            const name = order.customer.displayName;
            const address = order.address;

            const productsList = order.products.map(p => `• ${p.product.name} x${p.quantity}`).join('\n');

            const totalPrice = order.products.reduce((sum, p) => sum + (p.product.price * p.quantity), 0);
            const orderLink = `https://avrahamshfaraw.github.io/shoko-drink/client/pages/orderDetails.html?orderId=${order.id}`;
            let message;

            switch (status) {
                case "בטיפול":
                    message =
                        `שלום ${name} 👋
            הזמנתך בטיפול ✅
            
           🔗 צפייה בפרטי ההזמנה: ${orderLink}

            
            📍 כתובת למשלוח:
            ${address}
            
            🛒 פרטי הזמנה:
            ${productsList}
            
            💵 סה"כ לתשלום: ${totalPrice} ₪
            
            נעדכן אותך ברגע שההזמנה תצא אליך! 🍫🛵`;
                    break;

                case "יצא למשלוח":
                    message =
                        `שלום ${name} 👋
            הזמנתך עודכנה לסטטוס: *${status}*
            
           🔗 צפייה בפרטי ההזמנה: ${orderLink}

            
            📍 כתובת למשלוח:
            ${address}
            
            🛒 פרטי הזמנה:
            ${productsList}
            
            💵 סה"כ לתשלום: ${totalPrice} ₪
            
            ⏱️ זמן אספקה משוער: עד 30 דקות 🛵💨
            
            🛵 שוקו דרינק - משלוח מהיר של אלכוהול, חטיפים, סיגריות ועוד! 🚀`;
                    break;

                case "סופק":
                    message =
                        `שלום ${name} 👋
            שמחים לעדכן כי ההזמנה שלך סופקה בהצלחה! 🎉
            
           🔗 צפייה בפרטי ההזמנה: ${orderLink}

            
            תודה שהזמנת משוקו דרינק 🍫🚀
            נשמח לראותך שוב! 🙌`;
                    break;

                case "בוטל":
                    message =
                        `שלום ${name} 👋
            הזמנתך בוטלה בהתאם לבקשתך או עקב בעיה.
            
           🔗 צפייה בפרטי ההזמנה: ${orderLink}

            
            לפרטים נוספים ניתן ליצור קשר.`;
                    break;
            }



            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${phone}?text=${encodedMessage}`;
            window.open(whatsappURL, "_blank");

        } catch (err) {
            showPopup("שגיאה בעדכון הסטטוס ❌");
            console.error(err);
        }
    }
});




