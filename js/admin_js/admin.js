// // function checkLogin() {
// //     let currentUser = JSON.parse(localStorage.getItem("currentuser"));
// //     if(currentUser == null || currentUser.userType == 0) {
// //         document.querySelector("body").innerHTML = `<div class="access-denied-section">
// //             <img class="access-denied-img" src="./assets/img/access-denied.webp" alt="">
// //         </div>`
// //     } else {
// //         document.getElementById("name-acc").innerHTML = currentUser.username;
// //     }
// // }
// // window.onload = checkLogin();

const userlogin = JSON.parse(localStorage.getItem('userlogin'));

showUserName();
window.onload = function () {
    console.log('hihihi');
}



//do sidebar open and close
const menuIconButton = document.querySelector(".menu-icon-btn");
const sidebar = document.querySelector(".sidebar");
menuIconButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
});

// log out admin user

// let toogleMenu = document.querySelector(".profile");
// let mune = document.querySelector(".profile-cropdown");
// toogleMenu.onclick = function () {
//     mune.classList.toggle("active");
// };

// tab for section
const sidebars = document.querySelectorAll(".sidebar-list-item.tab-content");
const sections = document.querySelectorAll(".section");

for (let i = 0; i < sidebars.length; i++) {
    sidebars[i].onclick = function () {
        document.querySelector(".sidebar-list-item.active").classList.remove("active");
        document.querySelector(".section.active").classList.remove("active");
        sidebars[i].classList.add("active");
        sections[i].classList.add("active");
    };
}

const closeBtn = document.querySelectorAll('.section');
console.log(closeBtn[0])
for (let i = 0; i < closeBtn.length; i++) {
    closeBtn[i].addEventListener('click', (e) => {
        sidebar.classList.add("open");
    })
}

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
// Phân trang 
let perPage = 12;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = (currentPage - 1) * perPage + perPage;
    let productShow = productAll.slice(start, end);
    showProductArr(productShow);
}

function setupPagination(productAll, perPage) {
    document.querySelector('.page-nav-list').innerHTML = '';
    let page_count = Math.ceil(productAll.length / perPage);
    for (let i = 1; i <= page_count; i++) {
        let li = paginationChange(i, productAll, currentPage);
        document.querySelector('.page-nav-list').appendChild(li);
    }
}

function paginationChange(page, productAll, currentPage) {
    let node = document.createElement(`li`);
    node.classList.add('page-nav-item');
    node.innerHTML = `<a href="#">${page}</a>`;
    if (currentPage == page) node.classList.add('active');
    node.addEventListener('click', function () {
        currentPage = page;
        displayList(productAll, perPage, currentPage);
        let t = document.querySelectorAll('.page-nav-item.active');
        for (let i = 0; i < t.length; i++) {
            t[i].classList.remove('active');
        }
        node.classList.add('active');
    })
    return node;
}
function attachDeleteEvents() {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function (e) {
            const id = e.target.closest('button').dataset.id;
            console.log("Button clicked, ID:", id); // Kiểm tra ID sản phẩm
            deleteProduct(parseInt(id)); // Chuyển đổi ID sang số trước khi xóa
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
    attachDeleteEvents(); // Gán sự kiện click sau khi DOM đã tải
});

