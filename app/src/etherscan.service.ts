import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';

interface EtherscanTransaction {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
    methodId: string;
    functionName: string;
}

@Injectable()
export class EtherscanService {
    async getTransactions(address: string) {
        const LIMIT = 10000;

        const url = new URL('https://api.etherscan.io/api');

        url.searchParams.append('module', 'account');
        url.searchParams.append('action', 'txlist');
        url.searchParams.append('address', address);

        // url.searchParams.append('startblock', 0);
        // url.searchParams.append('endblock', 99999999);

        url.searchParams.append('page', '1');
        url.searchParams.append('offset', LIMIT.toString());
        url.searchParams.append('sort', 'asc');

        url.searchParams.append('apikey', process.env.ETHERSCAN_API_KEY);

        const transactions = [];

        while (true) {
            const resp = await fetch(url);

            const data = await resp.json();

            if (data.status !== '1') {
                throw new BadRequestException('Can`t get transactions.');
            }

            transactions.push(
                ...data.result.map(
                    (
                        i: EtherscanTransaction,
                    ): Omit<Transaction, 'id' | 'walletId'> => ({
                        from: i.from,
                        to: i.to,
                        value: BigInt(i.value),
                        hash: i.hash,
                        timestamp: new Date(Number(i.timeStamp) * 1000),
                    }),
                ),
            );

            if (data.result.length !== LIMIT) {
                break;
            } else {
                const currentPage = Number(url.searchParams.get('page'));

                url.searchParams.set('page', (currentPage + 1).toString());
            }
        }

        return transactions;
    }
}
