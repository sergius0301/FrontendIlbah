class ProductService{ // var productService = new ProductService();
    constructor(){
        this.productNotFoundMsg = 'Product not found';
        this.cartList = this.getCartProductsFromStorage();
        this.favoriteList = this.getFavoritesProductsFromStorage();
    }
    //transformam produsele intr-un string concatenat pe care il adaugam in html
    getFormatedProducts(products){
        var concatenatedProducts ='';

        products.forEach(product => {

            //pentru fiecare produs construieste urmatorul html
            concatenatedProducts += 
            `
            <div class="col-3 border m-2">
                <p>${product.name}</p>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <i class="bi bi-trash" onclick="removeProduct(${product.id})"> remove</i></br>
                <i class="bi bi-arrows-fullscreen" onclick="openProduct(${product.id})"> show</i></br>
                <i class="bi bi-brush" onclick="updateProductById(${product.id})"> update</i></br>
                <i class="bi bi-cart" onclick="addToCart(${product.id})"> cart</i></br>
                <i class="bi bi-heart" onclick="addToFavorites(${product.id})"> favorite</i>
            </div>`
         });
         return concatenatedProducts;
    }
    getFormatedSearchProduct(products, filter){
        var concatenatedProducts ='';

        products
        .filter(filter)
        .forEach(product => {
            
            //pentru fiecare produs construieste urmatorul html
            concatenatedProducts += 
            `
            <div class="col-3 border m-2">
                <p>${product.name}</p>
                <p>${product.description}</p>
                <p>${product.price}</p>
                <i class="bi bi-trash" onclick="removeProduct(${product.id})"> remove</i></br>
                <i class="bi bi-arrows-fullscreen" onclick="openProduct(${product.id})"> show</i></br>
                <i class="bi bi-brush" onclick="updateProductById(${product.id})"> update</i></br>
                <i class="bi bi-cart" onclick="addToCart(${product.id})"> cart</i></br>
                <i class="bi bi-heart" onclick="addToFavorites(${product.id})"> favorite</i>
            </div>`
         });
         
         return concatenatedProducts;
    }

    getFormatedProduct(product){
        if(product){
            return  `
            <p>${product.name}</p>
            <p>${product.description}</p>
            <p>${product.price}</p>
            ${this.getNumberOfStars(product)}
            `;
        }
    }
    getNumberOfStars(product){
        let concatenatedStars ='';
        let rating = product.rating.avgRating;
        if(rating){
            for (let index = 1; index <= 5; index++) {
                if(index <= rating){
                    concatenatedStars += ` <span class="fa fa-star checked" onclick="addRating(${product.id}, ${index})"></span>`
                }else{
                    concatenatedStars += ` <span class="fa fa-star" onclick="addRating(${product.id}, ${index})"></span>`
                }
            }
            return concatenatedStars;
        }else{
            return `
            <span class="fa fa-star" onclick="addRating(${product.id}, 1)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 2)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 3)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 4)"></span>
            <span class="fa fa-star" onclick="addRating(${product.id}, 5)"></span> `;
        }
    }
    updateCartStorage(){
        commonService.setToStorage('cartProducts', JSON.stringify(this.cartList));
    }
    updateFavoritesStorage(){
        commonService.setToStorage('favorites', JSON.stringify(this.favoriteList));
    }
    getCartProductsFromStorage(){
        let cartProducts =  JSON.parse(localStorage.getItem('cartProducts'));
        if(cartProducts){
            return cartProducts
        }else{
            return [];
        }
    }
    addProductToCart(product){
        this.cartList.push(product);
        this.updateCartStorage();
        return 'Product was added to cart'
    }
    addProductToFavorites(product){
        this.favoriteList.push(product);
        this.updateFavoritesStorage();
        return 'Product was added to favorites'
    }
    getProductCount(){
        return {
            cartCount: this.cartList.length,
            favoritesCount: this.favoriteList.length
        };
    }
    getFavoritesProductsFromStorage(){
        let products = JSON.parse(localStorage.getItem('favorites'));
        return products ? products : [];
    }
    getFavoritesFormated(){
        let concatenatedProducts = '';

        this.favoriteList.forEach(product => {
            concatenatedProducts += 
            `<div class="col border m-2">
                <p>${product.name} - ${product.price}
                    <button type="button" onclick="removeProductFromFavorite(${product.id})" class="btn-close" aria-label="Close"></button>
                </p>
            </div>
            `
        });
        return concatenatedProducts;
    }
    getCartFormated(){
        let concatenatedProducts = '';

        this.cartList.forEach(product => {
            concatenatedProducts += 
            `<div class="col border m-2">
                <p>${product.name} - ${product.price}
                    <button type="button" onclick="removeProductFromCart(${product.id})" class="btn-close" aria-label="Close"></button>
                </p>
            </div>
            `
        });
        return concatenatedProducts;
    }
    removeFromCart(id){
        for (let index = 0; index < this.cartList.length; index++) {
            const product = this.cartList[index];
            if(product.id == id){
                this.cartList.splice(index, 1);
                this.updateCartStorage();
                return `Product with id ${id} was removed`;
            }
        }
        return `Product with id ${id} doesn't exist`;

    }
    removeFromFavorite(id){
        for (let index = 0; index < this.favoriteList.length; index++) {
            const product = this.favoriteList[index];
            if(product.id == id){
                this.favoriteList.splice(index, 1);
                this.updateFavoritesStorage();
                return `Product with id ${id} was removed`;
            }
        }
        return `Product with id ${id} doesn't exist`;
    }
}

