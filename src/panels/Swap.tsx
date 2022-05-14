import { Icon24RefreshOutline, Icon28SortOutline, Icon28SyncOutline, Icon28WalletOutline } from '@vkontakte/icons'
import {
    Panel,
    PanelHeader,
    Group,
    Avatar,
    View,
    Div,
    Title,
    CardGrid,
    Card,
    FormItem,
    Input,
    Button,
    Cell,
    Link,
    IconButton
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'

import { Address, BOC, Coins } from 'ton3-core'
import { ToncenterRPC } from '../logic/tonapi'
import { TokenWallet } from '../logic/contracts'

interface IMyProps {
    id: string,
    tonrpc: ToncenterRPC,
    setAddress: Function,
    setModal: Function,
    setAddressJopa: Function,
    ContrBTNAddress: string,
    ContrBTNSwapAddress: string,
    addressJopa: string,
    address: string
}

const Swap: React.FC<IMyProps> = (props: IMyProps) => {
    const { tonrpc } = props
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    const [ balance, setBalance ] = React.useState<any>(null)

    const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0)

    const [ priceSwap, setPriceSwap ] = React.useState<string>('0')
    const [ priceSwapTon, setPriceSwapTon ] = React.useState<string>('0')

    const [ tonSwap, setTonSwap ] = React.useState<string>('')
    const [ btnSwap, setBtnSwap ] = React.useState<string>('')

    const [ typeSwap, setTypeSwap ] = React.useState<boolean>(false)

    async function getPriceSwap () {
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: props.ContrBTNSwapAddress,
            method: 'get_price',
            stack: [ ]
        })
        if (jwallPriceResp.data.ok === true) {
            setPriceSwap((Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9).toFixed(9))
            setPriceSwapTon(
                (1 / (Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9)).toFixed(9)
            )
        }
        console.log(jwallPriceResp)
    }

    async function sendTon () {
        const windowTon:any = window
        const addressTon = await windowTon.ton.send('ton_sendTransaction', [ { value: (Number(btnSwap) * (10 ** 9)), to: props.ContrBTNSwapAddress } ])
        // btnSwap - временно
        console.log(addressTon)
    }

    async function sendBiton () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(btnSwap),
            destination: new Address(props.ContrBTNSwapAddress),
            responseDestination: new Address(props.address),
            forwardTonAmount: new Coins(0.05)
        })

        const boc = BOC.toBase64Standard(msg)
        const windowTon:any = window
        if (windowTon.ton) {
            const singTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 100000000, to: props.addressJopa, dataType: 'boc', data: boc } ])
            console.log(singTon)
            setTonSwap('')
            setBtnSwap('')
        } else {
            console.log('error')
        }
    }

    async function login () {
        const windowTon:any = window
        if (windowTon.ton) {
            const balanceTon = await windowTon.ton.send('ton_getBalance')
            console.log(balanceTon)
            setBalance((balanceTon / 10 ** 9).toFixed(9))

            const addressTon = await windowTon.ton.send('ton_requestAccounts')
            props.setAddress(addressTon[0])
            setLoadWallet(1)

            const addressHexNoWC = new Address(addressTon[0]).toString('raw').split(':')[1]

            const jwallAddressResp = await tonrpc.request('runGetMethod', {
                address: props.ContrBTNAddress,
                method: 'get_wallet_address_int',
                stack: [ [ 'num', `0x${addressHexNoWC}` ] ]
            })

            let jwallAddress: Address
            if (jwallAddressResp.data.ok === true) {
                jwallAddress = new Address(`0:${jwallAddressResp.data.result.stack[0][1].substring(2)}`)
            } else {
                console.error(jwallAddressResp)
                return
            }

            const jwallAddressBounceable = jwallAddress.toString('base64', { bounceable: true })
            props.setAddressJopa(jwallAddressBounceable)

            // const singTon = await windowTon.ton.send('ton_rawSign', [ { data: 'boc' } ])
            console.log(
                'user jetton wallet address:\n'
                + `${jwallAddressBounceable}`
            )

            const jwallCheckAddressResp = await tonrpc.request('getAddressInformation', { address: jwallAddressBounceable })

            if (jwallCheckAddressResp.data.result.state !== 'uninitialized') {
                const jwallBalanceResp = await tonrpc.request('runGetMethod', {
                    address: jwallAddressBounceable,
                    method: 'get_wallet_data',
                    stack: [ ]
                })
                if (jwallBalanceResp.data.ok === true) {
                    const balanceBtnRespInt = (
                        Number(jwallBalanceResp.data.result.stack[0][1]) / 10 ** 9
                    ).toFixed(9)
                    console.log(balanceBtnRespInt)
                    setBalanceBTN(parseFloat(balanceBtnRespInt))
                }

                console.log(jwallBalanceResp)
            } else {
                console.error('address uninitialized')
                setBalanceBTN(0)
            }
            getPriceSwap()
        } else {
            console.log('error')
            setLoadWallet(2)
        }
    }

    async function swapGo () {
        if (typeSwap) {
            // ton to btn
            sendTon()
        } else {
            // btn to ton
            sendBiton()
        }
    }

    async function calculatePriceInput (price:string, type:boolean) {
        const prN = parseFloat(price)

        if (price === '') {
            setBtnSwap('')
            setTonSwap('')
        } else if (type) {
            // ton to btn
            const btnN = typeSwap ? parseFloat(priceSwapTon) * prN : parseFloat(priceSwap) * prN
            setTonSwap(parseFloat(btnN.toFixed(10)).toFixed(9))
            setBtnSwap(price)
        } else {
            // btn to ton
            const btnN = typeSwap ? parseFloat(priceSwap) * prN : parseFloat(priceSwapTon) * prN
            setBtnSwap(parseFloat(btnN.toFixed(10)).toFixed(9))
            setTonSwap(price)
        }
    }
    async function changeTypeSwap () {
        if (typeSwap) {
            // ton to btn

        } else {
            // btn to ton
        }
        const btnSw = btnSwap
        setBtnSwap(tonSwap)
        setTonSwap(btnSw)
        setTypeSwap(!typeSwap)
    }

    useEffect(() => {
        const load = async () => {
            // setAddress('1')
            login()
        }
        load()
    }, [])

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                <PanelHeader right={<IconButton onClick={() => props.setModal('wallet')}>
                    <Icon28WalletOutline/>
                </IconButton>}>Swap</PanelHeader>
                <Group>
                    {loadWallet === 1
                        ? <Div>

                            <Div style={{ paddingBottom: 32 }}>
                                <Title weight="heavy" level="1">Exchange</Title>
                                <small>Trade tokens in an instant</small>
                            </Div>

                            <CardGrid size="l">
                                {typeSwap
                                    ? <Card>

                                        <div style={{ display: 'flex' }}>
                                            <FormItem top="From" style={{ width: '65%' }}>
                                                <Input placeholder="0.0" value={btnSwap} onChange={(e) => { calculatePriceInput(e.target.value, true) }} type={'number'} max={balance} />
                                            </FormItem>

                                            <FormItem top={`Balance: ${balance}`} style={{ width: '20%' }}>
                                                <Cell
                                                    disabled
                                                    after={<Avatar src="https://ton.org/_next/static/media/apple-touch-icon.d723311b.png" size={24} />}
                                                >TON</Cell>
                                            </FormItem>

                                        </div>

                                    </Card>
                                    : <Card>
                                        <div style={{ display: 'flex' }}>
                                            <FormItem top="From" style={{ width: '65%' }}>
                                                <Input placeholder="0.0" value={btnSwap} onChange={(e) => { calculatePriceInput(e.target.value, true) }} type={'number'} max={balanceBTN} />
                                            </FormItem>

                                            <FormItem top={`Balance: ${balanceBTN}`} style={{ width: '20%' }}>
                                                <Cell
                                                    disabled
                                                    after={<Avatar src="https://biton.pw/static/biton/img/logo.png?1" size={24} />}
                                                >BTN</Cell>
                                            </FormItem>

                                        </div>
                                    </Card>
                                }
                                <Div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '-8px',
                                    color: 'var(--accent)',
                                    width: '100%'
                                }}>
                                    <IconButton onClick={changeTypeSwap}>
                                        <Icon28SortOutline/>
                                    </IconButton>
                                </Div>
                                {typeSwap
                                    ? <Card>
                                        <div style={{ display: 'flex' }}>
                                            <FormItem top="To" style={{ width: '65%' }}>
                                                <Input placeholder="0.0" value={tonSwap} onChange={(e) => { calculatePriceInput(e.target.value, false) }} type={'number'} max={balanceBTN} />
                                            </FormItem>

                                            <FormItem top={`Balance: ${balanceBTN}`} style={{ width: '20%' }}>
                                                <Cell
                                                    disabled
                                                    after={<Avatar src="https://biton.pw/static/biton/img/logo.png?1" size={24} />}
                                                >BTN</Cell>
                                            </FormItem>

                                        </div>
                                    </Card>
                                    : <Card>

                                        <div style={{ display: 'flex' }}>
                                            <FormItem top="To" style={{ width: '65%' }}>
                                                <Input placeholder="0.0" value={tonSwap} onChange={(e) => { calculatePriceInput(e.target.value, false) }} type={'number'} max={balance} />
                                            </FormItem>

                                            <FormItem top={`Balance: ${balance}`} style={{ width: '20%' }}>
                                                <Cell
                                                    disabled
                                                    after={<Avatar src="https://ton.org/_next/static/media/apple-touch-icon.d723311b.png" size={24} />}
                                                >TON</Cell>
                                            </FormItem>

                                        </div>

                                    </Card>
                                }
                            </CardGrid>
                            <Div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                                <small>Price</small>
                                {typeSwap
                                    ? <small> {priceSwap} TON per 1 BTN</small>
                                    : <small> {priceSwapTon} BTN per 1 TON</small>
                                }
                                <Icon24RefreshOutline width={16} height={16} onClick={() => {
                                    login()
                                    getPriceSwap()
                                }} style={{ cursor: 'pointer' }} />

                            </Div>
                            <Div>
                                <Button size={'l'} stretched before={<Icon28SyncOutline/>} onClick={swapGo} disabled={priceSwap === '0'}>Exchange</Button>
                            </Div>

                        </Div>
                        : null }

                    { loadWallet === 2
                        ? <Div><p>Wallet is not installed. Install the wallet TON at the link <Link target="_blank" href="https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd">Install</Link>
                        </p></Div> : null
                    }

                    { loadWallet === 0
                        ? <p>Load</p> : null
                    }
                </Group>
            </Panel>
        </View>

    )
}

export { Swap }
