import { fetchAPIData, getAdoptablePetURL, renderSection, loadCommonHTMLelement} from "./share.mjs";

loadCommonHTMLelement();

showLimitPet();

document.querySelector('#open_search').addEventListener('click', () => {
    showSearchBox();
})

document.querySelector('#overlay').addEventListener('click', () => {
    hideSearchBox();
})

let searchResult = undefined;

document.querySelector('#search_pet').addEventListener('click', () => {
    showLimitPet();
    hideSearchBox();
})

document.querySelector('#search_pet + button').addEventListener('click', hideSearchBox); 

async function showLimitPet() {
    const form = document.querySelector('form');
    const convertedJSON = formToJSON(form);
    const searchURL = getAdoptablePetURL(convertedJSON);
    searchResult = await fetchAPIData(searchURL);
    const randomPets = getRandomPets(searchResult);

    cleanPets();
    renderSection(randomPets, '#pet_list');
}

function cleanPets() {
    document.querySelector('#pet_list').innerHTML = '';
}


function formToJSON (form) {
    const formData = new FormData(form), convertedJSON = {};

    formData.forEach((value, key)=>{
        convertedJSON[key] = value;
    })

    return convertedJSON;
}

function hideSearchBox(){
    document.querySelector('form').classList.remove('show');
    document.querySelector('#overlay').style.display = 'none';
}

function showSearchBox(){
    document.querySelector('form').classList.add('show');
    document.querySelector('#overlay').style.display = 'block';
}

let randomPets = [];

function getRandomPets(searchResult) {
    const max = 999, limit = 12;
    const adjustLimit = randomPets.length + limit;

    if (searchResult.length < limit) {
        return searchResult;
    }

    while (randomPets.length < adjustLimit) {
        const randomNumber = Math.floor(Math.random() * max);
        const randomPet = searchResult[randomNumber];

        if(randomPet == undefined){
            continue;
        }
        if (randomPets.includes(randomPet)){
            continue;
        }
        if (randomPet.album_file == '' || randomPet.animal_status != 'OPEN'){
            continue;
        }
        randomPets.push(randomPet);
    }
    
    return randomPets.slice(adjustLimit - limit);
}

document.querySelector('#load_more_button').addEventListener('click', ()=>{
    renderSection(getRandomPets(searchResult), '#pet_list');
});
   