//Hiển thị danh sách sản phẩm 
function showProductArr(arr) {
    let productHtml = "";
    if (arr.length === 0) {
        productHtml = `<div class="no-result"><div class="no-result-i"><i class="fa-solid fa-face-sad-cry"></i></div><div class="no-result-h">Không có sản phẩm để hiển thị</div></div>`;
    } else {
        arr.forEach(product => {
            let btnCtl = product.status === 1
                ? `<button class="btn-delete" data-id="${product.productid}" data-action="delete"><i class="fa-solid fa-trash"></i></button>`
                : `<button class="btn-delete" data-id="${product.productid}" data-action="restore"><i class="fa-solid fa-eye"></i></button>`;
            productHtml += `
                <div class="list">
                    <div class="list-left">
                        <img src="${product.img}" alt="">
                        <div class="list-info">
                            <h4>${product.name}</h4>
                            <span class="list-category">${product.category}</span>
                        </div>
                    </div>
                    <div class="list-center">
                        <div class="list-detail">
                            <p class="power">Công Suất: ${product.power}</p>
                            <p class="size">Kích Thước: ${product.size}</p>
                            <p class="madeIn">Xuất Xứ: ${product.madein}</p>
                            <p class="namSx">Năm: ${product.year}</p>
                            <p class="baoHanh">Bảo Hành: 12 tháng</p>
                            <p class="hang">Hãng: ${product.brandid}</p>
                        </div>
                    </div>
                    <div class="list-right">
                        <div class="list-price">
                            <span class="list-current-price">${product.price} VND</span>
                        </div>
                        <div class="list-control">
                            <div class="list-tool">
                                <button class="btn-edit" onclick="editProduct('${product.productid}')"><i class="fa-solid fa-pen-to-square"></i></button>
                                ${btnCtl}
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    }
    document.getElementById("show-product").innerHTML = productHtml;
    attachDeleteEvents(); // Gọi hàm để gán sự kiện xóa sau khi HTML được cập nhật
}

function attachDeleteEvents() {
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function (e) {
            const id = e.target.closest('button').dataset.id;
            const action = e.target.closest('button').dataset.action;
            if (action === 'delete') {
                console.log("Delete button clicked, ID:", id); // Kiểm tra ID sản phẩm
                deleteProduct(parseInt(id)); // Chuyển đổi ID sang số trước khi xóa
            } else if (action === 'restore') {
                console.log("Restore button clicked, ID:", id); // Kiểm tra ID sản phẩm
                changeStatusProduct(parseInt(id)); // Chuyển đổi ID sang số trước khi khôi phục
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});



function showProduct() {
    let selectOp = document.getElementById('the-loai').value;
    let valeSearchInput = document.getElementById('form-search-product').value.trim();
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];

    let result;
    if (selectOp === "Tất cả") {
        result = products.filter(item => item.status === 1);
    } else if (selectOp === "Đã xóa") {
        result = products.filter(item => item.status === 0);
    } else {
        result = products.filter(item => item.category === selectOp && item.status === 1);
    }

    if (valeSearchInput) {
        result = result.filter(item => item.name.toUpperCase().includes(valeSearchInput.toUpperCase()));
    }

    showProductArr(result);
}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});



// function cancelSearchProduct() {
//     let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")).filter(item => item.status == 1) : [];
//     document.getElementById('the-loai').value = "Tất cả";
//     document.getElementById('form-search-product').value = "";
//     displayList(products, perPage, currentPage);
//     setupPagination(products, perPage, currentPage);
// }

function showUserName() {
    if (document.getElementById('name-acc')) document.getElementById('name-acc').innerText = userlogin.username;
}

// Hàm tạo ID sản phẩm mới
function createId(arr) {
    let id = arr.length ? Math.max(...arr.map(item => item.productid)) + 1 : 1;
    let check = arr.find((item) => item.productid == id);
    while (check != null) {
        id++;
        check = arr.find((item) => item.productid == id);
    }
    return id;
}


// Hàm thêm sản phẩm mới
function addProduct() {
    let products = JSON.parse(localStorage.getItem("productList")) || [];
    let categoryTmp = document.getElementById("chon-sanPham").value;
    let categoryText;
    switch (categoryTmp) {
        case 'Quạt đứng':
            categoryText = 'quatdung';
            break;
        case 'Quạt treo tuờng':
            categoryText = 'quattreotuong';
            break;
        case 'Quạt trần':
            categoryText = 'quattran';
            break;
        case 'Quạt lửng':
            categoryText = 'quatlung';
            break;
    }
    let newProduct = {
        productid: createId(products),
        name: document.getElementById("ten-sanPham").value,
        img: document.querySelector(".upload-image-preview").src,
        category: categoryText,
        price: parseInt(document.getElementById("gia-moi").value),
        madein: document.getElementById("madeIn").value,
        power: document.getElementById("power").value,
        size: document.getElementById("size").value,
        brandid: document.getElementById("hang").value,
        year: document.getElementById("year").value,
        status: 1
    };

    // Kiểm tra và đảm bảo tất cả các trường đều có giá trị
    if (
        newProduct.name && newProduct.img && newProduct.category &&
        newProduct.price && newProduct.madein && newProduct.power &&
        newProduct.size && newProduct.brandid && newProduct.year
    ) {
        products.push(newProduct);
        localStorage.setItem("productList", JSON.stringify(products));
        toast({ title: "Success", message: "Thêm sản phẩm thành công!", type: "success", duration: 3000 });
        setDefaultValue();
        showProduct();
        document.querySelector(".add-product").classList.remove("open");
    } else {
        toast({ title: "Warning", message: "Vui lòng điền đầy đủ thông tin!", type: "warning", duration: 3000 });
    }
}


// Nút "Cập nhật sản phẩm"
document.getElementById("add-product-button").addEventListener("click", (e) => {
    e.preventDefault();
    addProduct();
});

// Đảm bảo các sự kiện DOMContentLoaded được gán đúng cách
document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});

// Xóa sản phẩm 
function deleteProduct(id) {
    console.log("Attempting to delete product with ID:", id); // Kiểm tra ID sản phẩm
    const products = JSON.parse(localStorage.getItem("productList")) || [];
    const index = products.findIndex(item => item.productid === id);

    if (index !== -1 && confirm("Bạn có chắc muốn xóa?")) {
        products[index].status = 0; // Đánh dấu sản phẩm đã xóa
        localStorage.setItem("productList", JSON.stringify(products));
        showProduct(); // Cập nhật giao diện sau khi thay đổi trạng thái
    } else {
        console.error("Product not found or unable to delete");
    }
}


function changeStatusProduct(id) {
    let products = JSON.parse(localStorage.getItem("productList")) || [];
    let index = products.findIndex(item => item.productid === id);

    if (index !== -1 && confirm("Bạn có chắc chắn muốn khôi phục sản phẩm?")) {
        products[index].status = 1; // Đánh dấu sản phẩm đang hiển thị
        localStorage.setItem("productList", JSON.stringify(products));
        toast({ title: 'Success', message: 'Khôi phục sản phẩm thành công!', type: 'success', duration: 3000 });
        showProduct(); // Cập nhật lại danh sách sản phẩm
    }
}


var indexCur;
function editProduct(id) {
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    let index = products.findIndex(item => {
        return item.productid == id;
    });
    indexCur = index;
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "block";
    });
    document.querySelector(".add-product").classList.add("open");

    // Hiển thị ảnh sản phẩm
    document.querySelector(".upload-image-preview").src = products[index].img;
    document.getElementById("ten-sanPham").value = products[index].name;
    document.getElementById("gia-moi").value = products[index].price;
    document.getElementById("chon-sanPham").value = products[index].category;
    document.getElementById("size").value = products[index].size;
    document.getElementById("power").value = products[index].power;
    document.getElementById("hang").value = products[index].brandid;
    document.getElementById("madeIn").value = products[index].madein;
    document.getElementById("year").value = products[index].year;
}

function getPathImage(path) {
    let patharr = path.split("/");
    return "./hinhanh/quatdien/" + patharr[patharr.length - 1]
}

let btnUpdateProductIn = document.getElementById("update-product-button");
btnUpdateProductIn.addEventListener("click", (e) => {
    e.preventDefault();
    let products = JSON.parse(localStorage.getItem("productList"));
    let idProduct = products[indexCur].productid;
    let imgProduct = products[indexCur].img;
    let nameProduct = products[indexCur].name;
    let curProduct = products[indexCur].price;
    let categoryProduct = products[indexCur].category;
    let madeInProduct = products[indexCur].madein;
    let powerProduct = products[indexCur].power;
    let sizeProduct = products[indexCur].size;
    let yearProduct = products[indexCur].year;
    let brandProduct = products[indexCur].brandid;

    let imgProductCur = document.querySelector(".upload-image-preview").src;
    let nameProductCur = document.getElementById("ten-sanPham").value;
    let curProductCur = document.getElementById("gia-moi").value;
    let categoryTmp = document.getElementById("chon-sanPham").value;
    let categoryText;
    switch (categoryTmp) {
        case 'Quạt đứng':
            categoryText = 'quatdung';
            break;
        case 'Quạt treo tuờng':
            categoryText = 'quattreotuong';
            break;
        case 'Quạt trần':
            categoryText = 'quattran';
            break;
        case 'Quạt lửng':
            categoryText = 'quatlung';
            break;
    }
    let madeInProductCur = document.getElementById("madeIn").value;
    let powerProductCur = document.getElementById("power").value;
    let sizeProductCur = document.getElementById("size").value;
    let yearProductCur = document.getElementById("year").value;
    let brandProductCur = document.getElementById("hang").value;

    // Kiểm tra và đảm bảo các giá trị không bị null
    if (
        imgProductCur && nameProductCur && curProductCur && categoryText &&
        madeInProductCur && powerProductCur && sizeProductCur && yearProductCur && brandProductCur
    ) {
        let productadd = {
            productid: idProduct,
            name: nameProductCur,
            img: imgProductCur,
            category: categoryText,
            price: parseInt(curProductCur),
            madein: madeInProductCur,
            power: powerProductCur,
            size: sizeProductCur,
            brandid: brandProductCur,
            year: yearProductCur,
            status: 1,
        };
        products.splice(indexCur, 1);
        products.splice(indexCur, 0, productadd);
        localStorage.setItem("productList", JSON.stringify(products));
        toast({ title: "Success", message: "Sửa sản phẩm thành công!", type: "success", duration: 3000 });
        setDefaultValue();
        showProduct();
        // Đóng modal sau khi lưu thông tin
        document.querySelector(".add-product").classList.remove("open");
    } else {
        toast({ title: "Warning", message: "Vui lòng điền đầy đủ thông tin!", type: "warning", duration: 3000 });
    }
});

document.querySelector(".modal-close.product-form").addEventListener("click", () => {
    setDefaultValue();
})

function setDefaultValue() {
    document.querySelector(".upload-image-preview").src = "./assets/img/ADD_img.jpg"; // Hoặc đường dẫn mặc định cho ảnh
    document.getElementById("ten-sanPham").value = "";
    document.getElementById("gia-moi").value = "";
    document.getElementById("chon-sanPham").value = "Quạt đứng";
    document.getElementById("size").value = "";
    document.getElementById("power").value = "";
    document.getElementById("hang").value = "";
    document.getElementById("madeIn").value = "";
    document.getElementById("year").value = "";
}


// Open Popup Modal
let btnAddProduct = document.getElementById("btn-add-product");
btnAddProduct.addEventListener("click", () => {
    document.querySelectorAll(".add-product-e").forEach(item => {
        item.style.display = "block";
    })
    document.querySelectorAll(".edit-product-e").forEach(item => {
        item.style.display = "none";
    })
    document.querySelector(".add-product").classList.add("open");
});

// Close Popup Modal
let closePopup = document.querySelectorAll(".modal-close");
let modalPopup = document.querySelectorAll(".modal");

for (let i = 0; i < closePopup.length; i++) {
    closePopup[i].onclick = () => {
        modalPopup[i].classList.remove("open");
    };
}

// On change Image
function uploadImage(el) {
    const file = el.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector(".upload-image-preview").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}



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

// Format Date
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    return dd + "/" + mm + "/" + yyyy;
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

// Get Order Details
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

// Sử dụng hàm formatDate và calculateEndDate trong mã của bạn


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


// function cancelSearchOrder(){
//     let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
//     document.getElementById("tinh-trang").value = 2;
//     document.getElementById("form-search-order").value = "";
//     document.getElementById("time-start").value = "";
//     document.getElementById("time-end").value = "";
//     showOrder(orders);
// }

// Create Object Thong ke
function createObj() {
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    let result = [];

    // Duyệt qua từng hóa đơn để lấy chi tiết
    orders.forEach(order => {
        if (order.trangthai) {
            order.items.forEach(item => {
                // Lấy thông tin sản phẩm
                let prod = products.find(product => product.productid == item.id);
                if (prod) {
                    let obj = {
                        id: item.id,
                        madon: order.id,
                        user: order.user,
                        date: formatDate(order.date),
                        productid: item.id,
                        quantity: item.quantity,
                        category: prod.category,
                        name: prod.name,
                        price: prod.price,
                        total: item.quantity * prod.price,
                        diachi: order.diachi,
                        sdt: order.sdt,
                        trangthai: order.trangthai,
                        thoigiandat: order.date
                    };
                    result.push(obj);
                }
            });
        }
    });

    return result;
}



// Filter 
function thongKe(mode) {
    let categoryTkTmp = document.getElementById("the-loai-tk").value;
    switch (categoryTkTmp) {
        case 'Quạt đứng':
            categoryTk = 'quatdung';
            break;
        case 'Quạt treo tuờng':
            categoryTk = 'quattreotuong';
            break;
        case 'Quạt trần':
            categoryTk = 'quattran';
            break;
        case 'Quạt lửng':
            categoryTk = 'quatlung';
            break;
        case 'Tất cả':
            categoryTk = 'Tất cả';
            break;
    }
    let ct = document.getElementById("form-search-tk").value;
    let timeStart = document.getElementById("time-start-tk").value;
    let timeEnd = document.getElementById("time-end-tk").value;

    if (timeEnd < timeStart && timeEnd !== "" && timeStart !== "") {
        alert("Lựa chọn thời gian sai!");
        return;
    }

    let arrDetail = createObj();

    // Lọc theo thể loại
    let result = categoryTk === "Tất cả" ? arrDetail : arrDetail.filter((item) => {
        return item.category === categoryTk;
    });

    // Lọc theo tiêu chí tìm kiếm
    result = ct === "" ? result : result.filter((item) => {
        return item.name.toLowerCase().includes(ct.toLowerCase());
    });

    // Lọc theo thời gian
    // Lọc theo thời gian
    if (timeStart !== "" && timeEnd === "") {
        result = result.filter((item) => {
            let itemDate = new Date(item.date.split("/").reverse().join("-"));
            return itemDate >= new Date(new Date(timeStart).setHours(0, 0, 0));
        });
    } else if (timeStart === "" && timeEnd !== "") {
        result = result.filter((item) => {
            let itemDate = new Date(item.date.split("/").reverse().join("-"));
            return itemDate <= new Date(new Date(timeEnd).setHours(23, 59, 59));
        });
    } else if (timeStart !== "" && timeEnd !== "") {
        result = result.filter((item) => {
            let itemDate = new Date(item.date.split("/").reverse().join("-"));
            return itemDate >= new Date(new Date(timeStart).setHours(0, 0, 0)) &&
                itemDate <= new Date(new Date(timeEnd).setHours(23, 59, 59));
        });
    }

    // Hiển thị thống kê
    showThongKe(result, mode);
}


// Show số lượng sp, số lượng đơn bán, doanh thu
function showOverview(arr) {
    let activeProducts = arr.filter(item => item.trangthai);
    document.getElementById("quantity-product").innerText = activeProducts.length;
    document.getElementById("quantity-order").innerText = activeProducts.reduce((sum, cur) => (sum + parseInt(cur.quantity)), 0);
    document.getElementById("quantity-sale").innerText = vnd(activeProducts.reduce((sum, cur) => (sum + parseInt(cur.total)), 0));
}

function showThongKe(arr, mode) {
    let orderHtml = "";
    let mergeObj = mergeObjThongKe(arr);
    showOverview(mergeObj);

    switch (mode) {
        // case 0:
        //     mergeObj = mergeObjThongKe(createObj());
        //     showOverview(mergeObj);
        //     document.getElementById("the-loai-tk").value = "Tất cả";
        //     document.getElementById("form-search-tk").value = "";
        //     document.getElementById("time-start-tk").value = "";
        //     document.getElementById("time-end-tk").value = "";
        //     break;
        case 1:
            mergeObj.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
            break;
        case 2:
            mergeObj.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
            break;
    }
    for (let i = 0; i < mergeObj.length; i++) {
        orderHtml += `
        <tr>
            <td>${i + 1}</td>
            <td><div class="prod-img-title"><p>${mergeObj[i].name}</p></div></td>
            <td>${mergeObj[i].quantity}</td>
            <td>${vnd(mergeObj[i].total)}</td>
            <td><button class="btn-detail product-order-detail" data-id="${mergeObj[i].id}"><i class="fa-solid fa-eye"></i> Chi tiết</button></td>
        </tr>`;
    }
    document.getElementById("showTk").innerHTML = orderHtml;
    document.querySelectorAll(".product-order-detail").forEach(item => {
        let idProduct = item.getAttribute("data-id");
        item.addEventListener("click", () => {
            detailOrderProduct(arr, idProduct);
        });
    });
}

// Gọi hàm showThongKe để hiển thị dữ liệu
showThongKe(createObj());

function mergeObjThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.id == item.id) // Không tìm thấy gì trả về undefined

        if (check) {
            check.quantity = parseInt(check.quantity) + parseInt(item.quantity);
            check.total += parseInt(item.price) * parseInt(item.quantity);
        } else {
            const newItem = { ...item }
            newItem.total = newItem.price * newItem.quantity;
            result.push(newItem);
        }

    });
    return result;
}

function detailOrderProduct(arr, id) {
    let orderHtml = "";
    arr.forEach(item => {
        if (item.id == id) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${formatDate(item.date)}</td>
            </tr>`;
        }
    });
    document.getElementById("show-product-order-detail").innerHTML = orderHtml;
    document.querySelector(".modal.detail-order-product").classList.add("open");
}




