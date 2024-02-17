import { getImageAlt, getPetByID, getPetsLocalStorage, setPetsLocalStorage, loadCommonHTMLelement, getPetsByIDlist } from "./share.mjs";

loadCommonHTMLelement();

function getURLparameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const pet_id = urlParams.get('animal_id');
    
    return pet_id;
}

const pet_id = getURLparameter();

const pet = await getPetByID(pet_id);

document.querySelector('.heart').addEventListener('click', ()=>{updateFavorite(pet_id);});

const convertedData = convertPetData(pet);

renderSection(convertedData);

initHeartStatus(pet_id);

function convertPetData(pet) {

    if (pet.age == ''){
        pet.age = '??';
    }

    if (pet.animal_remark == ''){
        pet.animal_remark = 'Blank';
    }

    switch(pet.animal_sterilization){
        case 'T':
            pet.animal_sterilization = 'Yes';
            break;
        case 'F':
            pet.animal_sterilization = 'No';
            break;
        default:
            pet.animal_sterilization = 'No record';
    }

    switch(pet.animal_bacterin){
        case 'T':
            pet.animal_bacterin = 'Yes';
            break;
        case 'F':
            pet.animal_bacterin = 'No';
            break;
        default:
            pet.animal_bacterin = 'No record';
    }
    return pet;
}

function renderSection(pet) {
    const detailSection = document.querySelector('#pet_detail');

    const imageAlt = getImageAlt(pet);

    const content = `
    <section>
        <img src="${pet.album_file}" loading="lazy" alt="${imageAlt}">

        <fieldset>
            <legend>Pet information</legend>
            <p>Color: ${pet.animal_colour}</p>
            <p>Gender: ${pet.animal_sex}</p>
            <p>Age: ${pet.animal_age}</h2>
            <p>Body type: ${pet.animal_bodytype}</p>
        </fieldset>

        <fieldset>
            <legend>Adoptive information</legend>
            <p>ID: ${pet.animal_id}</p>
            <p>Sub ID: ${pet.animal_subid}</p>
            <p>Open Date: ${pet.animal_opendate}</p>
            <p>Sterilization: ${pet.animal_sterilization}</p>
            <p>Bacterin: ${pet.animal_bacterin}</p>
            <p>Memo: ${pet.animal_remark}</p>
        </fieldset>

        <fieldset>
            <legend>Shelter</legend>
            <p>Name: <a href="https://www.google.com/search?q=${pet.shelter_name}" target="_blank"><span>${pet.shelter_name} 🔗</span></a></p>
            <p>Address: ${pet.shelter_address}</p>
            <p>Tel: ${pet.shelter_tel}</p>
        </fieldset>

    </section>`

    detailSection.innerHTML = content;
}

function updateHeartStatus(isFavorite) {
    const heart = document.querySelector('.heart');

    if (isFavorite) {
        heart.classList.add('active');

    } else {
        heart.classList.remove('active');
    }

}


function updateFavorite(pet_id) {

    let pets = getPetsLocalStorage();
    
    if(pets == null){
        pets = [];
    }

    if(pets.includes(pet_id)){
        const deleteIndex = pets.indexOf(pet_id);
        pets.splice(deleteIndex, 1);

        updateHeartStatus(false);
    }else{
        pets.push(pet_id);

        updateHeartStatus(true);
    }

    setPetsLocalStorage(pets);
}

function initHeartStatus(pet_id){
    const pets = getPetsLocalStorage();
    if (pets.indexOf(pet_id) != -1){
        document.querySelector('.heart').classList.add('active');
    }
}