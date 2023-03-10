import { task, types } from "hardhat/config"

task("deploy", "Deploy a Greeter contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group id", "42", types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = semaphore.address
        }

        if (!groupId) {
            groupId = process.env.GROUP_ID
        }

        const GreeterFactory = await ethers.getContractFactory("Greeter")

        const greeterContract = await GreeterFactory.deploy(semaphoreAddress, groupId)

        await greeterContract.deployed()

        if (logs) {
            console.info(`Greeter contract has been deployed to: ${greeterContract.address}`)
        }

        return greeterContract
    })
