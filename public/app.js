const olIndex = document.get;

let list = document.getElementById("list");
new Sortable(list, {
  handle: ".drag_indicator",
  animation: 150,
});

fetch("/items.json")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