//customer thôgns kê
function switchView() {
    const productTable = document.getElementById('productTable');
    const customerTable = document.getElementById('customerTable');

    if (productTable.style.display === 'none') {
        productTable.style.display = 'block';
        customerTable.style.display = 'none';
    } else {
        productTable.style.display = 'none';
        customerTable.style.display = 'block';
    }
}

// Hàm tạo dữ liệu thống kê từ localStorage cho khách hàng

function createObjCus() {
    const orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    const products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    const productMap = new Map(products.map(prod => [prod.productid, prod]));
    const result = new Map();

    orders.forEach(order => {
        if (order.trangthai) {
            order.items.forEach(item => {
                const prod = productMap.get(parseInt(item.id));
                if (prod) {
                    if (result.has(order.user.username)) {
                        const existingUser = result.get(order.user.username);
                        existingUser.quantity += parseInt(item.quantity);
                        existingUser.total += item.quantity * prod.price;
                        existingUser.orders.push({
                            madon: order.id,
                            productid: item.id,
                            quantity: item.quantity,
                            price: prod.price,
                            date: formatDate(order.date)
                        });
                    } else {
                        result.set(order.user, {
                            user: order.user.username,
                            quantity: parseInt(item.quantity),
                            total: item.quantity * prod.price,
                            orders: [{
                                madon: order.id,
                                productid: item.id,
                                quantity: item.quantity,
                                price: prod.price,
                                date: formatDate(order.date)
                            }]
                        });
                    }
                }
            });
        }
    });

    return Array.from(result.values());
}
function detailOrderCustomer(arr, user) {
    let orderHtml = "";
    const userObj = arr.find(item => item.user.username === user.username);

    if (userObj) {
        const addedOrders = new Set(); // Sử dụng Set để lưu trữ các mã đơn đã thêm
        userObj.orders.forEach(order => {
            const uniqueOrderIdentifier = `${order.madon}-${order.productid}`;
            if (!addedOrders.has(uniqueOrderIdentifier)) {
                orderHtml += `
                <tr>
                    <td>${order.madon}</td>
                    <td>${order.quantity}</td>
                    <td>${vnd(order.price)}</td>
                    <td>${order.date}</td>
                </tr>`;
                addedOrders.add(uniqueOrderIdentifier); // Thêm mã đơn vào Set
            }
        });
    }

    document.getElementById("show-customer-order-detail").innerHTML = orderHtml;
    document.querySelector(".modal.detail-order-product").classList.add("open");
}

