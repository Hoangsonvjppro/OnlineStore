// Get amount product
function getAmoumtProduct() {
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    return products.length;
}

// Get amount user
function getAmoumtUser() {
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : [];
    return accounts.length;
}

// Get amount order
function getMoney() {
    let tongtien = 0;
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];

    orders.forEach(item => {
        // Check if item.total exists and if item.trangthai is true (or truthy)
        if (item.total !== undefined && item.trangthai == 1) {
            tongtien += item.total;
        }
    });

    return tongtien;
}

document.getElementById("amount-user").innerHTML = getAmoumtUser();
document.getElementById("amount-product").innerHTML = getAmoumtProduct();
document.getElementById("doanh-thu").innerHTML = vnd(getMoney());

// Doi sang dinh dang tien VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}