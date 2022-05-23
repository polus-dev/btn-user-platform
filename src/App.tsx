import {
    Icon16CancelCircle,
    Icon20DiamondOutline,
    Icon28ArrowDownOutline,
    Icon28ArrowLeftOutline,
    Icon28ArrowUpOutline,
    Icon28DoorArrowRightOutline,
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
    CardGrid,
    Card,
    SimpleCell,
    Link,
    PanelHeaderButton,
    ScreenSpinner,
    Snackbar,
    Title
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

// import { Providers } from 'ton3'

import React, { useEffect } from 'react'

import { TonhubConnector } from 'ton-x-fix'
import { TonhubCreatedSession, TonhubSessionAwaited, TonhubTransactionRequest, TonhubTransactionResponse } from 'ton-x-fix/dist/connector/TonhubConnector'

import { QRCodeSVG } from 'qrcode.react'

import { Address, BOC, Coins } from 'ton3-core'
import { WalletPanel, SwapPanel } from './panels'
import { ToncenterRPC } from './logic/tonapi'
import { TokenWallet } from './logic/contracts'

const connector = new TonhubConnector({ testnet: true })

export const App: React.FC = () => {
    const platform = usePlatform()

    const modals = [ 'confirm', 'send', 'recive', 'wallet', 'login', 'wait' ]

    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)
    const [ snackbar, setSnackbar ] = React.useState<any>(null)

    const [ activeStory, setActiveStory ] = React.useState<any>('swap')

    const [ address, setAddress ] = React.useState<string>('')

    const [ balance, setBalance ] = React.useState<any>(0)

    const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0)

    const [ addressJopa, setAddressJopa ] = React.useState<string>('')

    const [ addressSend, setAddressSend ] = React.useState<string>('')
    const [ amountSend, setAmountSend ] = React.useState<string>('')
    const [ forwardSend, setForwardSend ] = React.useState<boolean>(false)

    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    const [ typeWallet, setTypeWallet ] = React.useState<number>(0)
    const [ WalletHub, setWalletHub ] = React.useState<any>(null)
    const [ sessionHub, setSessionHub ] = React.useState<any>(null)

    const [ connectorHub, setConnectorHub ] = React.useState<any>(null)

    const [ urlAuHub, setUrlAuHub ] = React.useState<any>(null)

    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
    }

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    const tonrpc = new ToncenterRPC('https://sandbox.tonhubapi.com/jsonRPC')

    const ContrBTNAddress = 'kQDokczBRtbRnuWDrHiEalB3Uqnl6sTsuGwx1H3WmJqJgBxb'
    const ContrBTNSwapAddress = 'kQATGGjSxuOfKYs5-QYdWaF6Gh_31XYzDPHKdB0FrjfUFwmP'

    async function unlogin () {
        setBalance(0)
        setBalanceBTN(0)
        setModal(null)
        setLoadWallet(0)
        setTypeWallet(0)
        setUrlAuHub(null)
    }

    async function getBalanceTon (addressW:any = address) {
        const BalanceTon = await tonrpc.request('getAddressBalance', { address: addressW })
        // console.log(BalanceTon.data.result)

        const balTon = (BalanceTon.data.result / 10 ** 9).toFixed(9)
        setBalance(balTon)
    }

    async function getBalanceBiton (addressW:any = address) {
        const addressHexNoWC = new Address(addressW).toString('raw').split(':')[1]

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
    }

    async function login () {
        setPopout(<ScreenSpinner />)
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
            setPopout(null)
            console.log('error')
            setLoadWallet(2)
        }
        setPopout(null)
    }

    async function loginHub () {
        setPopout(<ScreenSpinner />)
        const session1: TonhubCreatedSession = await connector.createNewSession({
            name: 'Biton',
            url: window.location.href
        })

        // Session ID, Seed and Auth Link
        const sessionId = session1.id
        const sessionSeed = session1.seed
        const sessionLink = session1.link
        setUrlAuHub(sessionLink)
        setPopout(null)
        setSessionHub(session1)

        const session: TonhubSessionAwaited = await connector.awaitSessionReady(sessionId, 5 * 60 * 1000) // 5 min timeout

        if (session.state === 'revoked' || session.state === 'expired') {
            // Handle revoked or expired session
            setUrlAuHub(null)
            setPopout(null)
        } else if (session.state === 'ready') {
            const correctConfig: boolean = TonhubConnector.verifyWalletConfig(sessionId, session.wallet)

            if (correctConfig) {
                setTypeWallet(1)
                setPopout(<ScreenSpinner />)
                console.log(session)
                setWalletHub(session)

                setAddress(session.wallet.address)

                setModal(null)

                getBalanceTon(session.wallet.address)
                getBalanceBiton(session.wallet.address)

                setLoadWallet(1)
                setPopout(null)
            } else {
                setUrlAuHub(null)
                setPopout(null)
                console.log('error')
            }
        } else {
            setUrlAuHub(null)
            setPopout(null)
            throw new Error('Impossible')
        }
        setPopout(null)
    }

    useEffect(() => {
        const load = async () => {
            // const endpoint = 'https://testnet.toncenter.com/api/v2'
            // const provider = new Providers.ProviderRESTV2(endpoint)

            // const client = await provider.client()

            // console.log(client)
            // login()
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

    async function sendBocTHub (addressJopa1:any = addressJopa, valueTon:any = '100000000', boc1:any = null) {
        if (WalletHub !== null) {
            // setPopout(<ScreenSpinner />)
            setModal('confirm')
            // const windowTon:any = window
            console.log(boc1)

            console.log(WalletHub)
            // Request body
            const request: TonhubTransactionRequest = {
                seed: sessionHub.seed, // Session Seed
                appPublicKey: WalletHub.wallet.appPublicKey, // Wallet's app public key
                to: addressJopa1, // Destination
                value: valueTon, // Amount in nano-tons
                timeout: 5 * 60 * 1000, // 5 minut timeout
                text: '' // Optional comment. If no payload specified - sends actual content, if payload is provided this text is used as UI-only hint
                // payload: boc1 // Optional serialized to base64 string payload cell
            }
            if (boc1 !== null) {
                request.payload = boc1
            }
            const response: TonhubTransactionResponse = await connector.requestTransaction(request)
            if (response.type === 'rejected') {
            // Handle rejection
                console.log(response)
                setPopout(null)
                return { type: 'error', data: response }
            } if (response.type === 'expired') {
            // Handle expiration
                console.log(response)
                setPopout(null)
                return { type: 'error', data: response }
            } if (response.type === 'invalid_session') {
            // Handle expired or invalid session
                console.log(response)
                setPopout(null)
                return { type: 'error', data: response }
            } if (response.type === 'success') {
            // Handle successful transaction
                console.log(response.response)
                const externalMessage = response.response // Signed external message that was sent to the network
                setPopout(null)
                setModal('wait')
                return { type: 'ok', data: response }
            }
            setPopout(null)
            throw new Error('Impossible')
        } else {
            console.log('error')
        }
    }

    async function sendBtionHub () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(amountSend),
            destination: new Address(addressSend),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(forwardSend ? 0.05 : 0)
        })
        const boc = BOC.toBase64Standard(msg)
        const result:any = await sendBocTHub(addressJopa, '100000000', boc)

        if (result.type === 'error') {
            console.error(result)
            setSnackbar(<Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{ background: 'var(--danger)' }}>
                        <Icon16CancelCircle fill="#fff" width={14} height={14} />
                    </Avatar>
                }
            >
                Error - {result.data.type}
            </Snackbar>)
        } else {
            // setModal('confirm')
            console.log(result)
        }
    }

    async function buyBtn () {
        // const windowTon:any = window
        // const addressTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 10000000000, to: ContrBTNAddress } ])
        // console.log(addressTon)

        const result:any = await sendBocTHub(ContrBTNAddress, '10000000000', null)

        if (result.type === 'error') {
            console.error(result)
            setSnackbar(<Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{ background: 'var(--danger)' }}>
                        <Icon16CancelCircle fill="#fff" width={14} height={14} />
                    </Avatar>
                }
            >
                Error - {result.data.type}
            </Snackbar>)
        } else {
            setModal('confirm')
            console.log(result)
        }
    }

    const ModalRootFix:any = ModalRoot
    const modalRoot = (
        <ModalRootFix activeModal={modal}>
            <ModalPage
                id={modals[0]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Сonfirm</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="heavy" level="2">Confirm the operation in TonHub</Title>
                        <br />
                        <Button size='l' stretched href={'ton-test://connect'}>Confirm in TonHub</Button>
                    </Div>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[5]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Wait</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="heavy" level="2">The transaction is being processed, wait</Title>
                        <br />
                        <Button size='l' stretched href={'ton-test://connect'}>View in TonHub</Button>
                    </Div>
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
                        <Button size="l" stretched onClick={() => {
                            if (typeWallet === 0) {
                                sendBocT()
                            } else {
                                sendBtionHub()
                            }
                        }} disabled={amountSend === '' || addressSend === ''}>
                  Send
                        </Button>
                    </FormItem>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[2]}
                onClose={() => setModal('wallet')}
                dynamicContentHeight
                settlingHeight={100}
                header={<ModalPageHeader>Recive</ModalPageHeader>}
            >
                <Group>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px', marginBottom: '12px' }}>
                        <QRCodeSVG value={`ton://transfer/${address}`} size={260} />
                    </div>
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
                        if (typeWallet === 0) {
                            login()
                        } else {
                            getBalanceTon()
                            getBalanceBiton()
                        }
                    }}><Icon28RefreshOutline /></PanelHeaderButton>
                }
                right={
                    <PanelHeaderButton onClick={() => {
                        unlogin()
                    }}><Icon28DoorArrowRightOutline /></PanelHeaderButton>
                }
                >
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
                            Receive
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

            <ModalPage
                id={modals[4]}
                onClose={() => setModal(null)}
                dynamicContentHeight
                settlingHeight={100}
                header={<ModalPageHeader left={
                    urlAuHub === null ? null
                        : <PanelHeaderButton onClick={() => {
                            setUrlAuHub(null)
                        }}><Icon28ArrowLeftOutline /></PanelHeaderButton>
                }>Login</ModalPageHeader>}
            >
                <Group>
                    {urlAuHub === null
                        ? <CardGrid size="l">
                            <Card>
                                <CellButton onClick={login} disabled centered before={<Avatar src='https://ton.org/download/ton_symbol.svg' size={24} />}>
                                TON Wallet
                                </CellButton>
                            </Card>

                            <Card>
                                <CellButton onClick={loginHub} centered before={<Avatar src='https://tonhub.com/logo_round_desktop.svg' size={24} />}>
                                TonHub
                                </CellButton>
                            </Card>
                        </CardGrid>
                        : <div >
                            <CardGrid size="l">
                                <Card>
                                    <CellButton disabled centered before={<Avatar src='https://tonhub.com/logo_round_desktop.svg' size={24} />}>
                                    TonHub
                                    </CellButton>
                                </Card>
                            </CardGrid>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px', marginBottom: '12px' }}>
                                <QRCodeSVG value={urlAuHub} size={260} />
                            </div>
                            <div>
                                <Button size='l' stretched href={urlAuHub}>Login with TonHub</Button>
                            </div>
                        </div>
                    }
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
                            !isDesktop && false && (
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
                            login={login}
                            loadWallet={loadWallet}
                            balance={balance}
                            balanceBTN={balanceBTN}
                            sendBocTHub={sendBocTHub}
                            setSnackbar={setSnackbar}
                        />
                    </Epic>
                </SplitCol>
                {snackbar}
            </SplitLayout>
        </AppRoot>

    )
}
