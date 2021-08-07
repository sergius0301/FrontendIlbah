var userService = new UserService();
var commonService = new CommonService();
var productService = new ProductService();
var httpService = new HttpService();

function login(){
   let email = $('#emailId').val();
   let password = $('#passwordId').val();

   httpService.login(email, password);
}
//aceasta functie se executa pe evenimentul onload pe pagina de produse
function authorize(){
   //verificam daca proprietatea care se seteaza atunci cand ne logam exista in memoria browser-ului
   //daca exista atunci ne dam seama ca utilizatorul este logat
   let isAuthenticated = commonService.getFromStorage('token');
   if(!isAuthenticated){
      //daca utilizatorul nu este logat il trimitem la pagina de logare
      commonService.redirect("login.html");
   }
}
function logOut(){
   //la logout trebuie sa stergem proprietatea care ne authentifica si dupa care ne dam
   //seama daca un utilizator este logat
   window.localStorage.removeItem('token');

   document.location.href = "login.html";
}
function register(){
   //colectam datele din inputuri
   let name =  $('#nameId').val();
   let email = $('#emailId').val();
   let password = $('#passwordId').val();

   let profile = JSON.stringify({"email": email, "name": name});
   commonService.setToStorage("userProfile", profile);

   httpService.register(email, password);
}
function showProducts(){
   let promise = httpService.getProducts();
   promise
   .then(products => {
      let formatedProducts = productService.getFormatedProducts(products);
      document.getElementById('productsListId').innerHTML = formatedProducts;
  })
  .catch(error => {
      commonService.showInfoMessage(error);
  });
}
function showProfile(){
   let profile = commonService.getFromStorage('userProfile');
   let response = userService.getFormatedProfileDetail(JSON.parse(profile));
   
   document.getElementById('myprofileId').innerHTML = response;
}
function removeProduct(id){
   httpService.deleteProductById(id);

  showProducts();
  updateProductsCount();
}
//functia este apelata cand se da click pe un produs
function openProduct(id){
   window.commonService.setToStorage('productId', id);
   document.location.href = "productDetails.html";
}
//funtia este apelata la onload pe pagina productDetails
function showProduct(){
   let productId = commonService.getFromStorage('productId');
   if(productId){
      let promise = httpService.getProductbyId(productId)
      promise
        .then(product => {
            let formatedProduct = productService.getFormatedProduct(product);
            document.getElementById('productDetailId').innerHTML = formatedProduct;
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
   }
}
function updateProductById(id){
   window.commonService.setToStorage('updateProductId', id);
   document.location.href = "updateProduct.html";
}
function setProductDetails(){
   let productId = commonService.getFromStorage('updateProductId');

   let promise = httpService.getProductbyId(productId)
      promise
        .then(product => {
         document.getElementById('nameId').value = product.name; 
         document.getElementById('descriptionId').value = product.description; 
         document.getElementById('priceId').value = product.price; 
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
}
function updateProduct(){
      let name = document.getElementById('nameId').value; 
      let description =  document.getElementById('descriptionId').value; 
      let price =  document.getElementById('priceId').value; 
      let productId = commonService.getFromStorage('updateProductId');

      let product = {"id": Number(productId),"name": name, "description": description, "price": price};

      httpService.updateProduct(product);
}
function addToFavorites(id){
   let promise = httpService.getProductbyId(id)
   promise
     .then(product => {
         let response = productService.addProductToFavorites(product)
         commonService.showInfoMessage(response);
         updateProductsCount();
     })
     .catch(error => {
         commonService.showInfoMessage(error);
     });
}
function addToCart(id){
   let promise = httpService.getProductbyId(id)
   promise
     .then(product => {
         let response = productService.addProductToCart(product)
         commonService.showInfoMessage(response);
         updateProductsCount();
     })
     .catch(error => {
         commonService.showInfoMessage(error);
     });
}
function updateProductsCount(){
   let response = productService.getProductCount();
   document.getElementById('cartItemsId').innerHTML = response.cartCount;
   document.getElementById('favoritesItemsId').innerHTML = response.favoritesCount;
}

function openCartItems(){
   let formatedCart = productService.getCartFormated();
   commonService.showModal('Cart', formatedCart, 'Pay');
}
function openFavoriteItems(){
   let formatedFavorites = productService.getFavoritesFormated();
   commonService.showModal('Favorite',formatedFavorites, 'Remove all');
}
function removeProductFromFavorite(id){
   let response = productService.removeFromFavorite(id);
   openFavoriteItems();
   commonService.showInfoMessage(response);
   updateProductsCount();
}
function removeProductFromCart(id){
   let response = productService.removeFromCart(id);
   openCartItems();
   commonService.showInfoMessage(response);
   updateProductsCount();
}
function searchProducts(){
   let query = document.getElementById('search-query-id').value;
   httpService.getProducts()
   .then(products => {
      let productsHtml = productService.getFormatedSearchProduct(products, 
         product => product.name.toLowerCase().includes(query.toLowerCase()) |  product.price == query);

      document.getElementById('productsListId').innerHTML = productsHtml;
   })
  .catch(error => {
      commonService.showInfoMessage(error);
  });
}
function searchProductsByPrice(){
   let min = document.getElementById('search-query-pricemin-id').value;
   let max = document.getElementById('search-query-pricemax-id').value;
   
   httpService.getProducts()
   .then(products => {
      let productsHtml = productService.getFormatedSearchProduct(products, 
         product => 
         product.price >= Number(min ? min: 0) && 
         product.price <= Number(max ? max: 99999));
         
      document.getElementById('productsListId').innerHTML = productsHtml;
   })
  .catch(error => {
      commonService.showInfoMessage(error);
  });
}
function addRating(id, rating){
   httpService.addRating(id, rating);
   showProduct();
}
function addProduct(){
   let name = document.getElementById('nameId').value; 
   let description =  document.getElementById('descriptionId').value; 
   let price =  document.getElementById('priceId').value; 

   httpService.addProduct(name, description, price);
}
