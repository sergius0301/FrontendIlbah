class UserService{
    getFormatedProfileDetail(profile){

        return `
        <p>Name: ${profile.name}</p>
        <p>Email: ${profile.email}</p>
        <p>Age: ${profile.age}</p>
        <p>Gender: ${profile.gender}</p>
        `
    }
}