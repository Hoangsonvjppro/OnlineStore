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