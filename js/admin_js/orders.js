// Đổi trạng thái đơn hàng
function changeStatus(id, el) {
    let orders = JSON.parse(localStorage.getItem("hoadon"));
    let order = orders.find((item) => {
        return item.id == id;
    });
    order.trangthai = 1;
    el.classList.remove("btn-chuaxuly");
    el.classList.add("btn-daxuly");
    el.innerHTML = "Đã xử lý";
    localStorage.setItem("hoadon", JSON.stringify(orders));
    findOrder(orders);
}

// Show order
function showOrder(arr) {
    let orderHtml = "";
    if (arr.length == 0) {
        orderHtml = `<td colspan="6">Không có dữ liệu</td>`
    } else {
        arr.forEach((item) => {
            let status = item.trangthai == 0 ? `<span class="status-no-complete">Chưa xử lý</span>` : `<span class="status-complete">Đã xử lý</span>`;
            let date = formatDate(item.date);
            orderHtml += `
            <tr>
            <td>${item.id}</td>
            <td>${item.user.username}</td>
            <td>${date}</td>
            <td>${vnd(item.total)}</td>                               
            <td>${status}</td>
           <td class="control">
            <button class="btn-detail" id="" onclick="detailOrder('${item.id}')"><i class="fa-solid fa-eye"></i> Chi tiết</button>
            </td>
            </tr>      
            `;
        });
    }
    document.getElementById("showOrder").innerHTML = orderHtml;
}

let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
window.onload = showOrder(orders);

// Hàm lấy chi tiết đơn hàng
function getOrderDetails(madon) {
    let orderDetails = localStorage.getItem("hoadon") ?
        JSON.parse(localStorage.getItem("hoadon")) : [];
    let ctDon = [];
    orderDetails.forEach((order) => {
        if (order.id == madon) {
            ctDon.push(...order.items);
        }
    });
    return ctDon;
}
// Hàm tính ngày kết thúc
function calculateEndDate(startDate, daysToAdd) {
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + daysToAdd);
    return endDate;
}

// Hàm hiển thị chi tiết đơn hàng
function detailOrder(id) {
    document.querySelector(".modal.detail-order").classList.add("open");
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];

    // Lấy hóa đơn
    let order = orders.find((item) => item.id == id);

    // Lấy chi tiết hóa đơn
    let ctDon = getOrderDetails(id);

    let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;
    ctDon.forEach((item) => {
        let detaiSP = products.find(product => product.productid == item.id);
        if (detaiSP) {
            spHtml += `<div class="order-product">
                <div class="order-product-left">
                    <img src="${detaiSP.img}" alt="">
                    <div class="order-product-info">
                        <h4>${detaiSP.name}</h4>
                        <p class="order-product-quantity">SL: ${item.quantity}</p>
                    </div>
                </div>
                <div class="order-product-right">
                    <div class="order-product-price">
                        <span class="order-product-current-price">${vnd(item.quantity * detaiSP.price)}</span>
                    </div>                         
                </div>
            </div>`;
        }
    });
    spHtml += `</div></div>`;

    spHtml += `<div class="modal-detail-right">
        <ul class="detail-order-group">
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-calendar-days"></i> Ngày đặt hàng</span>
                <span class="detail-order-item-right">${formatDate(order.date)}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-user"></i> Người nhận</span>
                <span class="detail-order-item-right">${order.user.username}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-solid fa-phone"></i> Số điện thoại</span>
                <span class="detail-order-item-right">${order.user.numberphone}</span>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fa-solid fa-clock"></i> Thời gian giao</span>
                <p class="detail-order-item-b">${(order.date === "" ? "" : (formatDate(order.date) + " - ")) + formatDate(calculateEndDate(order.date, 3))}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fa-solid fa-location-dot"></i> Địa chỉ nhận</span>
                <p class="detail-order-item-b">${order.diachi}</p>
            </li>
        </ul>
    </div>`;

    document.querySelector(".modal-detail-order").innerHTML = spHtml;

    let classDetailBtn = order.trangthai == 0 ? "btn-chuaxuly" : "btn-daxuly";
    let textDetailBtn = order.trangthai == 0 ? "Chưa xử lý" : "Đã xử lý";
    document.querySelector(
        ".modal-detail-bottom"
    ).innerHTML = `<div class="modal-detail-bottom-left">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(order.total)}</span>
        </div>
    </div>
    <div class="modal-detail-bottom-right">
        <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus('${order.id}',this)">${textDetailBtn}</button>
    </div>`;
}

// Find Order
function findOrder() {
    let tinhTrang = parseInt(document.getElementById("tinh-trang").value);
    let ct = document.getElementById("form-search-order").value;
    let timeStart = document.getElementById("time-start").value;
    let timeEnd = document.getElementById("time-end").value;

    if (timeEnd < timeStart && timeEnd !== "" && timeStart !== "") {
        alert("Lựa chọn thời gian sai!");
        return;
    }

    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];

    // Lọc theo trạng thái
    let result = tinhTrang === 2 ? orders : orders.filter((item) => item.trangthai === tinhTrang);

    // Lọc theo từ khóa tìm kiếm
    result = ct === "" ? result : result.filter((item) =>
        item.user.toLowerCase().includes(ct.toLowerCase()) || item.id.toString().toLowerCase().includes(ct.toLowerCase())
    );

    // Lọc theo thời gian
    if (timeStart !== "" && timeEnd === "") {
        result = result.filter((item) => new Date(item.date) >= new Date(timeStart).setHours(0, 0, 0));
    } else if (timeStart === "" && timeEnd !== "") {
        result = result.filter((item) => new Date(item.date) <= new Date(timeEnd).setHours(23, 59, 59));
    } else if (timeStart !== "" && timeEnd !== "") {
        result = result.filter((item) =>
            new Date(item.date) >= new Date(timeStart).setHours(0, 0, 0) &&
            new Date(item.date) <= new Date(timeEnd).setHours(23, 59, 59)
        );
    }

    showOrder(result);
}




