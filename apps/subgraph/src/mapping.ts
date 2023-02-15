import { ByteArray, log } from "@graphprotocol/graph-ts"
// @ts-ignore
import { NewGreeting, NewUser } from "../generated/Greeter/Greeter"
// @ts-ignore
import { Greeting, User } from "../generated/schema"
import { concat, hash } from "./utils"

/**
 * Creates a new user.
 * @param event Ethereum event emitted when a user is created.
 */
export function createUser(event: NewUser): void {
    log.debug(`NewUser event block: {}`, [event.block.number.toString()])

    const userId = hash(concat(ByteArray.fromBigInt(event.logIndex), event.transaction.hash))
    const user = new User(userId)

    log.info("Creating user '{}'", [user.id])

    user.identityCommitment = event.params.identityCommitment
    user.username = event.params.username.toString()

    user.save()

    log.info("User '{}' has been created", [user.id])
}

/**
 * Creates a new anonymous greet.
 * @param event Ethereum event emitted when a user sends a greet anonymously.
 */
export function createGreeting(event: NewGreeting): void {
    log.debug(`NewGreetings event block: {}`, [event.block.number.toString()])

    const greetId = hash(concat(ByteArray.fromBigInt(event.logIndex), event.transaction.hash))
    const greeting = new Greeting(greetId)

    log.info("Creating greeting '{}'", [greeting.id])

    greeting.greeting = event.params.greeting.toString()

    greeting.save()

    log.info("Greeting '{}' has been created", [greeting.id])
}
