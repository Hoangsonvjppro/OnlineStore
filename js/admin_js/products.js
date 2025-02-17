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
    displayList(result, perPage, currentPage);

    // Thiết lập phân trang
    setupPagination(result, perPage);

}

document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});

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
        case 'Quạt treo tường':
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

// Đảm bảo các sự kiện DOMContentLoaded được gán đúng cách
document.addEventListener('DOMContentLoaded', function () {
    showProduct();
});

// Nút "Cập nhật sản phẩm"
document.getElementById("add-product-button").addEventListener("click", (e) => {
    e.preventDefault();
    addProduct();
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
        case 'Quạt treo tường':
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

// function attachDeleteEvents() {
//     document.querySelectorAll('.btn-delete').forEach(button => {
//         button.addEventListener('click', function (e) {
//             const id = e.target.closest('button').dataset.id;
//             console.log("Button clicked, ID:", id); // Kiểm tra ID sản phẩm
//             deleteProduct(parseInt(id)); // Chuyển đổi ID sang số trước khi xóa
//         });
//     });
// }

// document.addEventListener('DOMContentLoaded', function () {
//     showProduct();
//     attachDeleteEvents(); // Gán sự kiện click sau khi DOM đã tải
// });