// Thêm sự kiện cho các nút Chi tiết khách hàng
function addCustomerDetailButtonsEventListeners(arr) {
    document.querySelectorAll(".customer-order-detail").forEach(button => {
        button.addEventListener("click", () => {
            const user = button.getAttribute("data-user");
            detailOrderCustomer(arr, user);
        });
    });
}
function showThongKeCustomer(arr) {
    let orderHtml = "";
    arr.forEach((item, index) => {
        orderHtml += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.user}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.total)}</td>
            <td><button class="btn-detail customer-order-detail" data-user="${item.user}"><i class="fa-solid fa-eye"></i> Chi tiết</button></td>
        </tr>`;
    });

    document.getElementById("showTkCustomer").innerHTML = orderHtml;
    addCustomerDetailButtonsEventListeners(arr);
}


// Gọi hàm hiển thị khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    const customerData = createObjCus();
    showThongKeCustomer(customerData);

    const productData = createObj(); // Hàm createObj() tạo dữ liệu thống kê sản phẩm
    showThongKeSanPham(productData);

    document.getElementById("form-search-tk").addEventListener("input", () => filterAndSearch());
});


function filterAndSearch(mode) {
    const searchValue = document.getElementById("form-search-tk").value.toLowerCase();
    let arr = createObjCus();

    // Lọc theo tên khách hàng
    let filteredArr = arr.filter(item => item.user.toLowerCase().includes(searchValue));

    // Lọc giá theo mode
    switch (mode) {
        case 1:
            filteredArr.sort((a, b) => a.total - b.total);
            break;
        case 2:
            filteredArr.sort((a, b) => b.total - a.total);
            break;
    }

    // Hiển thị kết quả lọc và tìm kiếm
    showFilteredResults(filteredArr);
}

function showFilteredResults(arr) {
    let orderHtml = "";
    arr.forEach((item, index) => {
        orderHtml += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.user}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.total)}</td>
            <td><button class="btn-detail customer-order-detail" data-user="${item.user}"><i class="fa-solid fa-eye"></i> Chi tiết</button></td>
        </tr>`;
    });

    document.getElementById("showTkCustomer").innerHTML = orderHtml;
    addCustomerDetailButtonsEventListeners(arr);
}





