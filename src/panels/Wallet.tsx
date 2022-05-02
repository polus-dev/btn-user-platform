import { Icon20DiamondOutline, Icon24ReplyOutline, Icon24ShareOutline, Icon28RefreshOutline } from '@vkontakte/icons'
import {
    Panel,
    PanelHeader,
    Group,
    Avatar,
    SimpleCell,
    View,
    Separator,
    Button,
    Title,
    Headline,
    Link,
    Div,
    CardGrid,
    Card,
    IconButton
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import { Address } from 'ton3-core'

import React, { useEffect } from 'react'
import { FrontAddr } from '../types'
import { ToncenterRPC } from '../logic/tonapi'

interface IMyProps {
    id: string,
    tonrpc: ToncenterRPC,
    setAddress: Function,
    setModal: Function,
    setAddressJopa: Function
}

const ContrBTNAddress = 'EQBEqIYR5tfLsPax_60jbbIz8PISDaQ-oEj9u5J59sOX6VNY'

const Wallet: React.FC<IMyProps> = (props: IMyProps) => {
    const { tonrpc } = props
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    // const [ address, setAddress ] = React.useState<FrontAddr>(null)
    const [ balance, setBalance ] = React.useState<any>(null)

    const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0)

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
                address: ContrBTNAddress,
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
        } else {
            console.log('error')
            setLoadWallet(2)
        }
    }

    useEffect(() => {
        const load = async () => {
            // setAddress('1')
            login()
        }
        load()
    }, [])

    async function buyBtn () {
        const windowTon:any = window
        const addressTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 10000000000, to: ContrBTNAddress } ])
        console.log(addressTon)
    }

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                <PanelHeader right={<Avatar size={36} />}>Wallet</PanelHeader>
                <Group>
                    <Div>

                        { loadWallet === 1
                            ? <div>

                                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Div style={{ paddingBottom: 32 }}>
                                        <Title weight="heavy" level="1">Wallet</Title>
                                        <small>List of tokens</small>
                                    </Div>

                                    <IconButton onClick={() => {
                                        login()
                                    }}>
                                        <Icon28RefreshOutline />
                                    </IconButton>
                                </div>

                                {/* <Headline weight="regular" style={{ marginBottom: 16, marginTop: 0, textAlign: 'center', opacity: '.6' }}>{address}</Headline>

                                <Separator/>
                                <br/>

                                <Title level='1' style={{ textAlign: 'center' }}>{balance} TON</Title>
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', marginTop: '12px' }}>
                                    <Button size='l' style={{ marginRight: '12px' }}>
                                Receive
                                    </Button>
                                    <Button size='l' >
                                Send
                                    </Button>
                                </div> */}

                                <CardGrid size="l">
                                    <Card>
                                        <Div >
                                            <SimpleCell
                                                before={<Avatar size={48} src={'https://ton.org/_next/static/media/apple-touch-icon.d723311b.png'} />}
                                                badge={<Icon20DiamondOutline />}
                                                // after={
                                                //     <div style={{ display: 'flex', justifyContent: 'space-between', width: '85px' }}>
                                                //         <IconButton onClick={() => {
                                                //             props.setModal('recive')
                                                //         }}>
                                                //             <Icon24ReplyOutline />
                                                //         </IconButton>
                                                //         <IconButton>
                                                //             <Icon24ShareOutline />
                                                //         </IconButton>
                                                //     </div>
                                                // }
                                                disabled
                                            // after={
                                            //     <IconButton>
                                            //         <Icon28MessageOutline />
                                            //     </IconButton>
                                            // }
                                            // description={address}
                                            >
                                                {balance} TON
                                            </SimpleCell>

                                            <SimpleCell
                                                before={<Avatar size={48} src={'https://biton.pw/static/biton/img/logo.png?1'} />}
                                                // badge={<Icon20DiamondOutline />}
                                                // after={
                                                //     <IconButton>
                                                //         <Icon28MessageOutline />
                                                //     </IconButton>
                                                // }
                                                disabled
                                                after={

                                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '85px' }}>
                                                        <IconButton onClick={() => {
                                                            props.setModal('recive')
                                                        }}>
                                                            <Icon24ReplyOutline />
                                                        </IconButton>
                                                        <IconButton onClick={() => {
                                                            props.setModal('send')
                                                        }}>
                                                            <Icon24ShareOutline />
                                                        </IconButton>

                                                    </div>
                                                }
                                            >
                                                {balanceBTN} BTN
                                            </SimpleCell>
                                        </Div>
                                    </Card>
                                </CardGrid>
                                <br />

                                <Div>
                                    <Button size='l' stretched onClick={buyBtn}>Buy BTN</Button>
                                </Div>
                            </div>
                            : null
                        }

                        { loadWallet === 2
                            ? <p>
                                Wallet is not installed. Install the wallet TON at the link
                                <Link
                                    target="_blank"
                                    href="https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd">
                                        Install
                                </Link>
                            </p> : null
                        }

                        { loadWallet === 0 ? <p>Load</p> : null }
                    </Div>
                </Group>
            </Panel>
        </View>

    )
}

export { Wallet }
