const API_KEY = "eefd6cb1-d24c-42d2-ab50-f7ad3e29abe9";
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const results = document.querySelector(".results");
const body = document.querySelector("body");
const container = document.querySelector(".container");
const foodImgs = document.querySelectorAll(".recommended-row div");
const navbar = document.querySelector(".navbar");
const searchSection=document.querySelector(".search");
const recommendedSection=document.querySelector(".recommended");
const bookmarkSection=document.querySelector(".bookmarks-section");
const toggler=document.querySelector(".fa-bars");
const verticalNav=document.querySelector(".menu-items");
const errMsg=document.querySelector(".err-msg");

//open and close menu
toggler.addEventListener("click",toggleNav);
function toggleNav(e){
  verticalNav.classList.toggle("vertical-nav");
}

let recipeData;
searchBtn.addEventListener("click", searchRecipe);

//for recommended section
foodImgs.forEach((food_img) => {
  food_img.addEventListener("mouseenter", displayName);
  food_img.addEventListener("mouseleave", hideName);
  food_img.addEventListener("click", displaySearchResults);
});
function displayName(e) {
  e.currentTarget.querySelector("p").classList.remove("name-hidden");
}
function hideName(e) {
  e.currentTarget.querySelector("p").classList.add("name-hidden");
}

//search recipes
function searchRecipe(e) {
  if (searchInput.value === "") return;
  const input = searchInput.value;
  results.innerHTML = ` <div class="spinner"></div>`;
  getData(input, "query");
  searchInput.value = "";
}

//getting list of recipes
const getData = async function (input, type) {
  const res = await fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes?search=${input}&key=${API_KEY}`
  );
  if(!res.ok){
    errMsg.style.display="unset";
    results.innerHTML="";
  }
  
  else{
  const data = await res.json();
  if(data.results===0){
  errMsg.style.display="unset";
  results.innerHTML="";
 }
  else{
errMsg.style.display="none";
  if (type === "query") renderRecipeCards(data);
  else if (type === "default") renderDefaultRecipeCards(data);
  }
}
  
};

//rendering recipe cards
function renderRecipeCards(data) {
  if (document.querySelector(".recipe-card")) {
    const cards = document.querySelectorAll(".recipe-card");
    for (let i = 0; i < cards.length; i++) {
      cards[i].remove();
    }
  }
  data.data.recipes.forEach((recipe) => {
    const noOfStars = (Math.random() * (5 - 3) + 3).toFixed(1);
    const recipeCardMarkup = `<a href="#${recipe.id}"><div class="recipe-card">
        <img src="${recipe.image_url}" alt="" class="recipe-card-img">
        <div class="recipe-title">${recipe.title}</div>
        <div class="id">${recipe.id}</div>
        <div class="card-row">
        <p class="publisher">${recipe.publisher}</p>
        <div class="rating"><span class="no-of-stars">${noOfStars} </span><i class="fas fa-star"></i></div>
        </div>
        </div></a>`;
    results.insertAdjacentHTML("beforeend", recipeCardMarkup);
  });
  const recipeCards = document.querySelectorAll(".recipe-card");
  recipeCards.forEach((card) => {
    card.addEventListener("click", getRecipe);
  });
  if (document.querySelector(".spinner")) {
    const spinner = document.querySelector(".spinner");
    spinner.remove();
  }
}

//rendering default recipe cards
function renderDefaultRecipeCards(data) {
  for (let i = 0; i < 5; i++) {
    const recipe = data.data.recipes[i];
    const noOfStars = (Math.random() * (5 - 4) + 4).toFixed(1);
    const recipeCardMarkup = `<a href="#${recipe.id}"><div class="recipe-card">
        <img src="${recipe.image_url}" alt="" class="recipe-card-img">
        <div class="recipe-title">${recipe.title}</div>
        <div class="id">${recipe.id}</div>
        <div class="card-row">
        <p class="publisher">${recipe.publisher}</p>
        <div class="rating"><span class="no-of-stars">${noOfStars} </span><i class="fas fa-star"></i></div>
        </div>
        </div></a>`;
    results.insertAdjacentHTML("afterbegin", recipeCardMarkup);
  }
  const recipeCards = document.querySelectorAll(".recipe-card");
  recipeCards.forEach((card) => {
    card.addEventListener("click", getRecipe);
  });
  if (document.querySelector(".spinner")) {
    const spinner = document.querySelector(".spinner");
    spinner.remove();
  }
}
//getting detailed recipe
const getRecipe = async function (e) {
  e.preventDefault();
  const id = e.currentTarget.querySelector(".id").textContent;
  const res = await fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes/${id}?key=${API_KEY}`
  );
  const data = await res.json();
  renderRecipe(data);
};

