import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// configuration
const firebaseConfig = {
    databaseURL: 'https://sdf06-6f266-default-rtdb.europe-west1.firebasedatabase.app'
};

// initialization and connection to firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const collection = ref(database, "cart-list");

// syncs with firebase and fires update function when data changes
onValue(collection, function(snapshot) {
    const data = snapshot.val();

    updateList(data)
})

function removeItem(id) {
    const itemsRef = ref(database, `cart-list/${id}`);

    remove(itemsRef);
}

// managers cleanup and creating list
function updateList(data) {
    const container = document.getElementById("list-box");// gets the container

    // check if the container is already full and cleans it
    if (document.getElementById("list")) {
        container.removeChild(document.getElementById("list"))
    }

    // creates new list for the container
    const list = document.createElement("ul");
    list.id = "list"

    // loops data and create list items and add them to the list
    for (const key in data) {
        const li = document.createElement("li");
        li.textContent = `${data[key]}`;
        li.id = key;

        // adding remove event listener on each item
        li.addEventListener("click", function(e) {
            // settimeout to allow for css effect to play
            removeItem(e.target.id)
        })

        list.appendChild(li);
    }

    // adds list to the container in one update for better performance
    container.appendChild(list);
}

// add click handler to add-button tag
document.getElementById("add-button").addEventListener("click", function() {
    // gets input value
    let inputValue = document.getElementById("input-field").value

    // pushes data to the database
    push(collection, inputValue);

    // clears input value
    document.getElementById("input-field").value = '';
})