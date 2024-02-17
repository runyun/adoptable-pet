const basicURL = 'https://data.moa.gov.tw/api/v1/AnimalRecognition?%24top=1000&Page=1' // Need to register to use the top and page filter, because I am not a member so it will just give me back 1,000 pet/per time. 

export async function fetchAPIData(url){
    const fetchData = await fetch(url);
    const data = await fetchData.json();

    return data.Data;
}

export function getAdoptablePetURL(convertedJSON) {
    let searchParameter = '';

    for(const key in convertedJSON) {
        if (convertedJSON[key] != '') {
            searchParameter += `&${key}=${convertedJSON[key]}`;
        }
    }
    const searchURL = basicURL + searchParameter;

    return searchURL;
}

export async function getPetByID (id) {
    const searchURL = `${basicURL}&animal_id=${id}`;
    const pet = await fetchAPIData(searchURL);

    return pet[0]; // it's an one object array
}

export async function getPetsByIDlist(id_list) {

    let petPromises = id_list.map(id => getPetByID(id));
    let pets = await Promise.all(petPromises);

    deleteUnavaliblePet(pets);

    return pets;
}

function deleteUnavaliblePet(pets) {

    pets.forEach((pet, index)=> {
        if (pet == undefined){
            pets.splice(index, 1);
        }
    })
}


export function renderSection(pets, selector) {

    const petList = document.querySelector(selector);

    pets.map(pet => {
        const imageAlt = getImageAlt(pet);

        switch(pet.animal_sex) {
            case 'Female':
                pet.animal_sex = '♀';
                break;
            case 'Male':
                pet.animal_sex = '♂';
                break;
            default:
                pet.animal_sex = '?';
        }
        
        if(pet.age == '') {
            pet.age = '?';
        }

        let petCard = ` 
        <section>
            <div class="pet_image">
                <img src="${pet.album_file}" loading="lazy" alt="${imageAlt}">
            </div>
            <h2 class="gender">${pet.animal_sex}</h2>
            <h2 class="age">${pet.animal_age}</h2>
            <p>Body Type: ${pet.animal_bodytype}</p>
            <p>Color: ${pet.animal_colour == '' ? 'No record':pet.animal_colour}</p>
            <p>Place: ${pet.animal_place}</p>
            <a href="../../pet-detail.html?animal_id=${pet.animal_id}"><button>Know More</button></a>
        </section>`

        petList.innerHTML += petCard;
    })
}

export function getPetsLocalStorage() {
    return JSON.parse(localStorage.getItem('pets'));
}

export function setPetsLocalStorage(pets) {
    localStorage.setItem('pets', JSON.stringify(pets));
}

export async function loadCommonHTMLelement(){
    const head = document.querySelector('head');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    const headTemplate = await loadTemplate('../partial/head.html');
    const headerTemplate = await loadTemplate('../partial/header.html');
    const footerTemplate = await loadTemplate('../partial/footer.html');

    head.insertAdjacentHTML("afterbegin", headTemplate);
    header.insertAdjacentHTML("afterbegin", headerTemplate);
    footer.insertAdjacentHTML("afterbegin", footerTemplate);
}

async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
}

export function getImageAlt(pet) {
    switch(pet.animal_sex){
        case 'F':
            pet.animal_sex = 'Female';
            break;
        case 'M':
            pet.animal_sex = 'Male';
            break;
        default:
            pet.animal_sex = 'Unknow gender';
    }

    return `A ${pet.animal_sex} ${pet.animal_kind} in ${pet.animal_colour} color and body type is ${pet.animal_bodytype}.`;
}