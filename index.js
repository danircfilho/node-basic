// external modules
const inquirer = require('inquirer')
const chalk = require('chalk')

// internal modules
const fs = require('fs')

//invoke function
operation()

function operation() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: ['Create an account', 'Check balance', 'Deposit', 'Withdraw money', 'Quit',]
        },
    ])
    .then((answer) => {
        const action = answer['action']

        if(action === 'Create an account') {
            createAccount()
        } else if (action === 'Deposit') {
            deposit()
        } else if (action === 'Check balance') {
            getAccountBalance()
        } else if (action === 'Withdraw money') {
            withdraw()
        } else if (action === 'Quit') {
            console.log(chalk.bgBlue.black('Thank you for using this software!'))
            process.exit() //terminate the system
        }
    })
    .catch((err) => console.log(err))
}

//create an account
function createAccount() {
    console.log(chalk.bgGreen.black('Congratulations on choosing our bank!'))
    console.log(chalk.green('Set your account options below'))

    buildAccount()
    return
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Enter a name for your account',
        },
    ])
    .then((answer) => {
        console.info(answer['accountName'])
        
        const accountName = answer ['accountName']

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }   
        
        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('This account already exists. choose another name!'))

            buildAccount(accountName)
        }   

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance":0}', 
            function (err) {
                console.log(err)
            },
        )

        console.log(
            chalk.green('Congratulations, your account has been created!')
        )

        operation()
    })
    .catch((err) => console.log(err))
}

//add values to account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'what is your account name?',
        },
    ])
    .then((answer) => {
        const accountName = answer ['accountName']

        //check if the account exists
        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'How much do you want to deposit?',
            },
        ])
        .then((answer) => {
            const amount = answer['amount']

            //add an amount
            addAmount(accountName, amount)
            operation()
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}

//check if the account exists
function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('This account does not exist. Choose another one.'))
        return false
    }
    //proceed to code if account exists
    return true
}

function getAccount (accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r', //read
    })
    return JSON.parse(accountJSON)
}

function addAmount (accountName, amount) {
    const accountData = getAccount(accountName) 
    
    if(!amount) {
        console.log(
            chalk.bgRed.black('An error has occurred! Try again later!'
        ))
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`, 
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )
        console.log(
            chalk.green(`Has been deposited R$${amount} into your account!`),
        )
}

//account balance
function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'what is your account name?',
        },
    ])
    .then((answer) => {
        const accountName = answer['accountName']

        //check if the account exists
        if(!checkAccount(accountName)) {
            return getAccountBalance()
        }
        
        const accountData = getAccount(accountName)


        console.log(chalk.bgBlue.black(
            `Your account balance is R$${accountData.balance}`
        ))
        operation()
    })  
    .catch(err => console.log(err))
}

//withdraw amounts from the account
function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'what is your account name?',
        },
    ])
    .then((answer) => {
        accountName = answer['accountName']

        //check if the account exists
        if(!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'How much do you want to withdraw?',
            },
        ])
        .then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)

            operation()
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
}

function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('An error has occurred! Try again later!'))
        return withdraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Value unavailable!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData),
    function (err) {
        console.log(err)
    },

    )
    console.log(chalk.green(`A withdrawal of R$${amount} from your account was made!`))

    operation()
}

