import chalk from "chalk"
import { getDefaultTopic } from "./defaults"

export const displayHelpExamplesForConfigInit = () => {
  console.log(`
Examples:
# create a default configuration  'stm-cli-config.json' 
# and initialize commands with default settings

${chalk.greenBright('stm config init')}

# create and initialize a named configuration
# and initialize commands with default settings

${chalk.greenBright('stm config init --config cloud-broker.json')}
  `)
}

export const displayHelpExamplesForConfigList = () => {
  console.log(`
Examples:
# list commands from the default configuration 'stm-cli-config.json' 

${chalk.greenBright('stm config list')}

# list commands from the named configuration

${chalk.greenBright('stm config list --config cloud-broker.json')}
  `)
}

export const displayHelpExamplesForConfigView = () => {
  console.log(`
Examples:
# view command settings from the default configuration 'stm-cli-config.json' 

${chalk.greenBright('stm config view')}

# view a specific command settings from the named configuration

${chalk.greenBright('stm config view --config cloud-broker.json --name publish')}
  `)
}

export const displayHelpExamplesForConfigDelete = () => {
  console.log(`
Examples:
# delete a specific command from the default configuration 'stm-cli-config.json' 

${chalk.greenBright('stm config delete --name publish2')}

# delete a specific command from the named configuration 

${chalk.greenBright('stm config delete --config cloud-broker.json --name publish2')}

${chalk.yellowBright('NOTE: The default commands created by the initialize operation such as publish, receive, request, reply,\n' +
'queue, client-profile, acl-profile, client-username, connection and semconnection cannot be deleted!!')}
  `)
}


export const displayHelpExamplesForPublish = () => {
  console.log(`
Examples:
// execute the default publish command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm publish')}

${chalk.magentaBright(`HINT: You can view the default publish command settings 'stm config view --name publish'!`)}

// execute a specific publish command from the named configuration 
${chalk.greenBright('stm publish --config cloud-broker.json --name publish2')}

// execute the default publish command with settings defined on the default 
// configuration 'stm-cli-config.json', but publish on topic specified in the 
// command-line (overriding the command settings)
${chalk.greenBright('stm publish --topic ' + getDefaultTopic('publish'))}

${chalk.yellowBright('NOTE: You can override any of the publish parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a publish purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm publish --url ws://localhost:8008 --vpn default --username default --password default --topic ' + getDefaultTopic('publish') + ' --count 5 --interval 1000')}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm publish  --count 2 --interval 1000 --name publish2 --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm publish  --name publish2 --config cloud-broker.json --save-to publish3')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm publish  --count 5 --interval 1000 --name publish2 --config cloud-broker.json --save-to publish4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}
  `)
}

export const displayHelpExamplesForReceive = () => {
  console.log(`
Examples:
// execute the default receive command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm receive')}

${chalk.magentaBright(`HINT: You can view the default receive command settings 'stm config view --name receive'!`)}

// execute a specific receive command from the named configuration 
${chalk.greenBright('stm receive --config cloud-broker.json --name receive')}

// execute the default receive command with settings defined on the default 
// configuration 'stm-cli-config.json', but receive on topic specified in the 
// command-line (overriding the command settings)
${chalk.greenBright('stm receive --topic ' + getDefaultTopic('receive'))}

// execute the default receive command with settings defined on the default 
// configuration 'stm-cli-config.json', but receive from a queue
${chalk.greenBright('stm receive --queue stm-queue --topic ' + getDefaultTopic('receive'))}

${chalk.yellowBright('NOTE: You can override any of the receive parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a receive purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm receive --url ws://localhost:8008 --vpn default --username default --password default --topic ' + getDefaultTopic('receive'))}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm receive --topic "stm/logistics/shipped" "stm/inventory/>" --name receive --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm receive  --name receive --config cloud-broker.json --save-to receive2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm receive --topic "stm/logistics/*" --name receive2 --config cloud-broker.json --save-to receive4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}
  `)
}

