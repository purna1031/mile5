const db = require("./models");

const listTodo = async () => {
  try {
    await db.Todo.showList();
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  await listTodo();
})();
