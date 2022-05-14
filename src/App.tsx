import {
    Icon20DiamondOutline,
    Icon24ReplyOutline,
    Icon24ShareOutline,
    Icon28ArrowDownOutline,
    Icon28ArrowUpOutline,
    Icon28RefreshOutline,
    Icon28SyncOutline,
    Icon28WalletOutline
} from '@vkontakte/icons'
import {
    usePlatform,
    VKCOM,
    AppRoot,
    SplitLayout,
    SplitCol,
    Panel,
    PanelHeader,
    Group,
    Cell,
    Separator,
    Alert,
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    CellButton,
    Epic,
    Tabbar,
    TabbarItem,
    FormItem,
    Input,
    Button,
    Div,
    Checkbox,
    Gradient,
    Avatar,
    Title,
    IconButton,
    CardGrid,
    Card,
    SimpleCell,
    Link,
    PanelHeaderButton
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

// import { Providers } from 'ton3'

import React, { useEffect } from 'react'

import { Address, BOC, Coins } from 'ton3-core'
import { WalletPanel, SwapPanel } from './panels'
import { ToncenterRPC } from './logic/tonapi'
import { TokenWallet } from './logic/contracts'

export const App: React.FC = () => {
    const platform = usePlatform()

    const modals = [ 'modal 1', 'send', 'recive', 'wallet' ]

    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)

    const [ activeStory, setActiveStory ] = React.useState<any>('swap')

    const [ address, setAddress ] = React.useState<string>('')

    const [ balance, setBalance ] = React.useState<any>(null)

    const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0)

    const [ addressJopa, setAddressJopa ] = React.useState<string>('')

    const [ addressSend, setAddressSend ] = React.useState<string>('')
    const [ amountSend, setAmountSend ] = React.useState<string>('')
    const [ forwardSend, setForwardSend ] = React.useState<boolean>(false)

    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)

    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
    }

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    const tonrpc = new ToncenterRPC('https://testnet.toncenter.com/api/v2/jsonRPC')

    const ContrBTNAddress = 'EQBEqIYR5tfLsPax_60jbbIz8PISDaQ-oEj9u5J59sOX6VNY'
    const ContrBTNSwapAddress = 'kQB-a_wvWIhekZCtKnApleKtjt4Rar29Kw6fIzdB5fgESDhW'

    async function login () {
        const windowTon:any = window
        if (windowTon.ton) {
            const balanceTon = await windowTon.ton.send('ton_getBalance')
            console.log(balanceTon)
            setBalance((balanceTon / 10 ** 9).toFixed(9))

            const addressTon = await windowTon.ton.send('ton_requestAccounts')
            setAddress(addressTon[0])
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
            setAddressJopa(jwallAddressBounceable)

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
            // const endpoint = 'https://testnet.toncenter.com/api/v2'
            // const provider = new Providers.ProviderRESTV2(endpoint)

            // const client = await provider.client()

            // console.log(client)
            login()
        }

        load()
    }, [])

    async function sendBocT () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(amountSend),
            destination: new Address(addressSend),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(forwardSend ? 0.05 : 0)
        })

        const boc = BOC.toBase64Standard(msg)
        const windowTon:any = window
        if (windowTon.ton) {
            const singTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 100000000, to: addressJopa, dataType: 'boc', data: boc } ])
            console.log(singTon)
            setAddressSend('')
            setAmountSend('')
        } else {
            console.log('error')
        }
    }

    async function buyBtn () {
        const windowTon:any = window
        const addressTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 10000000000, to: ContrBTNAddress } ])
        console.log(addressTon)
    }

    const ModalRootFix:any = ModalRoot
    const modalRoot = (
        <ModalRootFix activeModal={modal}>
            <ModalPage
                id={modals[0]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Modal 1</ModalPageHeader>}
            >
                <Group>
                    <CellButton onClick={() => setModal(modals[1])}>Modal 2</CellButton>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[1]}
                onClose={() => setModal('wallet')}
                header={<ModalPageHeader>Send Biton</ModalPageHeader>}
            >
                <Group>
                    <FormItem
                        top="Recepient"
                    >
                        <Input value={addressSend} onChange={(e) => { setAddressSend(e.target.value) }} placeholder="Enter wallet address" />
                    </FormItem>

                    <FormItem
                        top="Amount"
                    >
                        <Input value={amountSend} onChange={(e) => { setAmountSend(e.target.value) }} placeholder="0.0" type="number" />
                    </FormItem>
                    <Checkbox onClick={() => {
                        setForwardSend(!forwardSend)
                    }}>
                    forwardTonAmount 0.05 TON
                    </Checkbox>
                    <FormItem>
                        <Button size="l" stretched onClick={sendBocT} disabled={amountSend === '' || addressSend === ''}>
                  Send
                        </Button>
                    </FormItem>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[2]}
                onClose={() => setModal('wallet')}
                header={<ModalPageHeader>Recive</ModalPageHeader>}
            >
                <Group>
                    <FormItem
                        top="Share this address to receive."
                    >
                        <Input value={address} onChange={() => {}}/>
                    </FormItem>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[3]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader left={
                    <PanelHeaderButton onClick={() => {
                        login()
                    }}><Icon28RefreshOutline /></PanelHeaderButton>
                }>
                    Wallet
                </ModalPageHeader>}

            >
                <Group>
                    <Gradient
                        style={{
                            margin: '-7px -7px 0 -7px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: 32
                        }}
                    >
                        {/* <Avatar size={96} /> */}
                        <small>List of tokens</small>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                            <Button size="l" mode="secondary" style={{ marginRight: '12px' }} before={<Icon28ArrowDownOutline />} onClick={() => {
                                setModal('recive')
                            }}>
                            Recive
                            </Button>
                            <Button size="l" mode="secondary" before={<Icon28ArrowUpOutline/>} onClick={() => {
                                setModal('send')
                            }}>
                            Send
                            </Button>

                        </div>
                    </Gradient>

                    { loadWallet === 1
                        ? <Div>

                            <CardGrid size="l">
                                <Card>
                                    <Div>
                                        <SimpleCell
                                            before={<Avatar size={48} src={'https://ton.org/_next/static/media/apple-touch-icon.d723311b.png'} />}
                                            badge={<Icon20DiamondOutline />}
                                            after={
                                                <b>{balance} TON</b>
                                            }
                                            disabled
                                        >
                                            TON
                                        </SimpleCell>

                                        <SimpleCell
                                            before={<Avatar size={48} src={'https://biton.pw/static/biton/img/logo.png?1'} />}
                                            disabled
                                            after={
                                                <b>{balanceBTN} BTN</b>
                                            }
                                        >
                                            BITON
                                        </SimpleCell>
                                    </Div>
                                </Card>
                            </CardGrid>
                            <br />

                            <div>
                                <Button size='l' stretched onClick={buyBtn}>Buy BTN</Button>
                            </div>
                        </Div>
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

                </Group>
            </ModalPage>
        </ModalRootFix>
    )

    return (

        <AppRoot>
            <SplitLayout
                style={{ justifyContent: 'center' }}
                header={hasHeader && <PanelHeader separator={false} />}
                popout={popout}
                modal={modalRoot}
            >
                {isDesktop && (
                    <SplitCol fixed width={280} maxWidth={280}>
                        <Panel>
                            {hasHeader && <PanelHeader />}
                            <Group>
                                {/* <Cell
                                    onClick={onStoryChange}
                                    data-story="wallet"
                                    before={<Icon28WalletOutline/>}
                                    style={
                                        activeStory === 'wallet'
                                            ? {
                                                backgroundColor: 'var(--button_secondary_background)',
                                                borderRadius: 8
                                            }
                                            : {}
                                    }
                                >Wallet</Cell> */}
                                <Cell
                                    onClick={onStoryChange}
                                    data-story="swap"
                                    before={<Icon28SyncOutline/>}
                                    style={
                                        activeStory === 'swap'
                                            ? {
                                                backgroundColor: 'var(--button_secondary_background)',
                                                borderRadius: 8
                                            }
                                            : {}
                                    }
                                >Swap</Cell>
                                <Separator />
                                <Div>
                                    <small style={{ opacity: 0.6 }}>Biton 2022</small>
                                </Div>

                            </Group>
                        </Panel>
                    </SplitCol>
                )}

                <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '560px' : '100%'}
                    maxWidth={isDesktop ? '560px' : '100%'}
                >
                    <Epic
                        activeStory={activeStory}
                        tabbar={
                            !isDesktop && (
                                <Tabbar>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === 'wallet'}
                                        data-story="wallet"
                                        text="Wallet"
                                    >
                                        <Icon28WalletOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === 'swap'}
                                        data-story="swap"
                                        text="Swap"
                                    >
                                        <Icon28SyncOutline />
                                    </TabbarItem>
                                </Tabbar>
                            )
                        }
                    >
                        <WalletPanel
                            id={'wallet'}
                            tonrpc={tonrpc}
                            setAddress={setAddress}
                            setModal={setModal}
                            setAddressJopa={setAddressJopa}
                            ContrBTNAddress={ContrBTNAddress}
                        />
                        <SwapPanel
                            id={'swap'}
                            tonrpc={tonrpc}
                            setAddress={setAddress}
                            setModal={setModal}
                            setAddressJopa={setAddressJopa}
                            ContrBTNAddress={ContrBTNAddress}
                            ContrBTNSwapAddress={ContrBTNSwapAddress}
                            addressJopa={addressJopa}
                            address={address}
                        />
                    </Epic>
                </SplitCol>
            </SplitLayout>
        </AppRoot>

    )
}