export const displayHelpExamplesForRequest = () => {
  console.log(`
Examples:
// execute the default request command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm request')}

${chalk.magentaBright(`HINT: You can view the default request command settings 'stm config view --name request'!`)}

// execute a specific request command from the named configuration 
${chalk.greenBright('stm request --config cloud-broker.json --name request')}

// execute the default request command with settings defined on the default 
// configuration 'stm-cli-config.json', but request on topic specified in the 
// command-line (overriding the command settings)
${chalk.greenBright('stm request --topic ' + getDefaultTopic('request'))}

${chalk.yellowBright('NOTE: You can override any of the request parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a request purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm request --url ws://localhost:8008 --vpn default --username default --password default --topic ' + getDefaultTopic('request'))}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm request --topic "stm/logistics/shipped" --name request --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm request  --name request --config cloud-broker.json --save-to request2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm request --topic "stm/logistics/sipped" --name request2 --config cloud-broker.json --save-to request4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}
    `)
}

export const displayHelpExamplesForReply = () => {
  console.log(`
Examples:
// execute the default reply command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm reply')}

${chalk.magentaBright(`HINT: You can view the default reply command settings 'stm config view --name reply'!`)}

// execute a specific reply command from the named configuration 
${chalk.greenBright('stm reply --config cloud-broker.json --name reply')}

// execute the default reply command with settings defined on the default 
// configuration 'stm-cli-config.json', but reply on topic specified in the 
// command-line (overriding the command settings)
${chalk.greenBright('stm reply --topic ' + getDefaultTopic('reply'))}

${chalk.yellowBright('NOTE: You can override any of the reply parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a reply purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm reply --url ws://localhost:8008 --vpn default --username default --password default --topic ' + getDefaultTopic('reply'))}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm reply --topic "stm/logistics/shipped" --name reply --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm reply  --name reply --config cloud-broker.json --save-to reply2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm reply --topic "stm/logistics/sipped" --name reply2 --config cloud-broker.json --save-to reply4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}
  `)
}

export const displayHelpExamplesForQueue = () => {
  console.log(`
Examples:
// execute the default queue command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm manage queue')}

${chalk.magentaBright(`HINT: You can view the default queue command settings 'stm config view --name queue'!`)}

${chalk.yellowBright('NOTE: The actual operation is determined by the ')}${chalk.greenBright('operation')} parameter - create, update or delete!

// execute a specific queue command from the named configuration 
${chalk.greenBright('stm manage queue --config cloud-broker.json --name queue')}

// execute the default queue command with settings defined on the default 
// configuration 'stm-cli-config.json', but with command-line overrides
${chalk.greenBright('stm manage queue --operation --add-subscriptions ')}${getDefaultTopic('receive')} "stm/logistics/>"

${chalk.yellowBright('NOTE: You can override any of the queue parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a queue purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm manage queue --queue my-queue --semp-url http://localhost:8080 --semp-vpn default --semp-username admin --semp-password admin --add-subscriptions  stm/cli/topic --list-subscriptions')}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm manage queue --add-subscriptions "stm/logistics/shipped" --remove-subscriptions "stm/logistics/>" --name queue --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm manage queue  --name queue --config cloud-broker.json --save-to queue2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm manage queue --add-subscriptions "stm/logistics/sipped" --name queue2 --config cloud-broker.json --save-to queue4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}  
    `)
}

export const displayHelpExamplesForAclProfile = () => {
  console.log(`
Examples:
// execute the default acl-profile command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm manage acl-profile')}

${chalk.magentaBright(`HINT: You can view the default acl-profile command settings 'stm config view --name acl-profile'!`)}

${chalk.yellowBright('NOTE: The actual operation is determined by the ')}${chalk.greenBright('operation')} parameter - create, update or delete!

// execute a specific acl-profile command from the named configuration 
${chalk.greenBright('stm manage acl-profile --config cloud-broker.json --name acl-profile')}

// execute the default acl-profile command with settings defined on the default 
// configuration 'stm-cli-config.json', but with command-line overrides)
${chalk.greenBright('stm manage acl-profile --operation update --client-connect-default-action allow')}

${chalk.yellowBright('NOTE: You can override any of the acl-profile parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a acl-profile purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm manage acl-profile --acl-profile my-acl-profile --semp-url http://localhost:8080 --semp-vpn default --semp-username admin --semp-password admin --client-connect-default-action allow')}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm manage acl-profile --client-connect-default-action allow --name acl-profile --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm manage acl-profile  --name acl-profile --config cloud-broker.json --save-to acl-profile2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm manage acl-profile --client-connect-default-action allow --name acl-profile2 --config cloud-broker.json --save-to acl-profile4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}  
    `)
}

