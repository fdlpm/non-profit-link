class Modal {
    headersForItemApi = {
        'Content-Type': 'application/json',
        "X-CSRFToken": getCookie("csrftoken"),
        "Accept": "application/json",
    }
    apiUrl = "http://127.0.0.1:8000/items/manage-item/"

    constructor(isWant, needOrWant) {
        this.isWant = isWant
        this.needOrWant = needOrWant
        this.myModal = document.querySelector(`#${needOrWant}-modal`)
        this.OpenButton = document.getElementById(`${needOrWant}-button`)
        this.DashboardItemsList = document.getElementById(`${needOrWant}-items-dashboard`)
        this.ModalItemsList = document.getElementById(`${needOrWant}-items-list`)
        this.NewButton = document.getElementById(`${needOrWant}-new-button`)
    }
}

// GLOBAL
const headersForItemApi = {'Content-Type': 'application/json',
                    "X-CSRFToken": getCookie("csrftoken"),
                    "Accept": "application/json",}
const apiUrl = "http://127.0.0.1:8000/items/manage-item/"



// NEEDS MODAL
const needsModal = document.querySelector("#needs-modal") 
const needsButton = document.getElementById("needs-button")
const neededDashboardItemsList = document.getElementById("needed-items-dashboard")
const neededModalItemsList = document.getElementById("needed-items-list")
const needsNewButton = document.getElementById("needs-new-button")

needsButton.onclick = function() {
    showMyModal(needsModal)
}

// POST request logic for Needs Modal
const needsModalNewItem = createNewItem()

function createItem() {
    needsModalNewItem(postItem)
}

needsNewButton.onclick = createItem

// uses closure :p
function createNewItem(){
    const neededModalItemsList = document.getElementById("needed-items-list")
    let itemCounter = 0
    return function (buttonFunction, oldName) {
        itemCounter++
        let oldNameData = ""
        if (oldName !== "") {
            oldNameData = "data-old_name=" + oldName
        }
        neededModalItemsList.insertAdjacentHTML('beforeend', `
        <div id='js-item-${itemCounter}' class="item">
            <input id='number-of-units-${itemCounter}'type='number' value='0'>
            <input id='unit-type-${itemCounter}' type='text' value='units'> of 
            <input id='item-name-${itemCounter}' type='text' value='item'>
            <button ${oldNameData} data-item_id=${itemCounter} id='create-item-${itemCounter}'>&check;</button>
        </div>
        `)
        const newButton = document.getElementById("create-item-" + itemCounter)
        newButton.onclick = buttonFunction
        return itemCounter
    }
}

async function postItem(event) {
    const itemId = event.target.dataset.item_id
    const itemName = document.getElementById('item-name-' + itemId).value
    const unitsDescription = document.getElementById('unit-type-' + itemId).value
    const numberOfUnits = document.getElementById('number-of-units-' + itemId).value
    const postOptions = {
        method: 'POST',
        headers: headersForItemApi,
        // adding the 'want' field
        body: JSON.stringify({"item_name": itemName, "want": true, "units_description": unitsDescription, "count": numberOfUnits, "input_id": itemId})
    }
    const postReponse = await fetch(apiUrl, postOptions)
    if (postReponse.ok) {
        // delete input fields 
        const toRemove = document.getElementById("js-item-" + itemId)
        toRemove.remove()
        // create a basic item field
        const newModalItem = `
            <div class="item">
                ${numberOfUnits} ${unitsDescription} of ${itemName}
                <button data-name="${itemName}" class="delete-item" id="delete-item-${itemName}"></button>
                <button data-name="${itemName}" class="edit-item" id="edit-item-${itemName}"></button>
            </div>
        `
        const newDashboardItem = `
            <div class="item" id="dashboard-delete-item-${itemName}">
                ${numberOfUnits} ${unitsDescription} of ${itemName}
            </div>
        `
        // if there were errors, but the user corrected them...
        const areErrors = document.getElementById("modal-error-" + itemId)
        if (areErrors) {
            areErrors.remove()
        }
        // render new items
        neededDashboardItemsList.insertAdjacentHTML('beforeend', newDashboardItem)
        neededModalItemsList.insertAdjacentHTML('beforeend', newModalItem)

        // add functionality to the added buttons
        const newDeleteButton = document.getElementById("delete-item-" + itemName)
        const newEditButton = document.getElementById("edit-item-" + itemName)
        newDeleteButton.onclick = deleteItem
        newEditButton.onclick = createItemToEdit
    }
    else {
        // render errors
        const errorData = await postReponse.json()
        renderErrors(errorData)
    }
}



// DELETE request logic
const deleteButtons = document.getElementsByClassName("delete-item")
for (let button of deleteButtons) {
    button.onclick = deleteItem
}  

