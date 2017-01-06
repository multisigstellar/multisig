# multisig 
Multisig coordinator for Stellar Network
This application enables user to easily coordinate when signing transactions that require multiple signatures.

#How it works

- The initiator builds a transaction. A transaction can have multiple operations contained within
- Once all the operations are added to the transaction, the initiator enters the email address and account ID of each signer
- This is saved and a unique url is generated with a transaction tag which can be shared among the signers
- The transaction page shows pending and completed signatures
- Pending signers can visit the site with the generated URL or search the site using the transaction tag as the query to see the transaction page.
- Once all signatures are completed, the transaction can be submited to the network.

#Visit Site
To use the app, please visit the site: [Stellar Multisig Coordinator](https://multisigstellar.github.io/multisig/)