export const displayHelpExamplesForClientProfile = () => {
  console.log(`
Examples:
// execute the default client-profile command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm manage client-profile')}

${chalk.magentaBright(`HINT: You can view the default client-profile command settings 'stm config view --name client-profile'!`)}

${chalk.yellowBright('NOTE: The actual operation is determined by the ')}${chalk.greenBright('operation')} parameter - create, update or delete!

// execute a specific client-profile command from the named configuration 
${chalk.greenBright('stm manage client-profile --config cloud-broker.json --name client-profile')}

// execute the default client-profile command with settings defined on the default 
// configuration 'stm-cli-config.json', with the command-line overrides
${chalk.greenBright('stm manage client-profile --operation update --allow-guaranteed-endpoint-create-durability all')}

${chalk.yellowBright('NOTE: You can override any of the client-profile parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a client-profile purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm manage client-profile --client-profile my-client-profile --semp-url http://localhost:8080 --semp-vpn default --semp-username admin --semp-password admin --allow-guaranteed-endpoint-create-durability all')}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm manage client-profile --allow-guaranteed-endpoint-create-durability all --name client-profile --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm manage client-profile  --name client-profile --config cloud-broker.json --save-to client-profile2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm manage client-profile --allow-guaranteed-endpoint-create-durability all --name client-profile2 --config cloud-broker.json --save-to client-profile4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}  
    `)
}

export const displayHelpExamplesForClientUsername = () => {
  console.log(`
Examples:
// execute the default client-username command with settings defined on the 
// default configuration 'stm-cli-config.json' 
${chalk.greenBright('stm manage client-username')}

${chalk.magentaBright(`HINT: You can view the default client-username command settings 'stm config view --name client-username'!`)}

${chalk.yellowBright('NOTE: The actual operation is determined by the ')}${chalk.greenBright('operation')} parameter - create, update or delete!

// execute a specific client-username command from the named configuration 
${chalk.greenBright('stm manage client-username --config cloud-broker.json --name client-username')}

// execute the default client-username command with settings defined on the default 
// configuration 'stm-cli-config.json', with the command-line overrides
${chalk.greenBright('stm manage client-username --operation update --enabled true')}

${chalk.yellowBright('NOTE: You can override any of the client-username parameters \n' +
'that are applied only for this instance of execution!')}

// If you want to run a client-username purely command based on the command-line parameters
// without any reference to recorded command settings, you can do so by specifying
// requisite parameters in the command-line
${chalk.greenBright('stm manage client-username --client-username my-client-username --semp-url http://localhost:8080 --semp-vpn default --semp-username admin --semp-password admin --enabled true')}

${chalk.yellowBright('NOTE: The following examples demonstrate how to update an existing command settings\n' +
'in a configuration, as well as how to duplicate (copy) a command \n' +
'setting to a new name!')}

// Update the command setting with the specified command-line parameters (if specified)
${chalk.greenBright('stm manage client-username --enabled true --name client-username --config cloud-broker.json --save')}

// Duplicate the command setting
${chalk.greenBright('stm manage client-username  --name client-username --config cloud-broker.json --save-to client-username2')}

// Duplicate the command setting with the specified command-line parameters
${chalk.greenBright('stm manage client-username --enabled true --name client-username2 --config cloud-broker.json --save-to client-username4')}

${chalk.magentaBright(`HINT: You can verify the outcome by executing a config list command 'stm config list --config cloud-broker.json'!`)}  
    `)
}

export const displayHelpExamplesForVpnConnection = () => {
  console.log(`
Examples:
// manage (update) vpn-connection settings on the default configuration 
${chalk.greenBright('stm manage vpn-connection --url ws://localhost:8008 --vpn default')}

// manage (update) vpn-connection settings on the named configuration 
${chalk.greenBright('stm manage vpn-connection --config cloud-broker.json --url ws://localhost:8008 --vpn default --username default --password default ')}


${chalk.magentaBright(`HINT: You can view the default vpn-connection command settings 'stm config view --name connection'!`)}
  `)
}
export const displayHelpExamplesForSempConnection = () => {
  console.log(`
Examples:
// manage (update) semp-connection settings on the default configuration
${chalk.greenBright('stm manage semp-connection --semp-url http://localhost:8080 --semp-vpn default')}

// manage (update) semp-connection settings on the named configuration 
${chalk.greenBright('stm manage semp-connection --config cloud-broker.json --semp-url http://localhost:8080 --semp-vpn default --semp-username admin --semp-password admin ')}

${chalk.magentaBright(`HINT: You can view the default semp-connection command settings 'stm config view --name sempconnection'!`)}
  `)
}

