import { fetchAPIData, getAdoptablePetURL, renderSection, loadCommonHTMLelement, getLocalStorage, setLocalStorage} from "./share.mjs";

loadCommonHTMLelement();

showInstruction();

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
   

function showInstruction() {
    const visites_name = 'visites';
    const last_time_name = 'last_time';

    let visits = getLocalStorage(visites_name);
    let last_time = getLocalStorage(last_time_name);

    visits ??= 0;
    let expired = true;

    if (last_time != null){
        expired = checkExpired(last_time);
    }

    if (visits == 0 || expired){
        document.querySelector('#instruction').style.display = 'block';
    }else {
        document.querySelector('#instruction').style.display = 'none';
    }

    visits += 1;
    last_time = Date();

    setLocalStorage(visites_name, visits);
    setLocalStorage(last_time_name, last_time);
}

function checkExpired(last_time) {

    let expired = true;

    const thirty_days = (1000 * 3600 * 24) * 30;

    const converted_time = Date.parse(last_time);
    const today = new Date().getTime();
    const timeDiff = today - converted_time;

    if (timeDiff < thirty_days) {
        expired = false;
    }

    return expired;
}