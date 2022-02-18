//parent element to store cards
const task_container=document.querySelector(".task_container");

//Global Store

let globalStore = [];
//card1,card2,card3

const newCard = ({id,imageUrl,taskTitle,taskType,taskDescription}) => `<div class="col-md-6 col-lg-4" id=${id}>
<div class="card">
  <div class="card-header d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-outline-success" id=${id} onclick="editCard.apply(this, arguments)"><i class="fas fa-pen-square" id=${id} onclick="editCard.apply(this, arguments)"></i></button>
        
        <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)"></i></button>      
  </div>
  <img src=${imageUrl} class="card-img-top rounded" alt="book">
  <div class="card-body">
    <h5 class="card-title">${taskTitle}</h5>
    <p class="card-text">${taskDescription}
    </p>
    <p><span class="badge bg-primary">${taskType}</span><p>
  </div>
    <div class="card-footer text-muted">
    <button type="button" class="btn btn-outline-info float-end" data-bs-toggle="modal"
    data-bs-target="#showTask"
    onclick="openTask.apply(this, arguments)"
    id=${id}>Open Task</button></div>
</div>
</div>`

const loadTaskCards = () =>
{
//access localstorage
const getInitialData = localStorage.getItem("Tasky"); //localstorage.Tasky
if(!getInitialData) return;
//if there is no previous object then it will throw error
//convert stringified object to object
const {cards} = JSON.parse(getInitialData);
//{cards : [{,,..}]}

//map around array to generate html card and inject it to DOM
cards.map((cardObject) => {
const createNewCard = newCard(cardObject);
task_container.insertAdjacentHTML("beforeend", createNewCard);
globalStore.push(cardObject);
});

};


const updateLocalStorage = () => localStorage.setItem("Tasky",JSON.stringify({cards : globalStore}) );


const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}`,
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType:document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdesc").value,
    };

    const createnewcard = newCard(taskData);
    task_container.insertAdjacentHTML("beforeend",createnewcard);
    globalStore.push(taskData);
    //add to localstorage so that the inserted card wont be gone after refreshing the browser
    updateLocalStorage();

    //tasky is a key
    //key->data
    //we cant directly store globalStore as it is //a array, so, we will store it in array onlt
    //{card: [{}]}

    //Json is to treat objects and stringify will //convert the object into string.

};

const openTask = (e) => {
  if (!e) e = window.event;

  const getTask = state.taskList.filter(({ id }) => id === e.target.id);
  taskModal.innerHTML = htmlModalContent(getTask[0]);
  
};


//we cant use pop element to delete card because user wont delete only last card
const deleteCard = (event) => {
//id
//event refers to the whole code of that special event

event= window.event;//all events happening in window
const targetID = event.target.id;//event.target will give the id of the element interacted
const tagname = event.target.tagname;//button
console.log(targetID);
//search globalstore array
//filter creates a new array just like map unlike forEach
const newUpdatedArray = globalStore.filter(
  (cardObject) => cardObject.id!==targetID
);

//remove the object having this.id

//loop over the new globalstore and inject updated cards to dom
globalStore = newUpdatedArray;//error if constant
updateLocalStorage();
//in order to delete the whole column we need to have access from parent class which is row i.e. task_container, so, from the button we will have iterate 4 times to reach row div.

if(tagname === "BUTTON")
{
  return task_container.removeChild(event.target.parentNode.parentNode.parentNode);
}

//from icon
return task_container.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);

//accessing DOM to remove them

};

//edit card
//contenteditable - let you edit any content of the function
const editCard = (event) => {
  event = window.event;
  const targetID = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
    //refering to card and not column
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  //here, from childnode[5] we get the card body if we inspect it at 5th number and then in this choildnode we get these components at 1,3,and 5
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  //in footer,first child
  let submitButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute(
    "onclick",
    "saveEditchanges.apply(this, arguments)"
  );
  submitButton.innerHTML = "Save Changes";
};

const saveEditchanges = (event) => {
  event = window.event;
  const targetID = event.target.id;
  console.log(targetID);
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];

  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskType: taskType.innerHTML,
    taskDescription: taskDescription.innerHTML,
  };

  globalStore = globalStore.map((task) => {
    if (task.id === targetID) {
      return {
        id: task.id,
        imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription,
      };
    }
    return task; // Important
    //if dont write return here then the edited data wont be stored.
  });
  updateLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.removeAttribute("onClick");
  submitButton.innerHTML = "In progress";
};


//search list
function myFunction() {
  var input, filter, cards, cardContainer, title, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  cardContainer = document.getElementsByClassName("task_container");
  cards = document.getElementsByClassName("card");
  for (i = 0; i < cards.length; i++) {
    title = cards[i].querySelector(".card-title");
    if (title.innerText.toUpperCase().indexOf(filter) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}
