// Create Object Thong ke
function createObj() {
    let orders = localStorage.getItem("hoadon") ? JSON.parse(localStorage.getItem("hoadon")) : [];
    let products = localStorage.getItem("productList") ? JSON.parse(localStorage.getItem("productList")) : [];
    let result = [];

    // Duyệt qua từng hóa đơn để lấy chi tiết từng sản phẩm
    orders.forEach(order => {
        if (order.trangthai==1) {
            order.items.forEach(item => {
                // Lấy thông tin sản phẩm
                let prod = products.find(product => product.productid == item.id);
                if (prod) {
                    let obj = {
                        id: item.id,
                        madon: order.id,
                        user: order.user.username,
                        date: formatDate(order.date),
                        productid: prod.productid,
                        quantity: item.quantity,
                        category: prod.category,
                        name: prod.name,
                        price: prod.price,
                        total: item.quantity * prod.price,
                        diachi: order.diachi,
                        sdt: order.user.numberphone,
                        trangthai: order.trangthai,
                    };
                    result.push(obj);
                }
            });
        }
    });

    return result;
}


function thongKe(mode) {
    let categoryTk = document.getElementById("the-loai-tk").value;
    let ct = document.getElementById("form-search-tk").value;
    let timeStart = document.getElementById("time-start-tk").value;
    let timeEnd = document.getElementById("time-end-tk").value;

    if (timeEnd < timeStart && timeEnd !== "" && timeStart !== "") {
        alert("Lựa chọn thời gian sai!");
        return;
    }

    let arrDetail = createObj();

    // Lọc theo thể loại (áp dụng cho sản phẩm)
    let result = categoryTk === "Tất cả" ? arrDetail : arrDetail.filter((item) => 
        item.category === categoryTk
    );

    // Lọc theo tiêu chí tìm kiếm
    result = ct === "" ? result : result.filter((item) =>
        item.name.toLowerCase().includes(ct.toLowerCase()) || item.user.toLowerCase().includes(ct.toLowerCase())
    );

    // Lọc theo thời gian
    if (timeStart !== "" && timeEnd === "") {
        let start = new Date(timeStart);
        start.setHours(0, 0, 0);
        result = result.filter((item) => {
            let itemDate = new Date(item.date.split("/").reverse().join("-"));
            return itemDate >= start;
        });
    } else if (timeStart === "" && timeEnd !== "") {
        let end = new Date(timeEnd);
        end.setHours(23, 59, 59);
        result = result.filter((item) => {
            let itemDate = new Date(item.date.split("/").reverse().join("-"));
            return itemDate <= end;
        });
    } else if (timeStart !== "" && timeEnd !== "") {
        let start = new Date(timeStart);
        start.setHours(0, 0, 0);
        let end = new Date(timeEnd);
        end.setHours(23, 59, 59);
        result = result.filter((item) => {
            let itemDate = new Date(item.date.split("/").reverse().join("-"));
            return itemDate >= start && itemDate <= end;
        });
    }
    

    // Hiển thị thống kê cho cả sản phẩm và khách hàng
    showThongKe(result, mode);
    showThongKeCus(result, mode);
}




// Show số lượng sp, số lượng đơn bán, doanh thu
function showOverview(arr) {
    let activeProducts = arr.filter(item => item.trangthai);
    document.getElementById("quantity-product").innerText = activeProducts.length;
    document.getElementById("quantity-order").innerText = activeProducts.reduce((sum, cur) => (sum + parseInt(cur.quantity)), 0);
    document.getElementById("quantity-sale").innerText = vnd(activeProducts.reduce((sum, cur) => (sum + parseInt(cur.total)), 0));
}


function mergeObjThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.id == item.id)

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
function showThongKe(arr, mode) {
    let orderHtml = "";
    let mergeObj = mergeObjThongKe(arr);
    showOverview(mergeObj);
    switch (mode) {
        case 0:
            mergeObj = mergeObjThongKe(createObj());
            showOverview(mergeObj);
            document.getElementById("the-loai-tk").value = "Tất cả";
            document.getElementById("form-search-tk").value = "";
            document.getElementById("time-start-tk").value = "";
            document.getElementById("time-end-tk").value = "";
            break;
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
            <td><p>${mergeObj[i].name}</p></td>
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

function detailOrderProduct(arr, id) {
    let orderHtml = "";
    arr.forEach(item => {
        if (item.id == id) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${item.date}</td>
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



function mergeCusThongKe(arr) {
    let result = [];
    arr.forEach(item => {
        let check = result.find(i => i.user == item.user);

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
function showThongKeCus(arr, mode) {
    let orderHtml = "";
    let mergeObj = mergeCusThongKe(arr);

    switch (mode) {
        case 0:
            mergeObj = mergeCusThongKe(createObj());
            document.getElementById("the-loai-tk").value = "Tất cả";
            document.getElementById("form-search-tk").value = "";
            document.getElementById("time-start-tk").value = "";
            document.getElementById("time-end-tk").value = "";
            break;
        case 1:
            mergeObj.sort((a, b) => parseInt(a.total) - parseInt(b.total));
            break;
        case 2:
            mergeObj.sort((a, b) => parseInt(b.total) - parseInt(a.total));
            break;
    }

    for (let i = 0; i < mergeObj.length; i++) {
        orderHtml += `
        <tr>
            <td>${i + 1}</td>
            <td><p>${mergeObj[i].user}</p></td>
            <td>${mergeObj[i].quantity}</td>
            <td>${vnd(mergeObj[i].total)}</td>
            <td><button class="btn-detail customer-order-detail" data-user="${mergeObj[i].user}"><i class="fa-solid fa-eye"></i> Chi tiết</button></td>
        </tr>`;
    }

    document.getElementById("showTkCustomer").innerHTML = orderHtml;
    document.querySelectorAll(".customer-order-detail").forEach(item => {
        let userName = item.getAttribute("data-user");
        item.addEventListener("click", () => {
            detailOrderCustomer(arr, userName);
        });
    });
}


// Gọi hàm showThongKeCus để hiển thị dữ liệu
showThongKeCus(createObj());

function detailOrderCustomer(arr, user) {
    let orderHtml = "";
    arr.forEach(item => {
        if (item.user == user) {
            orderHtml += `<tr>
            <td>${item.madon}</td>
            <td>${item.quantity}</td>
            <td>${vnd(item.price)}</td>
            <td>${item.date}</td>
            </tr>`;
        }
    });
    document.getElementById("show-customer-order-detail").innerHTML = orderHtml;
    document.querySelector(".modal.detail-order-customer").classList.add("open");
}