// User
let addAccount = document.getElementById('signup-button');
let updateAccount = document.getElementById("btn-update-account");

document.querySelector(".modal.signup .modal-close").addEventListener("click", () => {
    signUpFormReset();
});

function openCreateAccount() {
    document.querySelector(".signup").classList.add("open");
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "none";
    });
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "block";
    });
}

function signUpFormReset() {
    document.getElementById('name-account').value = "";
    document.getElementById('phone').value = "";
    document.getElementById('password').value = "";
    document.querySelector('.form-message-name').innerHTML = '';
    document.querySelector('.form-message-phone').innerHTML = '';
    document.querySelector('.form-message-password').innerHTML = '';
}

// Hiển thị danh sách tài khoản từ local storage khi trang được tải
window.onload = function () {
    showUser();
};

// Hiển thị danh sách tài khoản
function showUserArr(arr) {
    let accountHtml = '';
    if (arr.length == 0) {
        accountHtml = `<td colspan="5">Không có dữ liệu</td>`;
    } else {
        arr.forEach((account, index) => {
            let tinhtrang = account.status == 0 ? `<span class="status-no-complete">Bị khóa</span>` : `<span class="status-complete">Hoạt động</span>`;
            accountHtml += ` <tr>
                <td>${index + 1}</td>
                <td>${account.username}</td>
                <td>${account.numberphone}</td>
                <td>${tinhtrang}</td>
                <td class="control control-table">
                    <button class="btn-edit" id="edit-account" onclick='editAccount("${account.numberphone}")' ><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" id="delete-account" onclick="deleteAcount(${index})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`;
        });
    }
    document.getElementById('show-user').innerHTML = accountHtml;
}