// deletes an item
async function deleteItem(event) {
    const deleteButton = event.target
    const userConfirmation = confirm("Are you sure that you want to delete this item?")
    if (userConfirmation) {
        const itemName = deleteButton.dataset.name
        const deleteOptions = {
            method: 'DELETE',
            headers: headersForItemApi
        }
        const deleteRequest = await fetch(apiUrl + itemName + "/", deleteOptions)
        if (deleteRequest.ok) {
            // visually remove the deleted item from the dashboard and modal
            const dashboardItem = document.getElementById("dashboard-delete-item-" + itemName)
            dashboardItem.remove()
            deleteButton.parentElement.remove()
        }
        else {
            // this is very unlikely to happen, so we just use an alert instead of rendering errors
            alert("Something went wrong! Please try deleting the item again.")
        }
    }
}

// PUT request logic
const editButtons = document.getElementsByClassName("edit-item")
for (let button of editButtons) {
    button.onclick = createItemToEdit
}

function createItemToEdit(event) {
    const oldName = event.target.dataset.name
    needsModalNewItem(saveEditedItem, oldName)
    const button = event.target
    button.remove()
}

async function saveEditedItem(event) {
    const editButton = event.target
    const itemId = editButton.dataset.item_id
    const oldItemName = editButton.dataset.old_name
    const newItemName = document.getElementById('item-name-' + itemId).value
    const unitsDescription = document.getElementById('unit-type-' + itemId).value
    const numberOfUnits = document.getElementById('number-of-units-' + itemId).value
    const putOptions = {
        method: 'PUT',
        headers: headersForItemApi,
        body: JSON.stringify({"old_item_name": oldItemName, "new_item_name": newItemName, "want": true, "units_description": unitsDescription, "count": numberOfUnits, "input_id": itemId}),
    }
    const putResponse = await fetch(apiUrl, putOptions)
    if (putResponse.ok) {
        // visually update the old item's info on the dashboard and moal
        const oldDashboardElement = document.getElementById("dashboard-delete-item-" + oldItemName)
        const newItemInfo = `${numberOfUnits} ${unitsDescription} of ${newItemName}`
        oldDashboardElement.setAttribute("id", "dashboard-delete-item-" + newItemName)
        oldDashboardElement.innerHTML = newItemInfo

        editButton.parentElement.remove()

        const oldModalElement = document.getElementById("delete-item-" + oldItemName)
        oldModalElement.parentElement.remove()

        neededModalItemsList.insertAdjacentHTML('beforeend', `
            <div class="item">
                ${newItemInfo}
                <button data-name="${newItemName}" class="delete-item" id="delete-item-${newItemName}"></button>
                <button data-name="${newItemName}" class="edit-item" id="edit-item-${newItemName}"></button>
            </div>
        `)

        const newDeleteButton = document.getElementById("delete-item-" + newItemName)
        const newEditButton = document.getElementById("edit-item-" + newItemName)
        newDeleteButton.onclick = deleteItem
        newEditButton.onclick = createItemToEdit 

        // if there were errors, but the user corrected them...
        const areErrors = document.getElementById("modal-error-" + itemId)
        if (areErrors) {
            areErrors.remove()
        }
    }
    else {
        const errorData = await putResponse.json()
        renderErrors(errorData)
    }
}

const needsCloseButton = document.getElementById("needs-close-button")
needsCloseButton.onclick = function() {
    hideMyModal(needsModal)
}



// SURPLUS MODAL
const surplusModal = document.querySelector('#surplus-modal')
const surplusOpenButton = document.getElementById("surplus-button")
const surplusCloseButton = document.getElementById("surplus-close-button")

surplusOpenButton.onclick = function() {
    showMyModal(surplusModal)
}

surplusCloseButton.onclick = function() {
    hideMyModal(surplusModal)
}



// HELPER FUNCTIONS
// taken from Django's docs <3
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
return "";
}
    
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
}

function showMyModal(modal) {
    modal.showModal()
    document.body.style.overflow = "hidden"
}

function hideMyModal(modal) {
    modal.setAttribute("closing", "");
    modal.addEventListener(
        "animationend",
        () => {
            modal.removeAttribute("closing");
            modal.close();
            document.body.style.overflow = "auto"
        },
        { once: true }
    )
}

// renders errors SPECIFICALLY for the Item API
function renderErrors(errorData) {
    const itemId = errorData["input_id"]
    const errors = errorData["errors"]
    let displayedErrors = ""
    for (let error of Object.keys(errors)) {
        displayedErrors += "<li>" + errors[error][0] + "</li>"
    }
    const isPresentError = document.getElementById("modal-error-" + itemId)
    // if there's not an error present already, do nothing
    if (!isPresentError) {
        const itemWithError = document.getElementById("js-item-" + itemId)
        itemWithError.insertAdjacentHTML('beforebegin', `
            <ul id="modal-error-${itemId}">
                ${displayedErrors}
            </ul>
        `)
    }
}





