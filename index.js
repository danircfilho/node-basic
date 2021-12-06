// external modules
const inquirer = require('inquirer')
const chalk = require('chalk')

// internal modules
const fs = require('fs')

console.log('Programa Iniciado!')

//Invoke function
operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Create an account', 'Check balance', 'Deposit', 'Withdraw money', 'Quit']
            //Criar conta, Verificar saldo, Deposito, Sacar dinheiro, Sair
        },
    ])
    .then((answer) => {
        const action = answer['action']

        if(action === 'Create an account') {
            createAccount()
        }
    })
    .catch((err) => console.log(err))
}

//Criar a conta bancária
function createAccount() {
    console.log(chalk.bgGreen.black("Congratulations on choosing our bank!"))
    console.log(chalk.green("Set your account options below"))
}