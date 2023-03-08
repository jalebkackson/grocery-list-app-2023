const deleteButton = document.querySelectorAll(".remove-btn");

deleteButton.forEach((button, i) => {
  button.addEventListener("click", (e) => {
    // match the endpoint to the app.delete endpoint -> "/:id"
    const endPoint = `/${button.classList[2]}`;
    // remove element so the page doesn't need to be refreshed to see changes
    const item = button.parentNode.parentNode;
    item.remove();
    // fetch the endpoint and send the delete method
    fetch(endPoint, {
      method: "DELETE",
    });
  });
});