function showUser() {
    let selectStatus = document.getElementById('tinh-trang-user').value; // Lấy giá trị trạng thái được chọn
    let searchInput = document.getElementById('form-search-user').value.trim(); // Lấy giá trị tìm kiếm từ input
    let accounts = localStorage.getItem("accounts") ? JSON.parse(localStorage.getItem("accounts")) : []; // Lấy danh sách từ localStorage

    let result; // Biến lưu kết quả sau khi lọc
    if (selectStatus === "2") { // "Tất cả"
        result = accounts;
    } else if (selectStatus === "1") { // "Hoạt động"
        result = accounts.filter(item => item.status === 1);
    } else if (selectStatus === "0") { // "Bị khóa"
        result = accounts.filter(item => item.status === 0);
    }

    // Lọc theo từ khóa tìm kiếm nếu có
    if (searchInput) {
        result = result.filter(item => item.username.toUpperCase().includes(searchInput.toUpperCase()));
    }

    // Hiển thị danh sách kết quả
    showUserArr(result);
}

// Gọi hàm hiển thị ngay khi DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    showUser();
});


// Thêm tài khoản mới
addAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let usernameUser = document.getElementById('name-account').value;
    let phoneUser = document.getElementById('phone').value;
    let passwordUser = document.getElementById('password').value;
    let statusUser = 1; // mặc định là hoạt động

    // Logic xác thực
    let formMessageName = document.querySelector('.form-message-name');
    let formMessagePhone = document.querySelector('.form-message-phone');
    let formMessagePassword = document.querySelector('.form-message-password');

    if (!usernameUser) {
        formMessageName.innerHTML = 'Vui lòng nhập tên tài khoản';
    } else {
        formMessageName.innerHTML = '';
    }

    if (!phoneUser) {
        formMessagePhone.innerHTML = 'Vui lòng nhập số điện thoại';
    } else {
        formMessagePhone.innerHTML = '';
    }

    if (!passwordUser) {
        formMessagePassword.innerHTML = 'Vui lòng nhập mật khẩu';
    } else {
        formMessagePassword.innerHTML = '';
    }

    if (usernameUser && phoneUser && passwordUser) {
        let user = {
            username: usernameUser,
            numberphone: phoneUser,
            password: passwordUser,
            status: statusUser,
            join: new Date() // thêm ngày tham gia
        };

        let accounts = localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [];
        let checkloop = accounts.some(account => account.numberphone === user.numberphone);

        if (!checkloop) {
            accounts.push(user);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            // Thông báo thành công
            document.querySelector(".signup").classList.remove("open");
            showUser();
            signUpFormReset();
        } else {
            // Thông báo lỗi
            toast({ title: 'Lỗi', message: 'Tài khoản đã tồn tại!', type: 'error', duration: 3000 });
        }
    } else {
        // Thông báo lỗi
        toast({ title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin!', type: 'error', duration: 3000 });
    }
});

