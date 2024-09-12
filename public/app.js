const olIndex = document.get;

let list = document.getElementById("list");
new Sortable(list, {
  handle: ".drag_indicator",
  animation: 150,
  onEnd: async function (evt) {
    const reorderedItems = Array.from(document.querySelectorAll(".itemInput"));
    const updatedOrder = reorderedItems.map((item, index) => ({
      name: item.value,
      order: index + 1,
    }));
    console.log(updatedOrder);
  },
});

fetch("/items.json")
  .then((res) => res.json())
  .then((data) => {
    console.log("data sent from app.js NOW WITH NODEMON: ", data);
  });
