let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Fetch existing toys and display them
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        addToyToDOM(toy);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });

  
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Handle form submission to add a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();

    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    // POST request to add a new toy
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
     addToyToDOM(newToy);
      toyForm.reset();
    })
    .catch(error => {
      console.log("Error:", error);
    });
  });

  // Function to add toy to the DOM
  function addToyToDOM(toy) {
    const { id, name, image, likes } = toy;

    const card = document.createElement('div');
    card.classList.add('card');

    const h2 = document.createElement('h2');
    h2.innerText = name;

    const img = document.createElement('img');
    img.src = image;
    img.classList.add('toy-avatar');

    const p = document.createElement('p');
    p.innerText = `${likes} Likes`;

    const button = document.createElement('button');
    button.classList.add('like-btn');
    button.id = id;
    button.innerText = "Like ❤️";

    
    button.addEventListener('click', () => {
      const newLikes = likes + 1;

      // PATCH request to update the likes count on the server
      fetch(`http://localhost:3000/toys/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        // Update the likes count in the DOM
        p.innerText = `${updatedToy.likes} Likes`;
      })
      .catch(error => {
        console.log("Error:", error);
      });
    });

   
    card.appendChild(h2);
    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(button);

    toyCollection.appendChild(card);
  }
});
