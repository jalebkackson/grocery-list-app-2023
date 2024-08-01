console.log("test test we are connected");

let list = document.getElementById("list");
new Sortable(list, {
  handle: ".drag_indicator",
  animation: 150,
});