//rendering detailed recipe
function renderRecipe(data) {
  if (localStorage.getItem("recipeData")) {
    recipeData = JSON.parse(localStorage.getItem("recipeData"));
  } else {
    recipeData = [];
  }
  let isBookmarked;
  for (let i = 0; i < recipeData.length; i++) {
    if (data.data.recipe.id === recipeData[i].recId) {
      isBookmarked = true;
    }
  }
  const markup = `<div class="recipe-view">
    <div class="recipe-details">
    <div class="part-1">
        
            <div class="heading">
            <h2 class="recipe-name">${data.data.recipe.title}</h2>
            <span class="recipe-id">${data.data.recipe.id}</span>
            </div>
           
       
        <div class="ingredients">
            <h3>Ingredients</h3>
            <ul class="ing-list">
                
            </ul>
        </div>
    </div>
    <div class="part-2">
        
        <div class="close-btn"><i class="fas fa-times"></i></div>
        <div class="white-part-2">
        <div class="image"><img src="${
          data.data.recipe.image_url
        }" alt=""></div>
        <div class="info">
        <div class="publisher-name">
            <h5>Publisher:</h5>
            <p>${data.data.recipe.publisher}</p>
        </div>
        <div class="cooking-time">
            <h5>Cooking Time:</h5>
            <p>${data.data.recipe.cooking_time} mins</p>
        </div>
        <div class="servings">
            <h5>Servings:</h5>
            <p>${data.data.recipe.servings}</p>
        </div>
      </div>
      <div class="btn-row">
          <div class="directions">
        <a href="${
          data.data.recipe.source_url
        }" target="blank" class="directions-link"><button class="directions-btn" type="button">Directions</button></a>
       </div>
       <div class="favourite">
        <div class="add-to-favourite"><button class="add-to-fav-btn"><i class="${
          isBookmarked ? "fas" : "far"
        } fa-heart"></i></button></div>
       </div>
      </div>
      

    </div>
    </div>
</div>
</div>  `;

  body.insertAdjacentHTML("beforeend", markup);
  const recipeView = document.querySelector(".recipe-view");
  data.data.recipe.ingredients.forEach((ing) => {
    if(!ing.quantity)
    ing.quantity="";
    const ingStr = `${ing.quantity} ${ing.unit} ${ing.description}`;
    const ingMarkup = `<li class="ing">${ingStr}</li>`;
    recipeView.querySelector("ul").insertAdjacentHTML("beforeend", ingMarkup);
  });

  container.classList.add("overlay");
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", closeModal);
  function closeModal(event) {
    container.classList.remove("overlay");
    recipeView.style.display = "none";
    recipeView.remove();
  }
  const favBtn = document.querySelector(".favourite");
  favBtn.addEventListener("click", addToFav);
  function addToFav(event) {
    const curRecipe = event.currentTarget.closest(".recipe-view");
    const id = curRecipe.querySelector(".recipe-id").textContent;

    if (event.currentTarget.querySelector("i").classList.contains("far")) {
      event.currentTarget.querySelector("i").classList.remove("far");
      event.currentTarget.querySelector("i").classList.add("fas");
      const title = curRecipe.querySelector(".recipe-name").textContent;
      const publisher =
        curRecipe.querySelector(".publisher-name p").textContent;
      const imageUrl = data.data.recipe.image_url;
      const recObj = {
        recId: id,
        recTitle: title,
        recPublisher: publisher,
        recImage: imageUrl,
      };
      recipeData.push(recObj);
      localStorage.setItem("recipeData", JSON.stringify(recipeData));
    } else {
      event.currentTarget.querySelector("i").classList.add("far");
      event.currentTarget.querySelector("i").classList.remove("fas");
      recipeData = recipeData.filter((data) => {
        if (id !== data.recId) return data;
      });
      localStorage.setItem("recipeData", JSON.stringify(recipeData));
      renderBookmarks();
    }
  }
}
//displaying search results for food images in recommended section
function displaySearchResults(e) {
  const query = e.currentTarget.querySelector("p").textContent;
  getData(query, "query");
}
//getting data for default recipe cards
function renderDefaultData() {
  results.innerHTML = ` <div class="spinner"></div>`;
  getData("pizza", "default");
  getData("noodle", "default");
  getData("tomato", "default");
}
const bookmarkPage = document.querySelector(".bookmark-page");

//rendering bookmarks
function renderBookmarks(e) {
  if(window.location.hash.slice(1)==="bookmarks"){
  searchSection.style.display="none";
  recommendedSection.style.display="none";
  bookmarkSection.style.display="block";
  const bookmarks = document.querySelector(".bookmarks");
  bookmarks.innerHTML="";
  let recipeData;
  if (localStorage.getItem("recipeData")) {
    recipeData = JSON.parse(localStorage.getItem("recipeData"));
  }

  if (!localStorage.getItem("recipeData") || recipeData.length === 0) {
    const msgMarkup = ` <div class="message">
      <p>You haven't added any recipes to your collection yet.</p>
    </div>`;
    bookmarks.insertAdjacentHTML("beforeend", msgMarkup);
    return;
  }
  bookmarks.innerHTML = "";
  recipeData.forEach((recipe) => {
    const noOfStars = (Math.random() * (5 - 4) + 4).toFixed(1);
    const recipeCardMarkup = `<a href="#${recipe.recId}"><div class="recipe-card">
          <img src="${recipe.recImage}" alt="" class="recipe-card-img">
          <div class="recipe-title">${recipe.recTitle}</div>
          <div class="id">${recipe.recId}</div>
          <div class="card-row">
          <p class="publisher">${recipe.recPublisher}</p>
          <div class="rating"><span class="no-of-stars">${noOfStars} </span><i class="fas fa-star"></i></div>
          </div>
          </div></a>`;
    bookmarks.insertAdjacentHTML("beforeend", recipeCardMarkup);
  });
  const recipeCards = document.querySelectorAll(".recipe-card");
  recipeCards.forEach((recipeCard) => {
    recipeCard.addEventListener("click", getRecipe);
  });
}
else if(window.location.hash.slice(1)==="contact"){
  return;
}
else{
  searchSection.style.display="block";
  recommendedSection.style.display="block";
  bookmarkSection.style.display="none";
}

}
window.addEventListener("hashchange", renderBookmarks);
window.addEventListener("load", renderDefaultData);


