class HttpService {
    commonService = new CommonService();
    productService = new ProductService();

    register(email, password){
        //adaugam header
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //adaugam body
        let bodyJson = JSON.stringify({"email": email, "password": password});

        //adaugam requestOptions
        let requestOption ={
            method: 'POST',
            headers: myHeaders,
            body: bodyJson
        };

        //facem call-ul catre backend
        fetch("https://ilbahtraining.azurewebsites.net/register", requestOption)
        .then(response => response.text())
        .then(token => {
            window.commonService.setToStorage('token', token);
            commonService.showInfoMessage("You're registered");
            window.location.href = 'login.html';
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }
    login(email, password){
        //adaugam header
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        //adaugam body
        let bodyJson = JSON.stringify({"email": email, "password": password});

        //adaugam requestOptions
        let requestOption ={
            method: 'POST',
            headers: myHeaders,
            body: bodyJson
        };

        //facem call-ul catre backend
        fetch("https://ilbahtraining.azurewebsites.net/login", requestOption)
        .then(response => response.text())
        .then(token => {
            if(token == 'Unauthorized'){
                commonService.showInfoMessage('Unauthorized');
            }else{
                window.commonService.setToStorage('token', token);
                commonService.showInfoMessage("You're loggedin");
                window.location.href = 'products.html';
            }
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }
    addProduct(name, description, price){

        let body = {"name": name, "description": description, "price": price};

        fetch("https://ilbahtraining.azurewebsites.net/api/Product", this.getHeaderWithTokenAndBody(body, 'POST'))
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
            window.location.href = 'products.html';
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }
    getProducts(){
        return fetch("https://ilbahtraining.azurewebsites.net/api/Product", this.getHeaderWithToken('GET'))
        .then(response => response.json())
        
    }
    deleteProductById(id){
        fetch(`https://ilbahtraining.azurewebsites.net/api/Product/${id}`, this.getHeaderWithToken('POST'))
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }
    getProductbyId(id){
        return fetch(`https://ilbahtraining.azurewebsites.net/api/Product/${id}`, this.getHeaderWithToken('GET'))
                .then(response => response.json())
    }
    addRating(productId, rating){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        let requestOption = {
            method: 'POST',
            headers: myHeaders
        };
        //`https://ilbahtraining.azurewebsites.net/api/rating?productId=17&rating=5`
        fetch(`https://ilbahtraining.azurewebsites.net/api/rating?productId=${productId}&rating=${rating}`, requestOption)
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }
    updateProduct(product){
        fetch("https://ilbahtraining.azurewebsites.net/api/Product", this.getHeaderWithToken(product, 'PUT'))
        .then(response => response.text())
        .then(result => {
            commonService.showInfoMessage(result);
            document.location.href = "products.html";
        })
        .catch(error => {
            commonService.showInfoMessage(error);
        });
    }
    getHeaderWithTokenAndBody(body, method){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        return {
            method: method,
            headers: myHeaders,
            body: JSON.stringify(body)
        };
    }
    getHeaderWithToken(method){
        let token = localStorage.getItem('token');

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("token", token);

        return {
            method: method,
            headers: myHeaders,
        };
    }
}
