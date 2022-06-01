import {
    Icon16CancelCircle,
    Icon16CheckDoubleOutline,
    Icon20DiamondOutline,
    Icon28ArrowDownOutline,
    Icon28ArrowLeftOutline,
    Icon28ArrowUpOutline,
    Icon28ArticleOutline,
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
    Title,
    InfoRow,
    Spinner
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

// import { Providers } from 'ton3'

import React, { useEffect } from 'react'

import { TonhubConnector } from 'ton-x-fix'
import { TonhubCreatedSession, TonhubSessionAwaited, TonhubTransactionRequest, TonhubTransactionResponse } from 'ton-x-fix/dist/connector/TonhubConnector'

import { QRCodeSVG } from 'qrcode.react'

import { Address, BOC, Builder, Coins, Slice, Contracts } from 'ton3-core'
import { useCookies } from 'react-cookie'
import { WalletPanel, SwapPanel, ExplorerPanel } from './panels'
import { ToncenterRPC } from './logic/tonapi'
import { TokenWallet } from './logic/contracts'
import { Enot } from './enot'

const connector = new TonhubConnector({ testnet: true })

export const App: React.FC = () => {
    const platform = usePlatform()

    const modals = [ 'confirm', 'send', 'recive', 'wallet', 'login', 'wait', 'confirmSwap', 'liquidity' ]

    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)
    const [ snackbar, setSnackbar ] = React.useState<any>(null)

    const [ activeStory, setActiveStory ] = React.useState<any>('swap')

    const [ address, setAddress ] = React.useState<string>('') // адрес кошелька юзера

    const [ balance, setBalance ] = React.useState<any>(0) // баланс тонов юзера

    const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0) // баланс битонов юзера

    const [ addressJopa, setAddressJopa ] = React.useState<string>('')

    const [ addressSend, setAddressSend ] = React.useState<string>('') // адрес на который отправить битоны (инпут)
    const [ amountSend, setAmountSend ] = React.useState<string>('') // сумма отправки битонов (инпут)
    const [ forwardSend, setForwardSend ] = React.useState<boolean>(false) // нужен ли форвард

    const [ loadWallet, setLoadWallet ] = React.useState<number>(0) // загрузка кошелька
    const [ typeWallet, setTypeWallet ] = React.useState<number>(0) // тип кошелька 1 - тонхаб
    const [ WalletHub, setWalletHub ] = React.useState<any>(null) // объект кошелька тонхаб
    const [ sessionHub, setSessionHub ] = React.useState<any>(null) // объект сессии тонхаб

    const [ connectorHub, setConnectorHub ] = React.useState<any>(null)

    const [ urlAuHub, setUrlAuHub ] = React.useState<any>(null) // юрл авторизации для тонхаб

    const [ swapConfirm, setSwapConfirm ] = React.useState<any>(null) // объект подтерждения свопа
    const [ btnSwap, setBtnSwap ] = React.useState<string>('') // сумма монет из 1 поля

    const [ inputLiq1, setInputLiq1 ] = React.useState<string>('') // сумма монет из 1 поля ликвидность
    const [ inputLiq2, setInputLiq2 ] = React.useState<string>('') // сумма монет из 2 поля ликвидность
    const [ liqprop, setLiqprop ] = React.useState<number>(0) // линейный курс для ликвида

    const [ torSwap, setTorSwap ] = React.useState<string>('5') // Slippage Tolerance

    const [ cookies, setCookie, removeCookie ] = useCookies([ 'session', 'session_hub' ]) // куки

    const listJettons:any = {
        ton: {
            name: 'TON',
            symbl: 'TON',
            img: 'https://ton.org/_next/static/media/apple-touch-icon.d723311b.png',
            price: 1,
            min: 0.1,
            max: 1000
        },
        biton: {
            name: 'BTN',
            symbl: 'BITON',
            img: 'https://biton.pw/static/biton/img/logo.png?1',
            price: 0,
            min: 0.1,
            max: 1000
        }
    }
    const [ fromJetton, setFromJetton ] = React.useState<object>(listJettons.ton)
    const [ toJetton, setToJetton ] = React.useState<object>(listJettons.biton)

    const [ adderessMintLp, setAdderessMintLp ] = React.useState<any>('')
    const [ adderessUserLp, setAdderessUserLp ] = React.useState<any>('')

    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
    }

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    const tonrpc = new ToncenterRPC('https://sandbox.tonhubapi.com/jsonRPC')

    const ContrBTNAddress = 'kQDokczBRtbRnuWDrHiEalB3Uqnl6sTsuGwx1H3WmJqJgBxb'
    const ContrBTNSwapAddress = 'kQAXGz4GcdLJYcNaLGJON_qQisWHdKwIHP93eGxfZDaHhAC3'

    async function getBalanceLp (addressUser:string) {
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: addressUser,
            method: 'get_wallet_data',
            stack: [ ]
        })

        const balanceBtnRespInt = (
            Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9
        ).toFixed(9)

        console.log(balanceBtnRespInt)
    }
    // получение данных о кошельке лп токенов юзера
    async function getLpWalletUser (address2:Address, addressUser:string) {
        const addressMinterLp = address2.toString('raw').split(':')[1]
        console.log('addressMinterLP', address2.toString('base64', { bounceable: true }))
        console.log('addressMinterLP', address2.toString('raw').split(':')[1])

        // enotLox(address2.toString('base64', { bounceable: true }), address2)
        console.log('AddressUser', addressUser)

        const addressUserTon = new Address(addressUser).toString('raw').split(':')[1]
        // const addressUserO = new Address(addressUser)
        // const addressCell = new Builder().storeAddress(addressUserO).cell()

        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: addressMinterLp,
            method: 'get_wallet_address_int',
            stack: [ [ 'num', `0x${addressUserTon}` ] ]
        })
        if (jwallPriceResp.data.ok === true) {
            console.log(jwallPriceResp.data.result)
            const walletLp = new Address(`0:${jwallPriceResp.data.result.stack[0][1].slice(2)}`).toString('base64', { bounceable: false })
            setAdderessUserLp(walletLp)
            console.log('getLpWalletUser', walletLp)
            getBalanceLp(walletLp)
        }
    }

    // получение адреса минтера лп
    async function getLpData (addressUser:string) {
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: ContrBTNSwapAddress,
            method: 'get_lp_params',
            stack: [ ]
        })
        console.log('getLpData', jwallPriceResp.data)
        if (jwallPriceResp.data.ok === true) {
            const addressMin = jwallPriceResp.data.result.stack[5][1].bytes
            const addressOver = Slice.parse(BOC.fromStandard(addressMin)).loadAddress()
            console.log(addressOver)
            if (addressOver !== null) {
                setAdderessMintLp(addressOver)

                getLpWalletUser(addressOver, addressUser)
            }
        }
    }

    // выход из кошелька тонхаб
    async function unlogin () {
        setBalance(0)
        setBalanceBTN(0)
        setModal(null)
        setLoadWallet(0)
        setTypeWallet(0)
        setUrlAuHub(null)

        removeCookie('session')

        removeCookie('session_hub')
    }

    async function getBalanceTon (addressW:any = address, type:boolean = true) {
        const BalanceTon = await tonrpc.request('getAddressBalance', { address: addressW })
        // console.log(BalanceTon.data.result)

        const balTon = (BalanceTon.data.result / 10 ** 9).toFixed(9)
        if (type) {
            setBalance(balTon)
        }
        return balTon
    }

    async function getTransAddress (addressW:any = address, type:boolean = true) {
        const Trans = await tonrpc.request('getTransactions', { address: addressW, limit: 50 })
        console.log(Trans.data.result)

        return Trans.data.result
    }

    async function getBalanceBiton (addressW:any = address, type:boolean = true) {
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
        if (type) {
            setAddressJopa(jwallAddressBounceable)
        }

        // const singTon = await windowTon.ton.send('ton_rawSign', [ { data: 'boc' } ])
        console.log(
            'user jetton wallet address:\n'
                + `${jwallAddressBounceable}`
        )

        const jwallCheckAddressResp = await tonrpc.request('getAddressInformation', { address: jwallAddressBounceable })

        const returnBalanceOb:any = {
            address: jwallAddressBounceable,
            balance: 0
        }

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
                if (type) {
                    setBalanceBTN(parseFloat(balanceBtnRespInt))
                }
                returnBalanceOb.balance = balanceBtnRespInt
            } else {
                console.error('data not ok')
                if (type) {
                    setBalanceBTN(0)
                }
            }

            // костыль переделать вызов функции в другом месте

            getLpData(addressW)

            console.log(jwallBalanceResp)
        } else {
            console.error('address uninitialized')
            if (type) {
                setBalanceBTN(0)
            }
        }
        return returnBalanceOb
    }

    // получение линейной цены свопа
    async function getPriceLP () {
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: ContrBTNSwapAddress,
            method: 'get_price',
            stack: [ ]
        })
        if (jwallPriceResp.data.ok === true) {
            setLiqprop(
                parseFloat((Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9).toFixed(9))
            )
        }
        console.log(jwallPriceResp)
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

    // авторизация через куки тонхаб
    async function loginCook () {
        const sess = cookies.session
        const sessNow = cookies.session_hub
        if (sess && sessNow) {
            setTypeWallet(1)
            setWalletHub(sess)

            setSessionHub(sessNow)

            setAddress(sess.wallet.address)

            getBalanceTon(sess.wallet.address)
            getBalanceBiton(sess.wallet.address)

            setLoadWallet(1)
        }
    }

    // авторизация через кошелек тонхаб
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

        setCookie('session_hub', session1)

        const session: TonhubSessionAwaited = await connector
            .awaitSessionReady(sessionId, 5 * 60 * 1000) // 5 min timeout

        if (session.state === 'revoked' || session.state === 'expired') {
            // Handle revoked or expired session
            setUrlAuHub(null)
            setPopout(null)
        } else if (session.state === 'ready') {
            const correctConfig: boolean = TonhubConnector
                .verifyWalletConfig(sessionId, session.wallet)

            if (correctConfig) {
                setTypeWallet(1)
                setPopout(<ScreenSpinner />)
                console.log(session)
                setWalletHub(session)

                setCookie('session', session)

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

    async function enotLox (adress:string, address2:Address) {
        const jwallPriceResp = await tonrpc.request('getAddressInformation', { address: adress })
        console.log('enot ====', jwallPriceResp.data)
        const boc = jwallPriceResp.data.result.data
        const stor = Slice.parse(BOC.fromStandard(boc))

        stor.loadCoins()
        const admAddress = stor.loadAddress()
        stor.loadRef()
        const jettonWalletCode = stor.loadRef()

        const enot = new Enot(
            jettonWalletCode,
            {
                owner: address2,
                master: adderessMintLp,
                jcode: jettonWalletCode
            }
        )
    }

    useEffect(() => {
        const load = async () => {
            // const endpoint = 'https://testnet.toncenter.com/api/v2'
            // const provider = new Providers.ProviderRESTV2(endpoint)

            // const client = await provider.client()

            // console.log(client)
            // login()

            loginCook()
            getPriceLP()
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

    // основная функция отправка транс через тонхаб
    async function sendBocTHub (addressJopa1:any = addressJopa, valueTon:any = '100000000', boc1:any = null) {
        if (WalletHub !== null && sessionHub !== null) {
            // setPopout(<ScreenSpinner />)
            setModal('confirm')
            // const windowTon:any = window
            console.log(boc1)

            console.log('WalletHub', WalletHub)
            console.log('sessionHub', sessionHub)
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
                return { type: 'error', data: response }
            } if (response.type === 'expired') {
            // Handle expiration
                console.log(response)
                return { type: 'error', data: response }
            } if (response.type === 'invalid_session') {
            // Handle expired or invalid session
                console.log(response)
                return { type: 'error', data: response }
            } if (response.type === 'success') {
            // Handle successful transaction
                console.log('response.response', response.response)
                // const externalMessage = response.response // Signed exteto the network
                setModal('wait')

                setTimeout(() => {
                    setModal(null)
                    setSnackbar(<Snackbar
                        onClose={() => setSnackbar(null)}
                        before={
                            <Avatar size={24} style={{ background: 'var(--vkui--color_background_positive)' }}>
                                <Icon16CheckDoubleOutline fill="#fff" width={14} height={14} />
                            </Avatar>
                        }
                    >
                        Success
                    </Snackbar>)
                    getBalanceTon()
                    getBalanceBiton()
                }, 10 * 1000)
                return { type: 'ok', data: response }
            }
            console.log('response else', response)

            // throw new Error('Impossible')
        } else {
            console.log('error')
            return { type: 'error', data: null }
        }
    }

    // отправка битонов через тонхаб
    async function sendBtionHub () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(amountSend),
            destination: new Address(addressSend),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(forwardSend ? 0.1 : 0)
        })
        const boc = BOC.toBase64Standard(msg)
        const result:any = await sendBocTHub(addressJopa, '100000000', boc)

        if (result.type === 'error') {
            console.error(result)
            setSnackbar(<Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{ background: 'var(--destructive)' }}>
                        <Icon16CancelCircle fill="#fff" width={14} height={14} />
                    </Avatar>
                }
            >
                Error - {result.data.type}
            </Snackbar>)
        } else {
            // setModal('confirm')
            setAddressSend('')
            setAmountSend('')
            setForwardSend(false)
            console.log(result)
        }
    }

    // покупка битонов
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
                    <Avatar size={24} style={{ background: 'var(--destructive)' }}>
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

    // отправка тонов на своп для покупки битонов
    async function sendTonSwap () {
        // const windowTon:any = window
        // const addressTon = await windowTon.ton.send('ton_sendTransaction', [ { value: (Number(btnSwap) * (10 ** 9)), to: props.ContrBTNSwapAddress } ])
        // // btnSwap - временно
        // console.log(addressTon)

        const builderF = new Builder()
            .storeUint(1002, 32)
            .storeCoins(new Coins(swapConfirm.price).mul((Number(torSwap) / 100) + 1))
            .cell()
        const boc = BOC.toBase64Standard(builderF)

        const result:any = await sendBocTHub(ContrBTNSwapAddress, `${Number(btnSwap) * (10 ** 9)}`, boc)

        if (result.type === 'error') {
            console.error(result)
            setSnackbar(<Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{ background: 'var(--destructive)' }}>
                        <Icon16CancelCircle fill="#fff" width={14} height={14} />
                    </Avatar>
                }
            >
                Error - {result.data.type}
            </Snackbar>)
        } else {
            // props.setModal('confirm')
            console.log(result)
        }
    }

    // отправка битонов для покупки тонов
    async function sendBitonSwap () {
        if (swapConfirm) {
            const msg = TokenWallet.transferMsg({
                queryId: BigInt(Date.now()),
                amount: new Coins(btnSwap),
                destination: new Address(ContrBTNSwapAddress),
                responseDestination: new Address(address),
                forwardTonAmount: new Coins(0.05),
                forwardPayload: new Builder()
                    .storeUint(1002, 32)
                    .storeCoins(new Coins(swapConfirm.price).mul((Number(torSwap) / 100) + 1))
                    .cell()
            })

            const boc = BOC.toBase64Standard(msg)

            const result:any = await sendBocTHub(addressJopa, '100000000', boc)

            if (result.type === 'error') {
                console.error(result)
                setSnackbar(<Snackbar
                    onClose={() => setSnackbar(null)}
                    before={
                        <Avatar size={24} style={{ background: 'var(--destructive)' }}>
                            <Icon16CancelCircle fill="#fff" width={14} height={14} />
                        </Avatar>
                    }
                >
                    Error - {result.data.type}
                </Snackbar>)
            } else {
                // props.setModal('confirm')
                console.log(result)
            }
        }

        // console.log(boc)
        // const windowTon:any = window
        // if (windowTon.ton) {
        //     // const singTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 100000000, to: props.addressJopa, dataType: 'boc', data: boc } ])
        //     props.sendBocTHub(props.addressJopa, '100000000', boc)

        //     // console.log(singTon)
        //     setTonSwap('')
        //     setBtnSwap('')
        // } else {
        //     console.log('error')
        // }
    }

    async function calculatePriceInput (price:string) {
        const prN = parseFloat(price)

        if (price === '') {
            setInputLiq2('')
            setInputLiq1('')
        } else {
            // ton to btn
            const btnN = liqprop * prN
            setInputLiq2(parseFloat(btnN.toFixed(10)).toFixed(9))
            setInputLiq1(price)
        }
    }

    async function addLiq () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(inputLiq2),
            destination: new Address(addressJopa),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(0),
            forwardPayload: new Builder()
                .storeUint(1002, 32)
                .cell()
        })
        const boc = BOC.toBase64Standard(msg)
        const result:any = await sendBocTHub(ContrBTNSwapAddress, inputLiq1 + 0.5 * 10 ** 9, boc)

        if (result.type === 'error') {
            console.error(result)
            setSnackbar(<Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{ background: 'var(--destructive)' }}>
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
                        <Title weight="3" level="2">Confirm the operation in TonHub</Title>
                        <br />
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Spinner size="large" style={{ margin: '20px 0' }} />
                        </div>
                        <br />
                        {isDesktop ? null
                            : <Button size='l' stretched href={'ton-test://connect'}>Confirm in TonHub</Button>
                        }
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
                        <Title weight="3" level="2">The transaction is being processed, wait...</Title>
                        <br />
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Spinner size="large" style={{ margin: '20px 0' }} />
                        </div>
                        <br />
                        {isDesktop ? null
                            : <Button size='l' stretched href={'ton-test://connect'}>View in TonHub</Button>
                        }
                    </Div>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[6]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Confirm</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2">Info for swap</Title>
                        <br />
                        {swapConfirm !== null
                            ? <div>
                                <SimpleCell multiline>
                                    <InfoRow header={`Give amount ${swapConfirm.type === true ? 'Ton' : 'Biton'}`}>{Number(swapConfirm.amountU).toFixed(2)}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={`Accept amount ${swapConfirm.type === false ? 'Ton' : 'Biton'}`}>{Number(swapConfirm.amount).toFixed(2)}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={'Market price'}>{swapConfirm.price}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={'Fee'}>{Number(swapConfirm.fee).toFixed(2)}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={'Price Impact'} style={swapConfirm.imact > 10 ? { color: 'var(--destructive)' } : {}}>
                                        {Number(swapConfirm.imact).toFixed(2)} %
                                    </InfoRow>
                                </SimpleCell>
                                <br />
                                <Button
                                    size='l'
                                    stretched
                                    onClick={
                                        swapConfirm.type === true ? sendTonSwap : sendBitonSwap
                                    }
                                    disabled={swapConfirm.imact > 10}
                                >
                                    Accept
                                </Button>
                            </div>
                            : null }

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
                    Notify receiver with 0.1 TON
                    </Checkbox>
                    <FormItem>
                        <Button size="l" stretched onClick={() => {
                            if (typeWallet === 0) {
                                sendBocT()
                            } else {
                                sendBtionHub()
                            }
                        }} disabled={amountSend === '' || addressSend === '' || (addressSend.toLowerCase().substring(0, 2) !== 'kq' && addressSend.toLowerCase().substring(0, 2) !== 'eq')}>
                  Send
                        </Button>
                    </FormItem>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[2]}
                onClose={() => setModal('wallet')}
                dynamicContentHeight
                settlingHeight={90}
                header={<ModalPageHeader>Recive</ModalPageHeader>}
            >
                <Group>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '12px', marginBottom: '12px' }}>
                        <Div style={{ background: '#fff', borderRadius: '32px', padding: '32px' }} className="div_qr">
                            <QRCodeSVG value={`ton://transfer/${address}`} size={260} />
                        </Div>
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
                                                <b>{Number(balance).toFixed(2)} TON</b>
                                            }
                                            disabled
                                        >
                                            TON
                                        </SimpleCell>

                                        <SimpleCell
                                            before={<Avatar size={48} src={'https://biton.pw/static/biton/img/logo.png?1'} />}
                                            disabled
                                            after={
                                                <b>{Number(balanceBTN).toFixed(2)} BTN</b>
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
                            <br />

                            <div>
                                <Button size='l' stretched href="https://t.me/sandbox_faucet_bot" target='_blank'>Get TestNet Coins</Button>
                            </div>
                        </Div>
                        : null
                    }

                </Group>
            </ModalPage>

            <ModalPage
                id={modals[4]}
                onClose={() => setModal(null)}
                dynamicContentHeight
                settlingHeight={90}
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
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '16px', marginBottom: '12px' }}>
                                <Div style={{ background: '#fff', borderRadius: '32px', padding: '32px' }}>
                                    <QRCodeSVG value={urlAuHub} size={260} />
                                </Div>
                            </div>
                            <Div>
                                <Button size='l' stretched href={urlAuHub}>Login with TonHub</Button>
                            </Div>
                        </div>
                    }
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[7]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Liquidity</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <div style={{ paddingBottom: 32 }}>
                            <Title weight="3" level="1">Add</Title>
                            <small>some text</small>
                        </div>

                        <CardGrid size="l">
                            <Card>
                                <div style={{ display: 'flex' }}>
                                    <FormItem top="Add Ton" style={{ width: '65%' }}>
                                        <Input placeholder="0.0" value={inputLiq1} onChange={(e) => { calculatePriceInput(e.target.value) }} type={'number'} />
                                    </FormItem>

                                    <FormItem top={`Bl: ${balance}`} style={{ width: '20%' }}>
                                        <Cell
                                            disabled
                                            after={<Avatar src="https://ton.org/_next/static/media/apple-touch-icon.d723311b.png" size={24} />}
                                        >TON</Cell>
                                    </FormItem>

                                </div>
                            </Card>

                            <Card>
                                <div style={{ display: 'flex' }}>
                                    <FormItem top="Add Biton" style={{ width: '65%' }}>
                                        <Input placeholder="0.0" value={inputLiq2} onChange={(e) => { }} type={'number'} />
                                    </FormItem>

                                    <FormItem top={`Bl: ${balanceBTN}`} style={{ width: '20%' }}>
                                        <Cell
                                            disabled
                                            after={<Avatar src="https://biton.pw/static/biton/img/logo.png?1" size={24} />}
                                        >BTN</Cell>
                                    </FormItem>

                                </div>
                            </Card>
                        </CardGrid>
                        <br />

                        <Button size='l' stretched onClick={addLiq}>Add</Button>
                    </Div>
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
                            {hasHeader && <PanelHeader ><div className="logo-block"><img src="https://biton.pw/static/biton/img/logo.png?1" className="logo" />BITON</div></PanelHeader>}
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
                                <Cell
                                    onClick={onStoryChange}
                                    data-story="explorer"
                                    before={<Icon28ArticleOutline/>}
                                    style={
                                        activeStory === 'explorer'
                                            ? {
                                                backgroundColor: 'var(--button_secondary_background)',
                                                borderRadius: 8
                                            }
                                            : {}
                                    }
                                >Explorer</Cell>
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
                                        selected={activeStory === 'swap'}
                                        data-story="swap"
                                        text="Swap"
                                    >
                                        <Icon28SyncOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === 'explorer'}
                                        data-story="explorer"
                                        text="Explorer"
                                    >
                                        <Icon28ArticleOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={() => {
                                            if (loadWallet === 1) {
                                                setModal('wallet')
                                            } else {
                                                setModal('login')
                                            }
                                        }}
                                        text="Wallet"
                                    >
                                        <Icon28ArticleOutline />
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
                        <ExplorerPanel
                            id={'explorer'}
                            tonrpc={tonrpc}
                            setAddress={setAddress}
                            setModal={setModal}
                            setAddressJopa={setAddressJopa}
                            ContrBTNAddress={ContrBTNAddress}
                            address={address}
                            loadWallet={loadWallet}
                            getBalanceBiton={getBalanceBiton}
                            getBalanceTon={getBalanceTon}
                            setPopout={setPopout}
                            getTransAddress={getTransAddress}
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
                            setSwapConfirm={setSwapConfirm}
                            swapConfirm={swapConfirm}
                            setBtnSwap={setBtnSwap}
                            btnSwap={btnSwap}
                            torSwap={torSwap}
                            setTorSwap={setTorSwap}
                        />
                    </Epic>
                </SplitCol>
                {snackbar}
            </SplitLayout>
        </AppRoot>

    )
}
