import post, { AxiosResponse } from 'axios'

interface IJsonRpcRequest {
    method: string,
    params: object,
    id: string,
    jsonrpc: string
}

class ToncenterRPC {
    // for testnet: 'https://testnet.toncenter.com/api/v2/jsonRPC'
    // for mainnet: 'https://toncenter.com/api/v2/jsonRPC'
    private _rpcURL: string

    constructor (rpcURL: string) {
        this._rpcURL = rpcURL
    }

    public get rpcURL (): string { return this._rpcURL }

    private static genRpcBody (method: string, params: object): IJsonRpcRequest {
        return { method, params, id: '', jsonrpc: '2.0' }
    }

    public async request (method: string, params: object): Promise<AxiosResponse<any, any>> {
        return post({
            url: this._rpcURL,
            data: ToncenterRPC.genRpcBody(method, params),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export { ToncenterRPC }
