import { CoinsService } from './coins.service';
import { CoinTransaction } from './entities/coin-transaction.entity';
export declare class CoinsController {
    private readonly coinsService;
    constructor(coinsService: CoinsService);
    private checkSession;
    transfer(senderId: number, receiverId: number, amount: number): Promise<CoinTransaction>;
    getTransactions(userId: string): Promise<CoinTransaction[]>;
    getCoins(session: any): Promise<{
        coins: number;
    }>;
    collectCoins(session: any): Promise<{
        coins: number;
    }>;
    earnCoins(req: any, amount: number, description: string): Promise<CoinTransaction>;
}
