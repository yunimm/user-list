const INDEX_API = 'https://lighthouse-user-api.herokuapp.com/'
const SHOW_API = INDEX_API + 'api/v1/users/'

const users = []

const userList = document.querySelector('#user-list')

let filteredUserList = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

const USERS_PER_PAGE = 20 
const pagination = document.querySelector('#pagination')


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



function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
    const user = users.find((user) => user.id === id)
    if (list.some((user) => user.id === id)) {
        return alert('已在收藏清單中')
    }
    list.push(user)
    localStorage.setItem('favoriteUser', JSON.stringify(list))
}


// modal
userList.addEventListener('click',function onUserClicked(e){ 
    if (e.target.matches('#img')) {
        showUserModal(Number(e.target.dataset.id))
    } else if (e.target.matches('#heart')) {
        addToFavorite(Number(e.target.dataset.id))

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


searchForm.addEventListener('submit', function onSearchFormSubmitted(e) {
    //取消預設事件
    e.preventDefault()
    //取得搜尋關鍵字
    const keyword = searchInput.value.trim().toLowerCase()
    // 條件篩選
    filteredUserList = users.filter((user) => 
        user.name.toLowerCase().includes(keyword)

    )
        //錯誤處理：輸入無效字串
    if (!keyword.length) {
        alert('請輸入有效字串!')
    } else if (filteredUserList.length === 0) {
        alert('找不到這名使用者，請重新輸入')
    }

    renderPagination(filteredUserList.length)
    renderUserList(getUsersByPage(1))
    
})

function getUsersByPage(page) {
    const data = filteredUserList.length ? filteredUserList : users
    const startIndex = (page-1) * USERS_PER_PAGE
    return data.slice(startIndex,startIndex + USERS_PER_PAGE)
}

function renderPagination(amount) {

    const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
    let rawHTML = ''

    for(let page = 1; page <= numberOfPages; page++) {
        rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    pagination.innerHTML = rawHTML

}

pagination.addEventListener('click', function onPaginationClicked(e) {
    if(e.target.tagName !== 'A') return
    const page = Number(e.target.dataset.page)
    renderUserList(getUsersByPage(page))
})







// Make a request for a user with a given ID
axios
    .get(SHOW_API)
    .then((response) => {
    // handle success
        users.push(...response.data.results)
        // console.log(users)
        renderPagination(users.length)
        renderUserList(getUsersByPage(1))

  })
//   .catch((err) => console(err))
  