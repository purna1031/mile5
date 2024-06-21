'use strict';
const { Model, Op } = require('sequelize');
const { format } = require('date-fns');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list\n");

      console.log("Overdue");
      const overdueItems = await this.overdue();
      overdueItems.forEach(item => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Today");
      const dueTodayItems = await this.dueToday();
      dueTodayItems.forEach(item => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const dueLaterItems = await this.dueLater();
      dueLaterItems.forEach(item => console.log(item.displayableString()));
      console.log();
    }

    static async overdue() {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today
          },
          completed: false
        }
      });
    }

    static async dueToday() {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await Todo.findAll({
        where: {
          dueDate: today,
          completed: false
        }
      });
    }

    static async dueLater() {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today
          },
          completed: false
        }
      });
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      } else {
        console.error(`Todo with id ${id} not found`);
      }
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const formattedDate = this.dueDate !== format(new Date(), 'yyyy-MM-dd') ? this.dueDate : '';
      return `${this.id}. ${checkbox} ${this.title} ${formattedDate}`.trim();
    }
  }

  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });

  return Todo;
};
