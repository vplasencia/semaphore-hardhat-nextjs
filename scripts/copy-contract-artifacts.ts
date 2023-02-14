import * as fs from "fs"

async function main() {
    const contractArtifactsPath = "apps/contracts/build/contracts/contracts/Greeter.sol"
    const subgraphArtifactsPath = "apps/subgraph/contract-artifacts"
    const webAppArtifactsPath = "apps/web-app/contract-artifacts"

    await fs.promises.copyFile(`${contractArtifactsPath}/Greeter.json`, `${subgraphArtifactsPath}/Greeter.json`)
    await fs.promises.copyFile(`${contractArtifactsPath}/Greeter.json`, `${webAppArtifactsPath}/Greeter.json`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
