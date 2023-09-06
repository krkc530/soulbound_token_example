https://ntnprdhmm.com/soulbound-tokens

## Test 
```bash
$ npx hardhat test
```

## Usage
you should run local testnet at first.  
Endpoint URL must be as follows: http://localhost:8545,  
Or change network config in hardhat.config.js.

### Deploy
```bash
$ node scripts/deploy.js
```

### Issue (mint)
Issue tokenId = 1
```bash
$ node scripts/issue.js 1
```

### Transfer
Transfer tokenId = 1, from owner to another.  
But this task must be failed since this is SBT.
```bash
$ node scripts/transfer.js 1
```

### Burn
Burn tokenId = 1, from issuer address. 
```bash
$ node scripts/burn.js 1
```
