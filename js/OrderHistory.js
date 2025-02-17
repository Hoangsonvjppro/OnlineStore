
// function displayOrders() {
//     const ordersTable = document.getElementById('orders-table-body'); // Thân bảng để hiển thị
//     ordersTable.innerHTML = ''; // Xóa nội dung cũ

//     // Lấy dữ liệu từ `hoadon` trong localStorage
//     const hoadons = JSON.parse(localStorage.getItem('hoadon')) || [];

//     // Duyệt qua từng hóa đơn và thêm vào bảng
//     hoadons.forEach(order => {
//         const row = document.createElement('tr');

//         // Thêm hàng vào bảng
//         row.innerHTML = `
//             <td>${order.id}</td> <!-- Mã đơn hàng -->
//             <td>${order.date}</td> <!-- Ngày đặt hàng -->
//             <td>${order.items}</td> 
//              <td>${order.address}</td> <!-- Có thể thay thế bằng dữ liệu thực -->
//             <td>${order.trangthai ? 'Đã xử lý' : 'Chưa xử lý'}</td> <!-- Trạng thái -->

//             <td>${order.total}</td> <!-- Tổng tiền -->
//         `;

//         ordersTable.appendChild(row);
//     });
// }

// // Hiển thị dữ liệu khi tải trang
// document.addEventListener('DOMContentLoaded', displayOrders);
function displayOrders() {
    const ordersTable = document.getElementById('orders-table-body'); // Thân bảng để hiển thị
    ordersTable.innerHTML = ''; // Xóa nội dung cũ

    // Lấy dữ liệu từ `hoadon` và `userInfo` trong localStorage
    const hoadons = JSON.parse(localStorage.getItem('hoadon')) || [];
    const userInfoArray = JSON.parse(localStorage.getItem('accounts')) || [];

    console.log(hoadons);
    console.log(userInfoArray);

    if (userlogin == undefined) {
        document.getElementById('chua-mua-hang').style.display = 'block';
        document.getElementById('order_history').style.display = 'none';
        return;
    }

    let user = userInfoArray.find(user => user.username == userlogin.username);

    // if (user == undefined)
    let cnt = 0;
    // Duyệt qua từng hóa đơn và thêm vào bảng
    hoadons.forEach(order => {
        if (order.user.username == user.username) {
            const row = document.createElement('tr');

            // Tìm thông tin người dùng từ `userInfo` dựa trên username
            let total = order.total.toLocaleString('vi-VN');

            // Thêm hàng vào bảng
            row.innerHTML = `
                <td>${order.id}</td> <!-- Mã đơn hàng -->
                <td>${order.date}</td> <!-- Ngày đặt hàng -->
                <td>${total} VNĐ</td> <!-- Tổng tiền -->
                <td>${order.items.map(item => `${item.id} (x${item.quantity})`).join(', ')}</td> <!-- Các sản phẩm trong đơn hàng -->
                <td>${order.diachi}</td> <!-- Địa chỉ lấy từ userInfo -->
                <td>${order.payment_method}</td>
                <td>${order.trangthai ? 'Đã xử lý' : 'Chưa xử lý'}</td> <!-- Trạng thái -->
                
            `;

            ordersTable.appendChild(row);
            ++cnt;
        }
    });
    console.log(cnt);

    if (cnt == 0) {
        document.getElementById('chua-mua-hang').style.display = 'block';
        document.getElementById('order_history').style.display = 'none';
    } else {
        document.getElementById('chua-mua-hang').style.display = 'none';
        document.getElementById('order_history').style.display = 'block';
    }
}

function updateQuantity() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(cartItems);

    let totalQuantity = 0;
    cartItems.forEach(item => {
        totalQuantity += Number(item.quantity);
    });

    if (totalQuantity != 0) {
        if (totalQuantity > 9) totalQuantity = '9+'
        document.getElementById('item-quantity').style.display = 'block';
        document.getElementById('item-quantity').innerText = totalQuantity;
    }
    else
        document.getElementById('item-quantity').style.display = 'none';
}

function hien(y) {
    var element = document.getElementById(y);
    console.log(element);
    if (element) {
        if (y === 'find_wrap') {
            element.style.display = 'block';
            element.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById('find').classList.add('show');

        } else if (y === 'bar_wrap') {
            element.style.display = 'block';
            element.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
            document.getElementById('bar').classList.add('show');
        }
    }
}

// Hiển thị dữ liệu khi tải trang
document.addEventListener('DOMContentLoaded', function () {
    displayOrders();
    updateQuantity();
});
