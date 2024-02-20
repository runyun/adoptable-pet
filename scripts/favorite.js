import {getLocalStorage, renderSection, getPetsByIDlist, loadCommonHTMLelement } from "./share.mjs";

loadCommonHTMLelement();

async function getFavoriteList() {

    let pet_id_list = getLocalStorage('pets');
    if(pet_id_list == null || pet_id_list.length == 0) {
        document.querySelector('.empty_message').style.display = 'block';
        return
    }

    let pets = await getPetsByIDlist(pet_id_list);

    renderSection(pets, '#pet_list');
}

getFavoriteList();

