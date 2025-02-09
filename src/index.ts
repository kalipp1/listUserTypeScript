const inquirer = require('inquirer');
const consola = require('consola');

enum msgVariant {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info'
}

class Message {
    constructor(private content: string) {}
    public show(): void {
        console.log(this.content);
    }
    public capitalize(): string {
        this.content = this.content.charAt(0).toUpperCase()+ this.content.slice(1);
        return this.content;
    }
    public toUpperCase(): string {
        this.content = this.content.toUpperCase();
        return this.content;
    }
    public toLowerCase(): string {
        this.content = this.content.toLowerCase();
        return this.content;
    }
    public static showColorized(variant: msgVariant, content: string): void {
        if(variant === msgVariant.SUCCESS){
            consola.success(content);
        } else if(variant === msgVariant.ERROR){
            consola.error(content);
        } else if (variant === msgVariant.INFO){
            consola.info(content)
        }
    }
}

interface User {
    name: string,
    age: number
}

class usersData {
    public data: User[] = [];

    public showAll(): void {
        if(this.data){
            Message.showColorized(msgVariant.INFO, "Users data");
            console.table(this.data);
        } else if(!this.data) {
            console.log("No data...");
        }
    }

    public add(User: User): void {
        if(typeof User.name === "string" && User.name.length > 0 && User.age > 0 && typeof User.age === "number"){
            this.data.push(User);
            Message.showColorized(msgVariant.SUCCESS, "User has been successfully added!");
        } else {
            Message.showColorized(msgVariant.ERROR, "Wrong data!");
        }
    }

    public remove(name: string): void {
        const user = this.data.find(user => user.name === name);
        if(user) {
            this.data = this.data.filter(u => u.name !== name);
            Message.showColorized(msgVariant.SUCCESS, "User has been successfully removed!");
        } else {
            Message.showColorized(msgVariant.ERROR, "User not found...");
        }
    }

    public async edit(name: string): Promise <void> {
        const user = this.data.find(user => user.name === name);
        if(user) {
            const updatedUser = await inquirer.prompt([
                {
                    name: "name",
                    type: "input",
                    message: "Enter new name:",
                    default: user.name
                },
                {
                    name: "age",
                    type: "number",
                    message: "Enter new age:",
                    default: user.age
                }
            ]);

            user.name = updatedUser.name;
            user.age = updatedUser.age;
            Message.showColorized(msgVariant.SUCCESS, "User has been successfully updated!");
        } else {
            Message.showColorized(msgVariant.ERROR, "User not found...");
        }
    }
}

enum Action {
    List = "list",
    Add = "add",
    Remove = "remove",
    Quit = "quit",
    Edit = "edit"
  }
  
  type InquirerAnswers = {
    action: Action
  }

  const users = new usersData();
  console.log("\n");
  console.info("???? Welcome to the UsersApp!");
  console.log("====================================");
  Message.showColorized(msgVariant.INFO, "Available actions");
  console.log("\n");
  console.log("list – show all users");
  console.log("add – add new user to the list");
  console.log("edit – edit user from the list");
  console.log("remove – remove user from the list");
  console.log("quit – quit the app");
  console.log("\n");

  const startApp = () => {
    inquirer.prompt([{
      name: 'action',
      type: 'input',
      message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          break;
        case Action.Add:
          const user = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }, {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          }]);
          users.add(user);
          break;
        case Action.Remove:
          const name = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }]);
          users.remove(name.name);
          break;
        case Action.Quit:
          Message.showColorized(msgVariant.INFO, "Bye bye!");
          return;
        case Action.Edit:
            const editName = await inquirer.prompt([
                { name: "name", type: "input", message: "Enter name of user to edit:" }
            ]);
            await users.edit(editName.name);
            break;
        default:
            Message.showColorized(msgVariant.ERROR, "Chosen action undefined please choose action from list, add, remove or quit");
      }
  
      startApp();
    });
  }

  startApp();