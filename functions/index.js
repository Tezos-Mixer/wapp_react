const functions = require("firebase-functions");
const {char2Bytes} = require("@taquito/utils");
const {TezosToolkit} = require('@taquito/taquito');
const {InMemorySigner} = require('@taquito/signer');


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

    const Tezos = new TezosToolkit(networkUrl);

    Tezos.setProvider({
        signer: new InMemorySigner(functions.config().wallet.key),
    });

    const withdraw = async () => {
        functions.logger.info(`Processing withdrawal...`);

        Tezos.contract
            .at(poolContract)
            .then((c) => {
                return c.methodsObject.withdraw({
                    nullifier: commitment,
                    proof: proofRecord,
                    withdrawal_address: destinationAddress,
                })
                    .send();
            })
            .then((op) => {
                functions.logger.info("Successfully processed withdrawal!");
                console.log(`Waiting for ${op.hash} to be confirmed...`);
                op.confirmation()
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const transfer = async () => {
        const amount = poolValue * 0.9;
        const balance = await Tezos.tz.getBalance(functions.config().wallet.address);

        if (balance < amount) {
            response.status(503).send(`Contract balance too low (${balance} < ${amount})!`);
            return;
        }

        functions.logger.info(`Sending ${amount} XTZ to ${destinationAddress}...`);

        Tezos.contract
            .transfer({to: destinationAddress, amount: amount})
            .then((op) => {
                console.log(`Waiting for ${op.hash} to be confirmed...`);
                return op.confirmation(1).then(() => op.hash);
            })
            .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
    }

    withdraw()
        .then(() => {
            transfer()
                .then(() => {
                    response.status(200).send({res: "Successfully processed the operation!"});
                })
                .catch((error) => {
                    functions.logger.error(error);
                    response.status(503).send({res: "Failed to process the transfer :("})
                })
        })
        .catch((error) => {
            functions.logger.error(error);
            response.status(503).send({res: "Failed to process the tokens withdrawal :("})
        })
});
