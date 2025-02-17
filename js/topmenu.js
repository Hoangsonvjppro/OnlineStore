// function exit() {
//     var x = document.getElementById("find_wrap");
//     x.style.display = "none";
// }
// function hien(y) {
//     var element = document.getElementById(y);
//     if (element) {
//         if (y === 'find_wrap') {
//             element.style.display = 'block';
//             element.style.backdropFilter = "brightness(0.5)";
//         } else if (y === 'bar_wrap') {
//             element.style.display = 'block';

//         }
//     }
// }

// var productArray = [
//     {productid:'DH1600', brandid:'Senko', img:'../hinhanh/quatdien/fan1.jpg',
//         name:'Quạt đứng Senko 3 cánh DH1600 47W', price: 559000 , category: 'quatdien'},
//     {productid:'VY628890', brandid:'Asia ', img:'../hinhanh/quatdien/fan2.jpg',
//         name:'Quạt lửng Asia VY628890 75W', price: 510000,  category: 'quatcongnghiep'},
//     {productid:'VY639990', brandid:'Asia', img:'../hinhanh/quatdien/fan3.jpg',
//         name:'Quạt đứng Asia 6 cánh VY639990 80W', price: 790000,  category: 'quathoinuoc'},
//     {productid:'TC1622', brandid:'Senko', img:'../hinhanh/quatdien/fan4.jpg',
//         name:'Quạt treo tường Senko 7 cánh TC1622 65W', price: 540000,  category: 'quattran'},
//     {productid:'VY377790', brandid:'Asia', img:'../hinhanh/quatdien/fan5.jpg',
//         name:'Quạt treo tường Asia 3 cánh VY377790 55W', price: 720000},
//     {productid:'B1612', brandid:'Senko', img:'../hinhanh/quatdien/fan6.jpg',
//         name:'Quạt bàn Senko 3 cánh B1612 47W', price: 425000},
//     {productid:'L1638', brandid:'Senko', img:'../hinhanh/quatdien/fan7.jpg',
//         name:'Quạt lửng Senko 3 cánh L1638 47W', price: 470000, category: 'quatdien'},
//     {productid:'LTS1636', brandid:'Senko', img:'../hinhanh/quatdien/fan8.jpg',
//         name:'Quạt lửng Senko 7 cánh LTS1636 65W', price: 560000},
//     {productid:'VY357690', brandid:'Asia', img:'../hinhanh/quatdien/fan9.jpg',
//         name:'Quạt treo tường Asia 3 cánh VY357690 55W', price: 550000},
//     {productid:'VY355790', brandid:'Asia', img:'../hinhanh/quatdien/fan10.jpg',
//         name:'Quạt bàn Asia 3 cánh VY355790 55W', price: 550000},
//     {productid:'B1213', brandid:'Senko', img:'../hinhanh/quatdien/fan11.jpg',
//         name:'Quạt bàn Senko 3 cánh B1213 40W', price: 379000},
//     {productid:'SHD7115', brandid:'Sunhouse', img:'../hinhanh/quatdien/fan12.jpg',
//         name:'Quạt sạc điện Sunhouse 3 cánh SHD7115 15W', price: 550000},
// ];
// const listProduct = 'listProduct';
// localStorage.setItem(listProduct, JSON.stringify(productArray));

// const findData = localStorage.getItem(listProduct);

// function findItem(find, minprice, maxprice, selectedCategories, selectedBrands) {
//     if (findData) {
//         const products = JSON.parse(findData);
//         const result = products.filter(product =>
//             product.name.toLowerCase().includes(find.toLowerCase()) &&
//             product.price <= maxprice &&
//             product.price >= minprice &&
//             (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
//             (selectedBrands.length === 0 || selectedBrands.includes(product.brandid))
//         );
//         console.clear();
//         if (result.length > 0) {
//             console.log('Kết quả tìm kiếm:');
//             result.forEach(product => {
//                 console.log(`Tên: ${product.name}, Giá: ${product.price}, Loại: ${product.category}, Hãng: ${product.brandid}`);
//             });
//         } else {
//             console.log('Không tìm thấy sản phẩm nào.');
//         }
//     }
//     else {
//         console.log('Không có dữ liệu trong localStorage.');
//     }
// }
// const findInput = ['findspace', 'maxprice', 'minprice', 'quatdien', 'quatcongnghiep', 'quathoinuoc', 'quattran', 'Asia', 'Senko'];
// findInput.forEach(id => {
//     document.getElementById(id).addEventListener('keypress', function (event) {
//         if (event.key == 'Enter') {
//             const find = document.getElementById('findspace').value.trim();
//             let minprice = parseFloat(document.getElementById('minprice').value);
//             let maxprice = parseFloat(document.getElementById('maxprice').value);

//             if (isNaN(minprice)) minprice = 0;
//             if (isNaN(maxprice)) maxprice = Infinity;


//             const selectedCategories = Array.from(document.querySelectorAll('input[name="loai"]:checked')).map(checkbox => checkbox.id);
//             const selectedBrands = Array.from(document.querySelectorAll('input[name="thuonghieu"]:checked')).map(checkbox => checkbox.id);

//             if ((find || selectedCategories.length > 0 || selectedBrands.length > 0) && !isNaN(minprice) && !isNaN(maxprice) && minprice <= maxprice) {
//                 findItem(find, minprice, maxprice, selectedCategories, selectedBrands);
//             } else {
//                 console.log('Vui lòng nhập đúng từ khóa và giá trị hợp lệ.');
//             }
//         }
//     });
// });



