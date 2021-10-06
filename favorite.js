const INDEX_API = 'https://lighthouse-user-api.herokuapp.com/'
const SHOW_API = INDEX_API + 'api/v1/users/'

const users = JSON.parse(localStorage.getItem('favoriteUser')) || []

const userList = document.querySelector('#user-list')

let filteredUserList = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


function renderUserList(data) {
    let rawHTML = ''

    data.forEach((item) => {

        rawHTML += `
        <div class="col-md-3 mt-3">
            <div class="card">
                <i class="fas fa-heart" id="heart" data-id="${item.id}"></i>
                <img src="${item.avatar}" class="card-img-top rounded-circle" id="img" alt="user-image" data-toggle="modal" data-target="#info-modal" data-id="${item.id}">
                <div class="card-body">
                    <h5 class="card-title">${item.name} ${item.surname}</h5>
                    <i class="fas fa-map-marker-alt"></i><span>${item.region}</span>
                </div>
            </div>
        </div> 
        
        ` 
    })
  
    userList.innerHTML = rawHTML
    
}





// modal
userList.addEventListener('click',function onUserClicked(e){ 
    if (e.target.matches('#img')) {
        showUserModal(Number(e.target.dataset.id))
        
    } else if (e.target.matches('#heart')) {
        removeFavorite(Number(e.target.dataset.id))
    }
})



function showUserModal(id) {
    const modalTitle = document.querySelector('#user-modal-title')
    const modalBirthday = document.querySelector("#user-modal-birthday");
    const modalAge = document.querySelector("#user-modal-age");
    const modalGender = document.querySelector("#user-modal-gender");
    const modalEmail = document.querySelector("#user-modal-email");
    const modalRegion = document.querySelector("#user-modal-region");

    axios
    .get(SHOW_API + id)
    .then((response) => {
        const data = response.data
        modalTitle.innerHTML = data.name + data.surname
        modalBirthday.innerText = data.birthday
        modalAge.innerText = "Age: " + data.age
        modalGender.innerText = "Gender: " + data.gender
        modalEmail.innerText = "Email: " + data.email
        modalRegion.innerText = "Region: " + data.region

  })




}

function removeFavorite(id) {
    if (!users) return

    const usersIndex = users.findIndex((movie) => movie.id === id)
    if(usersIndex === -1) return

    users.splice(usersIndex,1)

    localStorage.setItem('favoriteUser', JSON.stringify(users))

    renderUserList(users)
}


renderUserList(users)

