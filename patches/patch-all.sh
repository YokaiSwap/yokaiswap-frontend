#!/bin/bash

patch --forward node_modules/@polyjuice-provider/web3/lib/providers.js patches/@polyjuice-provider/web3/lib/providers.js.patch
rm -f node_modules/@polyjuice-provider/web3/lib/providers.js.rej

patch --forward node_modules/@ckb-lumos/base/lib/utils.js patches/@ckb-lumos/base/lib/utils.js.patch
rm -f node_modules/@ckb-lumos/base/lib/utils.js.rej
