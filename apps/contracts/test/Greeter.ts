import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { ethers, run } from "hardhat"
// @ts-ignore: typechain-types folder will be generated after contracts compilation
import { Greeter } from "../typechain-types"
import { config } from "../package.json"

describe("Greeter", () => {
    const snarkArtifactsPath = config.paths.build["snark-artifacts"]

    let greeter: Greeter

    const users: any[] = []
    const groupId = "42"
    const group = new Group(groupId)

    before(async () => {
        greeter = await run("deploy", { logs: false, group: groupId })

        users.push({
            identity: new Identity(),
            username: ethers.utils.formatBytes32String("anon1")
        })

        users.push({
            identity: new Identity(),
            username: ethers.utils.formatBytes32String("anon2")
        })

        group.addMember(users[0].identity.commitment)
        group.addMember(users[1].identity.commitment)
    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            for (let i = 0; i < group.members.length; i += 1) {
                const transaction = greeter.joinGroup(group.members[i], users[i].username)

                await expect(transaction).to.emit(greeter, "NewUser").withArgs(group.members[i], users[i].username)
            }
        })
    })

    describe("# greet", () => {
        it("Should allow users to greet", async () => {
            const greeting = ethers.utils.formatBytes32String("Hello World")

            const fullProof = await generateProof(users[1].identity, group, groupId, greeting, {
                wasmFilePath: `${snarkArtifactsPath}/semaphore.wasm`,
                zkeyFilePath: `${snarkArtifactsPath}/semaphore.zkey`
            })

            const transaction = greeter.greet(
                greeting,
                fullProof.merkleTreeRoot,
                fullProof.nullifierHash,
                fullProof.proof
            )

            await expect(transaction).to.emit(greeter, "NewGreeting").withArgs(greeting)
        })
    })
})
