async function updateOrderInDB(updatedOrder) {
  try {
    const response = await fetch("/update-items", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ updatedOrder }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order");
    }

    const result = await response.json();
    console.log("order sent to backend", result);
  } catch (error) {
    console.error("error updating", error);
  }
}

let list = document.getElementById("list");
new Sortable(list, {
  handle: ".drag_indicator",
  animation: 150,
  onEnd: async function (evt) {
    const reorderedItems = Array.from(document.querySelectorAll(".itemInput"));
    // const itemIDs =
    const updatedOrder = reorderedItems.map((item, index) => ({
      name: item.value,
      order: index + 1,
    }));
    console.log(updatedOrder);
    await updateOrderInDB(updatedOrder);
  },
});

// fetch("/items.json")
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("data sent from app.js NOW WITH NODEMON: ", data);
//   });
