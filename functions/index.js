const functions = require("firebase-functions");
const {Sotez} = require("sotez");
const {char2Bytes} = require("@taquito/utils");

exports.withdrawFromPool = functions.https.onRequest(async (request, response) => {
    const mainnet = request.query.mainnet;
    const destinationAddress = request.query.address.toString();

    const depositNoteHash = request.query.note.toString();
    const commitment = char2Bytes(depositNoteHash.toString());

    const merkleProof = request.query.proof.toString();
    const poolContract = request.query.contract.toString();
    const poolValue = parseInt(request.query.pool.toString());

    const proofRecord = {
        a: merkleProof,
        b: "test"
    };

    const networkUrl = mainnet === "true" ? functions.config().network.mainnet : functions.config().network.test;
    response.set('Access-Control-Allow-Origin', '*');

    functions.logger.info("New withdrawal request to wallet ", destinationAddress, " via ", networkUrl);
    functions.logger.info("Target contract address: ", poolContract);

    const tezos = new Sotez(networkUrl, {
        defaultFee: 1420,
        useMutez: true,
        useLimitEstimator: true,
        chainId: "main",
        debugMode: false,
        localForge: true,
        validateLocalForge: false,
    });

    const withdraw = async () => {
        await tezos.importKey(
            functions.config().wallet.key,
            functions.config().wallet.passphrase,
        );

        functions.logger.info(`Loading contract...`);
        const contract = await tezos.loadContract(poolContract);
        const {methods} = contract;

        functions.logger.info("Methods: ", methods);
        functions.logger.info(`Contract loaded!`);
        functions.logger.info(`Processing withdrawal...`);

        // const storage = await contract.storage();

        const {hash} = await contract.methods.withdraw({
            nullifier: commitment,
            a: proofRecord.a,
            b: proofRecord.b,
            withdrawal_address: destinationAddress,
        })
            .send(
                {
                    fee: 100000,
                    gasLimit: 800000,
                    storageLimit: 60000,
                }
            );

        functions.logger.info(`Waiting for operation ${hash}`);
        const blockHash = await tezos.awaitOperation(hash);
        functions.logger.info(`Successfully processed withdrawal!`);
        functions.logger.info(`Operation found in block ${blockHash}`);
    }

    const transfer = async () => {
        await tezos.importKey(
            functions.config().wallet.key,
            functions.config().wallet.passphrase,
        );

        const amount = poolValue * 1000000 * 0.9;
        const balance = await tezos.getBalance(functions.config().wallet.address);

        if (balance < amount) response.status(503).send(`Contract balance too low (${balance} < ${amount})!`);

        functions.logger.info(`Sending ${amount} XTZ to ${destinationAddress}...`);

        const {hash} = await tezos.transfer({
            to: destinationAddress,
            amount: amount,
        });

        functions.logger.info(`Waiting for operation ${hash}`);
        const blockHash = await tezos.awaitOperation(hash);
        functions.logger.info(`Operation found in block ${blockHash}`);
    }

    withdraw()
        .then(() => {
            transfer()
                .then(() => {
                    response.status(200).send("Successfully processed the operation!")
                })
                .catch((error) => {
                    functions.logger.error(error);
                    response.status(503).send("Failed to process the transfer :(")
                })
        })
        .catch((error) => {
            functions.logger.error(error);
            response.status(503).send("Failed to process the tokens withdrawal :(")
        })
});
