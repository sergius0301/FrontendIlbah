class CommonService {
    constructor(){}
    
    showInfoMessage(message){
        var messageBar = document.getElementById('messageBarId')
        messageBar.innerHTML = message;
    }
    showModal(title, description, buttonText){
        document.getElementById('modal-title-id').innerHTML = title;
        document.getElementById('modal-body-id').innerHTML = description;
        document.getElementById('action-button-id').innerHTML = buttonText;
        var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {});
        myModal.show();
    }
    setToStorage(key, value){
        localStorage.setItem(key, value);
    }
    getFromStorage(key){
        return localStorage.getItem(key);
    }
    redirect(path){
        document.location.href = path;
    }
}