// Hàm để mở form chỉnh sửa và hiển thị dữ liệu cũ lên các trường input
function editAccount(phone) {
    // Mở modal
    document.querySelector(".signup").classList.add("open");

    // Ẩn các nút thêm tài khoản
    document.querySelectorAll(".add-account-e").forEach(item => {
        item.style.display = "none";
    });

    // Hiện các nút chỉnh sửa tài khoản
    document.querySelectorAll(".edit-account-e").forEach(item => {
        item.style.display = "block";
    });

    // Lấy dữ liệu từ local storage
    let accounts = JSON.parse(localStorage.getItem("accounts"));

    // Tìm tài khoản bằng số điện thoại
    let index = accounts.findIndex(item => item.numberphone === phone);
    indexFlag = index;

    // Hiển thị dữ liệu cũ lên các trường input
    document.getElementById("name-account").value = accounts[index].username;
    document.getElementById("phone").value = accounts[index].numberphone;
    document.getElementById("password").value = accounts[index].password;
    document.getElementById("user-status").checked = accounts[index].status === 1;
}

// Lưu thay đổi tài khoản
updateAccount.addEventListener("click", (e) => {
    e.preventDefault();
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    let username = document.getElementById("name-account").value;
    let phone = document.getElementById("phone").value;
    let password = document.getElementById("password").value;
    let status = document.getElementById("user-status").checked ? 1 : 0;

    if (username && phone && password) {
        accounts[indexFlag].username = username;
        accounts[indexFlag].numberphone = phone;
        accounts[indexFlag].password = password;
        accounts[indexFlag].status = status;

        localStorage.setItem("accounts", JSON.stringify(accounts));
        toast({ title: 'Thành công', message: 'Thay đổi thông tin thành công!', type: 'success', duration: 3000 });
        document.querySelector(".signup").classList.remove("open");
        signUpFormReset();
        showUser();
    } else {
        toast({ title: 'Lỗi', message: 'Không thể lưu thay đổi. Vui lòng kiểm tra lại thông tin!', type: 'error', duration: 3000 });
    }
});

// Xóa tài khoản
function deleteAcount(phone) {
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    let index = accounts.findIndex(item => item.numberphone == phone);
    if (confirm("Bạn có chắc muốn xóa?")) {
        accounts.splice(index, 1);
    }
    localStorage.setItem("accounts", JSON.stringify(accounts));
    showUser();
}



function logout() {
    localStorage.removeItem('userlogin');
    localStorage.removeItem('cart');
    location.href = '../index.html';
}