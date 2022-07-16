import {
    Icon16CancelCircle,
    Icon16CheckDoubleOutline,
    Icon20DiamondOutline,
    Icon24DeleteOutline,
    Icon28AddCircleOutline,
    Icon28ArrowDownOutline,
    Icon28ArrowLeftOutline,
    Icon28ArrowUpOutline,
    Icon28ArticleOutline,
    Icon28CoinsOutline,
    Icon28DeleteOutline,
    Icon28DoneOutline,
    Icon28DoorArrowLeftOutline,
    Icon28DoorArrowRightOutline,
    Icon28HomeOutline,
    Icon28MarketOutline,
    Icon28RefreshOutline,
    Icon28StatisticsOutline,
    Icon28SyncOutline,
    Icon28WalletOutline,
    Icon56AddCircleOutline
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
    PanelHeaderButton,
    ScreenSpinner,
    Snackbar,
    Title,
    InfoRow,
    Spinner,
    IconButton,
    ButtonGroup,
    CustomSelect,
    UsersStack,
    CustomSelectOption
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

import React, { useEffect } from 'react'
import { TonhubConnector, TonhubLocalConnector, TonhubLocalTransactionRequest } from 'ton-x'
import {
    TonhubCreatedSession,
    TonhubSessionAwaited,
    TonhubTransactionRequest,
    TonhubTransactionResponse
} from 'ton-x/dist/connector/TonhubConnector'

// import TradingViewWidget, { Themes } from 'react-tradingview-widget'

import { QRCodeSVG } from 'qrcode.react'

import { Address, BOC, Builder, Coins, Slice } from 'ton3-core'
import { useCookies } from 'react-cookie'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { exit } from 'process'
import { WalletPanel, SwapPanel, ExplorerPanel, FarmsPanel } from './panels'
import { ToncenterRPC } from './logic/tonapi'
import { TokenWallet } from './logic/contracts'
import { Enot } from './enot'

// import BitonLPTokenSVG from './static/btn-lp.svg'
import BitonLPTokenPNG from './static/btn-lp.png'
import logoPNG from './static/logo.png'

const axios = require('axios').default

const isExtension: boolean = TonhubLocalConnector.isAvailable()

function truncate (fullStr:any, strLen:any) {
    if (fullStr.length <= strLen) return fullStr

    const separator = '...'

    const sepLen = separator.length
    const charsToShow = strLen - sepLen
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)

    return fullStr.substr(0, frontChars - 3)
           + separator
           + fullStr.substr(fullStr.length - backChars)
}

let dexTypeGlobal:number = 1 // 0 -  тестнет
let connector:any

function getNet () {
    if (document.location.href.indexOf('sandbox') > -1) {
        dexTypeGlobal = 0
    }
}

getNet()

function createTonRPC () {
    if (dexTypeGlobal === 1) { // mainnet
        if (isExtension) {
            connector = new TonhubLocalConnector('mainnet')
        } else {
            connector = new TonhubConnector({ network: 'mainnet' })
        }

        return new ToncenterRPC('https://mainnet-rpc.biton.app/jsonRPC')
    } // testnet
    if (isExtension) {
        connector = new TonhubLocalConnector('sandbox')
    } else {
        connector = new TonhubConnector({ network: 'sandbox' })
    }

    return new ToncenterRPC('https://sandbox.tonhubapi.com/jsonRPC')
}

const tonrpc = createTonRPC()

export const App: React.FC = () => {
    const ContrBTNAddress = 'kQDokczBRtbRnuWDrHiEalB3Uqnl6sTsuGwx1H3WmJqJgBxb'
    const ContrBTNSwapAddress = 'kQAXGz4GcdLJYcNaLGJON_qQisWHdKwIHP93eGxfZDaHhAC3'

    const listJTestNet:any = [
        {
            id: 1,
            name: 'TON',
            symbl: 'TON',
            img: 'https://ton.org/_next/static/media/apple-touch-icon.d723311b.png',
            price: 1,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: '',
            addressSwap: '-'
        }, {
            id: 2,
            name: 'BITON',
            symbl: 'BTN',
            img: 'https://biton.pw/static/biton/img/logo.png?1',
            price: 0,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: ContrBTNAddress,
            addressSwap: ContrBTNSwapAddress
        },
        {
            id: 3,
            name: 'BITON LP',
            symbl: 'BTN-LP',
            img: BitonLPTokenPNG,
            price: 0,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: '',
            addressSwap: ''
        }
    ]

    const listJMainNet:any = [
        {
            id: 1,
            name: 'TON',
            symbl: 'TON',
            img: 'https://ton.org/_next/static/media/apple-touch-icon.d723311b.png',
            price: 1,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: '',
            addressSwap: '-'
        },
        {
            id: 2,
            name: 'JETTON',
            symbl: 'JETTON',
            img: '',
            price: 0,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: 'EQAynCuR2eiU2L-9bZqXwWd7G-mlT0HFfi66oY1W6pV6hsDX',
            addressSwap: 'EQBDWGru2u2cMtI95x2v3z9AZwIZonfA_Ztq4wtCihU2unNb'
        },
        {
            id: 3,
            name: 'JETTON',
            symbl: 'JETTON',
            img: '',
            price: 0,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: 'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw',
            addressSwap: ''
        },
        {
            id: 4,
            name: 'JETTON',
            symbl: 'JETTON',
            img: '',
            price: 0,
            min: 0.1,
            max: 1000,
            wallet: '',
            balance: 0,
            address: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y',
            addressSwap: ''
        }
    ]

    const platform = usePlatform()

    const modals = [
        'confirm',
        'send',
        'recive',
        'wallet',
        'login',
        'wait',
        'confirmSwap',
        'liquidity',
        'conf_exit',
        'add_jetton',
        'remove_jetton',
        'farms',
        'ico',
        'select',
        'select_to'
    ]

    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)
    const [ snackbar, setSnackbar ] = React.useState<any>(null)

    const [ activeStory, setActiveStory ] = React.useState<any>('swap')

    const [ address, setAddress ] = React.useState<string>('') // адрес кошелька юзера

    const [ balance, setBalance ] = React.useState<any>(0) // баланс тонов юзера

    const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0) // баланс битонов юзера

    const [ addressJopa, setAddressJopa ] = React.useState<string>('') // адрес жетон валета ???

    const [ addressSend, setAddressSend ] = React.useState<string>('') // адрес на который отправить битоны (инпут)
    const [ amountSend, setAmountSend ] = React.useState<string>('') // сумма отправки битонов (инпут)
    const [ forwardSend, setForwardSend ] = React.useState<boolean>(false) // нужен ли форвард

    const [ loadWallet, setLoadWallet ] = React.useState<number>(0) // загрузка кошелька
    const [ typeWallet, setTypeWallet ] = React.useState<number>(0) // тип кошелька 1 - тонхаб
    const [ WalletHub, setWalletHub ] = React.useState<any>(null) // объект кошелька тонхаб
    const [ sessionHub, setSessionHub ] = React.useState<any>(null) // объект сессии тонхаб

    const [ urlAuHub, setUrlAuHub ] = React.useState<any>(null) // юрл авторизации для тонхаб

    const [ swapConfirm, setSwapConfirm ] = React.useState<any>(null) // объект подтерждения свопа
    const [ btnSwap, setBtnSwap ] = React.useState<string>('') // сумма монет из 1 поля

    const [ inputLiq1, setInputLiq1 ] = React.useState<string>('') // сумма монет из 1 поля ликвидность
    const [ inputLiq2, setInputLiq2 ] = React.useState<string>('') // сумма монет из 2 поля ликвидность
    const [ liqprop, setLiqprop ] = React.useState<number>(0) // линейный курс для ликвида
    const [ liqprop2, setLiqprop2 ] = React.useState<number>(0) // линейный курс для ликвида

    const [ torSwap, setTorSwap ] = React.useState<string>('5') // Slippage Tolerance

    const [ indexArrayDelJetton, setIndexArrayDelJetton ] = React.useState<any>(null) // индекс жетона который необходимо удалить

    const [ cookies, setCookie, removeCookie ] = useCookies([ 'session', 'session_hub' ]) // куки

    const [ listJettons, setListJettons ] = React.useState<any>(
        dexTypeGlobal === 1 ? listJMainNet : listJTestNet
    ) // список жетонов в дексе

    const [ fromJetton, setFromJetton ] = React.useState<number>(0) // первый жетон в дексе на обмен
    const [ toJetton, setToJetton ] = React.useState<number>(1) // второй жетон в дексе на обмен

    const [ adderessMintLp, setAdderessMintLp ] = React.useState<any>('')
    const [ adderessUserLp, setAdderessUserLp ] = React.useState<any>('')

    const [ balanceLp, setBalanceLp ] = React.useState<number>(0) // баланс лп юзера

    const [ selectType, setSelectType ] = React.useState<any>('1') // выбор жетона для перевода

    const [ dexType, setDexType ] = React.useState<number>(dexTypeGlobal) // тип декса 0- тестнет

    const [ inpBuy, setInpBuy ] = React.useState<any>('') // выбор жетона для перевода

    const [ loadPage, setLoadPage ] = React.useState<any>(0) // Полная загрузка страницы

    const [ liqObj, setLiqObj ] = React.useState<any>(null)

    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
    }

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    function setListJettonsFromDexType (address2:any = address) {
        if (dexType === 1) { // mainnet
            if (address2 !== '') { // добавление жетона в список
                const jetton2 = 'EQD0vdSA_NedR9uvbgN9EikRX-suesDxGeFg69XQMavfLqIw'
                // getJettonWalletAddress(jetton2, address2).then((walletAddress) => {
                //     console.log('setListJettonsFromDexType walletAddress', walletAddress)
                //     if (walletAddress) {
                //         getJettonBalanceFromWalletAddress(walletAddress).then((balanceJetton) => {
                //             getDataJetton(jetton2, balanceJetton, walletAddress)
                //         })
                //     }
                // })
            }
            return listJMainNet
        } // testnet
        return listJTestNet
    }

    function setListJettonsFromStor (list:any) {
        localStorage.setItem('jettons', JSON.stringify(list))
    }

    function clearcashe () {
        setListJettonsFromStor(listJettons)
    }

    function loadListJettonsFromStor () {
        const localJettons = localStorage.getItem('jettons')
        if (localJettons) {
            const localJettonsParce = JSON.parse(localJettons)
            console.log('localJettonsParce', localJettonsParce)
            // setListJettons(localJettonsParce)
            return localJettonsParce
        }
        setListJettonsFromStor(setListJettonsFromDexType())
        return setListJettonsFromDexType()
    }

    async function getBalanceTon (addressW:any = address, type:boolean = true, list:any = listJettons) {
        const BalanceTon = await tonrpc.request('getAddressBalance', { address: addressW })
        // console.log(BalanceTon.data.result)

        const balTon = (BalanceTon.data.result / 10 ** 9).toFixed(9)
        if (type) {
            setBalance(balTon)
        }

        const listJettonsT:Array<any> = list
        listJettonsT[0].balance = Number(balTon)
        setListJettons(listJettonsT)

        return balTon
    }

    async function getBalanceLp (addressUser:string) {
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: addressUser,
            method: 'get_wallet_data',
            stack: [ ]
        })

        if (jwallPriceResp.data.result.exit_code === 0) {
            const balanceBtnRespInt = (
                Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9
            ).toFixed(9)

            setBalanceLp(Number(balanceBtnRespInt))

            // const listJettonsT:Array<any> = listJettons
            // listJettonsT[2].balance = Number(balanceBtnRespInt)
            // setListJettons(listJettonsT)

            console.log('balanceLpRespInt', balanceBtnRespInt)
        } else {
            console.error('balanceLpRespInt', jwallPriceResp.data)
        }
    }

    async function gteDataApi (url:String) {
        const data = await axios.get(url)
        return data
    }

    // добавляет новый жетон в список
    function addJettonToList
    (jsonJetton:any, jwallAddressBounceable:any, balanceJ:any, addressJetton:any) {
        const listJettonsT:Array<any> = listJettons
        let img2 = ''
        if (jsonJetton.data.image) {
            img2 = jsonJetton.data.image

            if (img2.indexOf('http') > -1) {
                img2 += ''
            } else if (img2.indexOf('ipfs://') > -1) {
                img2 = img2.substring(7, img2.length)
                img2 = `https://${jsonJetton.data.image.split('//')[1]}.ipfs.infura-ipfs.io/`
            } else {
                img2 = ''
            }
        }

        let heck = 0

        for (let i = 1; i < listJettons.length; i++) {
            if (listJettons[i].address === addressJetton) {
                heck = 1
                exit()
            }
        }
        if (heck === 0) {
            listJettonsT.push(
                {
                    id: listJettonsT[listJettonsT.length - 1].id + 1,
                    name: jsonJetton.data.name,
                    symbl: jsonJetton.data.symbol,
                    img: img2,
                    price: 0,
                    min: 0.1,
                    max: 1000,
                    wallet: jwallAddressBounceable,
                    balance: balanceJ,
                    address: addressJetton,
                    addressSwap: ''
                }
            )
            setListJettons(listJettonsT)

            setListJettonsFromStor(listJettonsT)

            getBalanceTon()
        }
    }

    // загрузка данных о жетоне
    async function getDataJetton
    (addressWallet:string, balanceJ:number, jwallAddressBounceable:String, type:any = 0) {
        const jwallAddressResp = await tonrpc.request('runGetMethod', {
            address: addressWallet,
            method: 'get_jetton_data',
            stack: [ ]
        })

        if (jwallAddressResp.data.ok === true) {
            if (jwallAddressResp.data.result.stack) {
                if (jwallAddressResp.data.result.stack.length > 2) {
                    const content = jwallAddressResp.data.result.stack[3][1].bytes

                    // console.log('stack', jwallAddressResp.data.result.stack)

                    const bocConent = BOC.fromStandard(content)
                    // console.log('bocConent', bocConent)

                    const sliceCell = Slice.parse(bocConent)
                    const prefix = sliceCell.loadUint(8)
                    // console.log('prefix', prefix)
                    if (prefix === 0x01) {
                        const size = sliceCell.bits.length
                        // console.log('sliceCell', sliceCell)

                        const stringCell = sliceCell.loadBytes(size)

                        let urlIpfs = ''
                        let str2 = (new TextDecoder('utf-8').decode(stringCell))

                        console.log('str2', str2)

                        if (str2.indexOf('http') > -1) {
                            urlIpfs = str2
                        } else if (str2.indexOf('//') > -1) {
                            str2 = str2.substring(7, str2.length)
                            urlIpfs = `https://${str2}.ipfs.infura-ipfs.io/`
                        }

                        const jsonJetton = await gteDataApi(urlIpfs)

                        console.log('jsonJetton', jsonJetton.data)

                        if (jsonJetton.data) {
                            if (type === 0) {
                                addJettonToList(
                                    jsonJetton,
                                    jwallAddressBounceable,
                                    balanceJ,
                                    addressWallet
                                )
                            } else {
                                return jsonJetton.data
                            }

                            // setModal('wallet') // костыль временно
                        } else {
                            console.error('error load json jetton')
                        }
                    } else {
                        console.error('#2 error load json jetton stack')
                    }
                } else {
                    console.error('#1 error load json jetton stack')
                    console.log('error data=>', jwallAddressResp.data.result.stack)
                }
            } else {
                console.error('enot lox')
            }
        } else {
            console.error('jwallAddressResp error')
        }
    }

    // получение баланса жентона (new)
    async function getJettonBalanceFromWalletAddress (addressWallet:string) {
        let balanceJetton = 0
        if (addressWallet) {
            const jwallCheckAddressResp = await tonrpc.request('getAddressInformation', { address: addressWallet })

            if (jwallCheckAddressResp.data.result) {
                if (jwallCheckAddressResp.data.result.state !== 'uninitialized') {
                    const jwallBalanceResp = await tonrpc.request('runGetMethod', {
                        address: addressWallet,
                        method: 'get_wallet_data',
                        stack: [ ]
                    })
                    if (jwallBalanceResp.data.ok === true) {
                        const balanceBtnRespInt = (
                            Number(jwallBalanceResp.data.result.stack[0][1]) / 10 ** 9
                        ).toFixed(9)
                        console.log(balanceBtnRespInt)
                        balanceJetton = Number(balanceBtnRespInt)
                    } else {
                        console.error('data not ok')
                    }
                } else {
                    console.error('address uninitialized')
                }
            } else {
                console.error('result error', addressWallet)
            }
        } else {
            console.error('null addressWallet', addressWallet)
        }
        return balanceJetton
    }

    // получение адреса кошелька жетона юзера (new)
    async function getJettonWalletAddress (addressJetton:any, addressUser:any) {
        const addressHexNoWC = new Address(addressUser).toString('raw').split(':')[1]

        let jwallAddressBounceable:any
        const jwallAddressResp = await tonrpc.request('runGetMethod', {
            address: addressJetton,
            method: 'get_wallet_address_int',
            stack: [ [ 'num', `0x${addressHexNoWC}` ] ]
        })

        let jwallAddress: Address
        if (jwallAddressResp.data.ok === true) {
            let cheackF = false
            if (jwallAddressResp.data.result.exit_code === 0) {
                const addr2 = `0:${jwallAddressResp.data.result.stack[0][1].substring(2)}`
                console.log(addr2)
                const walid = Address.isValid(addr2)
                if (walid) {
                    jwallAddress = new Address(addr2)

                    jwallAddressBounceable = jwallAddress.toString('base64', { bounceable: true })
                } else {
                    cheackF = true
                    console.error(jwallAddressResp.data)
                }
            }
            if (cheackF) {
                // попробовать другой метод
                const addressO = new Address(addressUser)
                const builder = new Builder().storeAddress(addressO)
                const boc2 = BOC.toBase64Standard(builder.cell())

                //         let jwallAddressBounceable2:any

                //         const ownerAddressCell = Slice
                //         ownerAddressCell.a
                const jwallAddressResp2 = await tonrpc.request('runGetMethod', {
                    address: addressJetton,
                    method: 'get_wallet_address',
                    stack: [ [ 'tvm.Slice', boc2 ] ]
                })

                if (jwallAddressResp2.data.ok === true) {
                    if (jwallAddressResp2.data.result.exit_code === 0) {
                        // const addr2 = `0:${jwallAddressResp2.data.result.stack[0][1].substring(2)}`
                        // console.log('addr2', jwallAddressResp2.data.result)

                        // console.log('bytes', jwallAddressResp2.data.result.stack[0][1].bytes)

                        const addr3 = jwallAddressResp2.data.result.stack[0][1].bytes

                        if (addr3 !== null) {
                            const addressWallet = Slice.parse(
                                BOC.fromStandard(addr3)
                            ).loadAddress()

                            console.log('addressWallet', addressWallet)

                            if (addressWallet !== null) {
                                jwallAddressBounceable = addressWallet.toString('base64', { bounceable: true })
                            } else {
                                console.error('#222 errror', jwallAddressResp2.data)
                            }
                        } else {
                            console.error('#999 error', jwallAddressResp2.data)
                        }

                        // const walletAddress = Cell
                        //     .fromBoc(Buffer.from(stack[0][1].bytes, 'base64'))[0]
                        //     .beginParse()
                        //     .readAddress()!;
                    } else {
                        console.error('jwallAddressResp2 #2', jwallAddressResp2.data)
                    }
                } else {
                    console.error('jwallAddressResp2 #1', jwallAddressResp2.data)
                }
            }
        } else {
            console.error(jwallAddressResp.data)
        }
        return jwallAddressBounceable
    }

    // получение баланса жетона (old)
    async function getJettonBalance (addressWallet:string, addressW:any = address) {
        const addressHexNoWC = new Address(addressW).toString('raw').split(':')[1]

        const jwallAddressResp = await tonrpc.request('runGetMethod', {
            address: addressWallet,
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
        // if (type) {
        //     // setAddressJopa(jwallAddressBounceable)

        //     // const listJettonsT:Array<any> = listJettons
        //     // listJettonsT[1].wallet = jwallAddressBounceable
        //     // setListJettons(listJettonsT)
        // }

        // const singTon = await windowTon.ton.send('ton_rawSign', [ { data: 'boc' } ])
        console.log(
            'user jetton wallet address:\n'
                + `${jwallAddressBounceable}`
        )

        const jwallCheckAddressResp = await tonrpc.request('getAddressInformation', { address: jwallAddressBounceable })

        // const returnBalanceOb:any = {
        //     address: jwallAddressBounceable,
        //     balance: 0
        // }

        let balanceJetton = 0
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
                balanceJetton = Number(balanceBtnRespInt)
            } else {
                console.error('data not ok')
                // if (type) {
                //     setBalanceBTN(0)
                // }
            }

            // костыль переделать вызов функции в другом месте

            // getLpData(addressW)

            // console.log(jwallBalanceResp)
        } else {
            console.error('address uninitialized')
            // if (type) {
            //     setBalanceBTN(0)
            // }
        }

        getDataJetton(addressWallet, balanceJetton, jwallAddressBounceable)
    }

    // получение данных о кошельке лп токенов юзера
    async function getLpWalletUser (address2:Address, addressUser:string) {
        const addressMinterLp = address2.toString('base64', { bounceable: true })
        console.log('addressMinterLP', address2.toString('base64', { bounceable: true }))
        // console.log('addressMinterLP', address2.toString('raw').split(':')[1])

        // enotLox(address2.toString('base64', { bounceable: true }), address2)
        console.log('AddressUser', addressUser)

        const addressUserTon = new Address(addressUser).toString('raw').split(':')[1]
        // const addressUserO = new Address(addressUser)
        // const addressCell = new Builder().storeAddress(addressUserO).cell()

        const data = {
            address: addressMinterLp,
            method: 'get_wallet_address_int',
            stack: [ [ 'num', `0x${addressUserTon}` ] ]
        }
        // console.log(data)

        const jwallPriceResp = await tonrpc.request('runGetMethod', data)
        if (jwallPriceResp.data.ok === true) {
            console.log(jwallPriceResp.data.result)
            const walletLp = new Address(`0:${jwallPriceResp.data.result.stack[0][1].slice(2)}`).toString('base64', { bounceable: false })
            setAdderessUserLp(walletLp)
            console.log('getLpWalletUser', walletLp)
            getBalanceLp(walletLp)

            // const listJettonsT:Array<any> = listJettons
            // listJettonsT[2].wallet = walletLp
            // setListJettons(listJettonsT)
        }
    }

    // получение адреса минтера лп
    async function getLpData (addressUser:string) {
        if (dexType === 0) {
            const jwallPriceResp = await tonrpc.request('runGetMethod', {
                address: listJettons[1].addressSwap, // костыль
                method: 'get_lp_params',
                stack: [ ]
            })
            console.log('getLpData', jwallPriceResp.data)
            if (jwallPriceResp.data.ok === true) {
                const addressMin = jwallPriceResp.data.result.stack[5][1].bytes
                const addressOver = Slice.parse(BOC.fromStandard(addressMin)).loadAddress()
                // console.log(addressOver)
                if (addressOver !== null) {
                    setAdderessMintLp(addressOver)

                    const jwallAddressBounceable = addressOver.toString('base64', { bounceable: true })

                    // const listJettonsT:Array<any> = listJettons
                    // listJettonsT[2].address = jwallAddressBounceable
                    // setListJettons(listJettonsT)

                    getLpWalletUser(addressOver, addressUser)
                }
            }
        } else {
            const jwallPriceResp = await tonrpc.request('runGetMethod', {
                address: listJettons[1].addressSwap, // костыль
                method: 'get_lp_minter_address',
                stack: [ ]
            })
            console.log('get_lp_minter_address', jwallPriceResp.data)
            if (jwallPriceResp.data.ok === true) {
                const addressMin = jwallPriceResp.data.result.stack[1][1]
                const addressOver = new Address(`0:${addressMin.slice(2)}`).toString('base64', { bounceable: true })

                console.log('WALLET FROM addressOver', addressOver)

                if (addressOver) {
                    // const addressO = new Address(addressOver)
                    // const builder = new Builder().storeAddress(addressO)
                    // const boc2 = BOC.toBase64Standard(builder.cell())

                    const addressUserTon = new Address(addressUser).toString('raw').split(':')[1]

                    const data = {
                        address: addressOver,
                        method: 'get_wallet_address_int',
                        stack: [ [ 'num', `0x${addressUserTon}` ] ]
                        // stack: [ [ 'tvm.Slice', boc2 ] ]
                    }
                    console.log(data)

                    const jwallPriceResp3 = await tonrpc.request('runGetMethod', data)

                    if (jwallPriceResp3.data.ok === true) {
                        console.log('jwallPriceResp3', jwallPriceResp3.data.result)
                        const addressWal2 = jwallPriceResp3.data.result.stack[0][1]

                        console.log('addressWal', addressWal2)

                        const addressOver2 = new Address(`0:${addressWal2.slice(2)}`).toString('base64', { bounceable: true })
                        if (addressOver2) {
                            setAdderessUserLp(addressOver2)
                            console.log('addressOver2', addressOver2)
                            getBalanceLp(addressOver2)
                        }

                    // const listJettonsT:Array<any> = listJettons
                    // listJettonsT[2].wallet = walletLp
                    // setListJettons(listJettonsT)
                    }
                }

                // const jwallPriceResp = await tonrpc.request('runGetMethod', data)
                // if (jwallPriceResp.data.ok === true) {
                //     console.log(jwallPriceResp.data.result)
                //     const walletLp = new Address(`0:${jwallPriceResp.data.result.stack[0][1].slice(2)}`).toString('base64', { bounceable: false })
                //     setAdderessUserLp(walletLp)
                //     console.log('getLpWalletUser', walletLp)
                //     getBalanceLp(walletLp)

                //     // const listJettonsT:Array<any> = listJettons
                //     // listJettonsT[2].wallet = walletLp
                //     // setListJettons(listJettonsT)
                // }

                // const addressMin = jwallPriceResp.data.result.stack[5][1].bytes
                // const addressOver = Slice.parse(BOC.fromStandard(addressMin)).loadAddress()
                // // console.log(addressOver)
                // if (addressOver !== null) {
                //     setAdderessMintLp(addressOver)

                //     const jwallAddressBounceable = addressOver.toString('base64', { bounceable: true })

                //     // const listJettonsT:Array<any> = listJettons
                //     // listJettonsT[2].address = jwallAddressBounceable
                //     // setListJettons(listJettonsT)

                //     getLpWalletUser(addressOver, addressUser)
                // }
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

        // loginHub ()
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

            const listJettonsT:Array<any> = listJettons
            listJettonsT[1].wallet = jwallAddressBounceable
            setListJettons(listJettonsT)
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

                const listJettonsT:Array<any> = listJettons
                listJettonsT[1].balance = Number(balanceBtnRespInt)
                setListJettons(listJettonsT)

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

            setLiqprop2(
                parseFloat(
                    (1 / (Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9)).toFixed(9)
                )
            )
        }
        console.log(jwallPriceResp)
    }

    // получение цены свопа на лп токены (new)
    async function getPriceSwapNew () {
        const address2 = fromJetton === 0
            ? listJettons[toJetton].addressSwap
            : listJettons[fromJetton].addressSwap
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: address2,
            method: dexType === 1 ? 'get_linear_price' : 'get_price',
            stack: [ ]
        })
        if (jwallPriceResp.data.ok === true) {
            setLiqprop(parseFloat(
                (Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9).toFixed(9)
            ))
            setLiqprop2(
                parseFloat(
                    (1 / (Number(jwallPriceResp.data.result.stack[0][1]) / 10 ** 9)).toFixed(9)
                )
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

    async function getBalanceSwap () {
        const addressSwap2 = fromJetton === 0
            ? listJettons[toJetton].addressSwap
            : listJettons[fromJetton].addressSwap

        const jwallAddressResp = await tonrpc.request('runGetMethod', {
            address: addressSwap2,
            method: 'get_btn_balance',
            stack: [ ]
        })

        if (jwallAddressResp.data.ok === true) {
            const balanceJetton = parseFloat(
                (Number(jwallAddressResp.data.result.stack[0][1]) / 10 ** 9).toFixed(9)
            )

            console.log('balanceJettonSwap', balanceJetton)

            const jwallAddressResp2 = await tonrpc.request('runGetMethod', {
                address: addressSwap2,
                method: 'get_service_collect_fee',
                stack: [ ]
            })

            if (jwallAddressResp2.data.ok === true) {
                // console.log('jwallAddressResp2', jwallAddressResp2.data.result)

                const balanceFee = parseFloat(
                    (Number(jwallAddressResp2.data.result.stack[0][1]) / 10 ** 9).toFixed(9)
                )
                console.log('balanceFee', balanceFee)

                const BalanceTon = await tonrpc.request('getAddressBalance', { address: addressSwap2 })
                // console.log(BalanceTon.data.result)

                let balTon = parseFloat((BalanceTon.data.result / 10 ** 9).toFixed(9))
                balTon -= balanceFee

                console.log('balTon', balTon)

                const obff = {
                    balanceTon: balTon,
                    balanceJetton
                }
                setLiqObj(obff)
            } else {
                console.error('get_btn_balance', jwallAddressResp.data)
            }
        } else {
            console.error('get_btn_balance', jwallAddressResp.data)
        }
    }

    async function updateInfoJettons (list:any, address2:any = address) {
        const listJettons2 = list
        for (let i = 1; i < listJettons2.length; i++) {
            if (listJettons2[i].address !== '') {
                // console.log('listJettons2[i]', listJettons2[i])
                const info = await getDataJetton(listJettons2[i].address, 0, '', 1)
                if (info) {
                    listJettons2[i].name = info.name
                    listJettons2[i].symbl = info.symbol

                    let img2 = ''
                    if (info.image) {
                        img2 = info.image
                        if (img2.indexOf('http') > -1) {
                            img2 += ''
                        } else if (img2.indexOf('ipfs://') > -1) {
                            img2 = img2.substring(7, img2.length)
                            img2 = `https://${info.image.split('//')[1]}.ipfs.infura-ipfs.io/`
                        } else {
                            img2 = ''
                        }
                    } else if (info.image_data) { // болт дурак
                        img2 = `data:image/svg+xml;base64,${info.image_data}`
                        console.log('BOLT================', info)
                    }
                    listJettons2[i].img = img2
                } else {
                    console.error('info null', info)
                }
            } else {
                console.error('wallet address jetton null')
            }
        }
        setListJettonsFromStor(listJettons2)
        setListJettons(listJettons2)

        setLoadPage(1)
        if (address2) {
            getBalanceTon(address2, true, listJettons2)
            getLpData(address2)

            getBalanceSwap()
        }

        setPopout(null)
    }

    // обновление баланса жентонов из списка
    async function loadBalanceFromListJettons (list:any, address2:any = address) {
        const listJettons2 = list
        for (let i = 1; i < listJettons2.length; i++) {
            if (listJettons2[i].wallet !== '') {
                // console.log('listJettons2[i]', listJettons2[i])
                const balanceJetton = await getJettonBalanceFromWalletAddress(listJettons2[i].wallet)
                listJettons2[i].balance = balanceJetton
            } else {
                console.error('wallet address jetton null')
            }
        }
        updateInfoJettons(listJettons2, address2)
        // setListJettonsFromStor(listJettons2)
        // setListJettons(listJettons2)
    }

    // обновление валетадресов жентонов из списка
    async function loadWalletAddressFromListJettons (list:any, address2:any) {
        if (address2) {
            const listJettons2 = list
            console.log('listJettons2', listJettons2)
            for (let i = 1; i < listJettons2.length; i++) {
            // console.log('listJettons2[i]', listJettons2[i])
                const walletJetton = await getJettonWalletAddress(listJettons2[i].address, address2)
                if (walletJetton) {
                    listJettons2[i].wallet = walletJetton
                }
            }
            // setListJettonsFromStor(listJettons2)
            // setListJettons(listJettons2)

            loadBalanceFromListJettons(listJettons2, address2)
        }
    }

    async function loginIframeHub () {
        if (isExtension) {
            setAddress(connector.config.address)

            // getBalanceTon(connector.config.address)

            loadWalletAddressFromListJettons(listJettons, connector.config.address)

            setWalletHub(connector.config)

            setLoadWallet(1)
        }
    }

    // авторизация через куки тонхаб
    async function loginCook () {
        const sess = cookies.session
        const sessNow = cookies.session_hub
        const listJ:any = loadListJettonsFromStor()

        setPopout(<ScreenSpinner />)

        if (sess && sessNow) {
            setTypeWallet(1)
            setWalletHub(sess)

            setListJettons(setListJettonsFromDexType(sess.wallet.address))

            setSessionHub(sessNow)

            setAddress(sess.wallet.address)

            // getBalanceTon(sess.wallet.address)

            // getLpData(sess.wallet.address)
            // getBalanceBiton(sess.wallet.address)

            // loadBalanceFromListJettons(listJ)
            loadWalletAddressFromListJettons(listJ, sess.wallet.address)

            setLoadWallet(1)
        }

        loadBalanceFromListJettons(listJ)

        if (isExtension) {
            loginIframeHub()
        }
    }

    // авторизация через кошелек тонхаб
    async function loginHub () {
        if (isExtension) {
            const connector = new TonhubLocalConnector('sandbox')
            alert(JSON.stringify(connector))
        } else {
            setPopout(<ScreenSpinner />)
            const session1: TonhubCreatedSession = await connector.createNewSession({
                name: 'Biton',
                url: 'https://btn-user-platform-git-dev-biton.vercel.app/'
                // url: window.location.href
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

                    setListJettons(setListJettonsFromDexType(session.wallet.address))

                    setCookie('session', session)

                    setAddress(session.wallet.address)

                    setModal(null)

                    // getBalanceTon(session.wallet.address)
                    // getBalanceBiton(session.wallet.address)

                    getLpData(session.wallet.address)

                    setLoadWallet(1)

                    const listJ:any = loadListJettonsFromStor()

                    // loadBalanceFromListJettons(listJ)
                    loadWalletAddressFromListJettons(listJ, session.wallet.address)

                    setPopout(null)
                } else {
                    setUrlAuHub(null)
                    setPopout(null)
                    setModal(null)
                    console.log('error')
                }
            } else {
                setUrlAuHub(null)
                setPopout(null)
                setModal(null)
                throw new Error('Impossible')
            }
            setPopout(null)
        }
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
            // getPriceLP()
            // loginHub()

            // setListJettons(setListJettonsFromDexType()) // временно
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
            const singTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 100000000, to: listJettons[1].wallet, dataType: 'boc', data: boc } ])
            console.log(singTon)
            setAddressSend('')
            setAmountSend('')
        } else {
            console.log('error')
        }
    }

    // основная функция отправка транс через тонхаб
    async function sendBocTHub (
        addressJopa1: any = listJettons[1].wallet,
        valueTon: any = '100000000',
        boc1: any = null
    ): Promise<Object> {
        if (isExtension && WalletHub !== null) {
            const request: TonhubLocalTransactionRequest = {
                to: addressJopa1, // Destination
                value: valueTon, // Amount in nano-tons
                text: '' // Optional comment. If no payload specified - sends actual content, if payload is provided this text is used as UI-only hint
            }

            if (boc1 !== null) {
                request.payload = boc1
            }
            const response: any = await connector
                .requestTransaction(request)

            if (response.type === 'success') {
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
                    // getBalanceBiton()
                }, 10 * 1000)
                return { type: 'ok', data: response }
            }
            console.log(response)
            return { type: 'error', data: response }
        } if (WalletHub !== null && sessionHub !== null) {
            // setPopout(<ScreenSpinner />)
            setModal('confirm')
            // const windowTon:any = window
            console.log('addressJopa1', addressJopa1)

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
                    // getBalanceTon()
                    loginCook() // временно
                }, 10 * 1000)
                return { type: 'ok', data: response }
            }
            console.log('response else', response)

            // throw new Error('Impossible')
        } else {
            console.log('error')
            return { type: 'error', data: null }
        }

        return { type: 'error', data: null }
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
        const result:any = await sendBocTHub(listJettons[1].wallet, '100000000', boc)

        if (result.type === 'error') {
            console.error(result)
            setModal(null)
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

    // отправка жетонов через тонхаб
    async function sendJettonHub () {
        const indexJetton:number = Number(selectType)
        console.log('selectTypeChange', indexJetton)
        if (indexJetton !== undefined) {
            if (indexJetton === 0) { // ton
                console.log('addressSend', addressSend)
                sendBocTHub(addressSend, new Coins(amountSend).toNano())
            } else { // остальные жетоны
                const msg = TokenWallet.transferMsg({
                    queryId: BigInt(Date.now()),
                    amount: new Coins(amountSend),
                    destination: new Address(addressSend),
                    responseDestination: new Address(address),
                    forwardTonAmount: new Coins(forwardSend ? 0.1 : 0)
                })
                const boc = BOC.toBase64Standard(msg)
                const result:any = await sendBocTHub(listJettons[indexJetton].wallet, '100000000', boc)

                if (result.type === 'error') {
                    console.error(result)
                    setModal(null)
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
        } else {
            console.log('error #selectType')
        }
    }

    // покупка битонов
    async function buyBtn (amount:any = 10) {
        // const windowTon:any = window
        // const addressTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 10000000000, to: ContrBTNAddress } ])
        // console.log(addressTon)

        const result:any = await sendBocTHub(ContrBTNAddress, new Coins(amount).toNano(), null)

        if (result.type === 'error') {
            console.error(result)
            setModal(null)
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
            .storeCoins(new Coins(swapConfirm.price).mul((Number(torSwap + 100) / 100) + 1))
            .cell()
        console.log(new Coins(swapConfirm.price).mul((Number(torSwap) / 100) + 1).toNano())
        const boc = BOC.toBase64Standard(builderF)

        const result:any = await sendBocTHub((fromJetton === 0
            ? listJettons[toJetton].addressSwap
            : listJettons[fromJetton].addressSwap), `${Number(btnSwap) * (10 ** 9)}`, null)

        if (result.type === 'error') {
            console.error(result)
            setModal(null)
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
            // const toleranceValue = calculateToleranceValue(
            //     new Coins(swapConfirm.price),
            //     Number(torSwap)
            // )

            // const forwardPayload = new Builder()
            //     .storeUint(1002, 32) // swap op code
            //     .storeCoins(toleranceValue)
            console.log('start swap')

            const msg = TokenWallet.transferMsg({
                queryId: BigInt(Date.now()),
                amount: new Coins(btnSwap),
                destination: new Address((fromJetton === 0
                    ? listJettons[toJetton].addressSwap
                    : listJettons[fromJetton].addressSwap)),
                responseDestination: new Address(address),
                forwardTonAmount: new Coins(0.05)
                // forwardPayload: forwardPayload.cell()
            })

            const result: any = await sendBocTHub(
                listJettons[1].wallet,
                new Coins(0.1).toNano(),
                BOC.toBase64Standard(msg)
            )

            if (result.type === 'error') {
                console.error(result)
                setModal(null)
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
            destination: new Address((fromJetton === 0
                ? listJettons[toJetton].addressSwap
                : listJettons[fromJetton].addressSwap)),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(inputLiq1),
            forwardPayload: new Builder()
                .storeUint(1002, 32)
                .cell()
        })
        const boc = BOC.toBase64Standard(msg)
        const result:any = await sendBocTHub(
            listJettons[1].wallet,
            new Coins(inputLiq1).add(0.2).toNano(),
            boc
        )

        if (result.type === 'error') {
            console.error('error addLiq', result)
            console.error('addressJopa', listJettons[1].wallet)
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

    async function removeLp () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(balanceLp),
            destination: new Address((fromJetton === 0
                ? listJettons[toJetton].addressSwap
                : listJettons[fromJetton].addressSwap)),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(0.1)
        })
        const boc = BOC.toBase64Standard(msg)
        const result:any = await sendBocTHub(adderessUserLp, new Coins(0.15).toNano(), boc)

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
            // setAddressSend('')
            // setAmountSend('')
            // setForwardSend(false)
            console.log(result)
        }
    }

    async function addNewJetton (address2:any) {
        if (address !== '') {
            const walletAddress = await getJettonWalletAddress(address2, address)
            if (walletAddress) {
                const balanceJetton = await getJettonBalanceFromWalletAddress(walletAddress)
                getDataJetton(address2, balanceJetton, walletAddress)
            } else {
                setSnackbar(<Snackbar
                    onClose={() => setSnackbar(null)}
                    before={
                        <Avatar size={24} style={{ background: 'var(--destructive)' }}>
                            <Icon16CancelCircle fill="#fff" width={14} height={14} />
                        </Avatar>
                    }
                >
                    Error - walletAddress
                </Snackbar>)
            }
        } else {
            setSnackbar(<Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar size={24} style={{ background: 'var(--destructive)' }}>
                        <Icon16CancelCircle fill="#fff" width={14} height={14} />
                    </Avatar>
                }
            >
                Error - Null address
            </Snackbar>)
        }
    }

    async function delJetton (indexArray:any = indexArrayDelJetton) {
        const listJettonsT:Array<any> = listJettons
        listJettonsT.splice(indexArray, 1)
        setListJettons(listJettonsT)
        setListJettonsFromStor(listJettonsT)
    }

    function balanceString (balance2:any) {
        return Number(Number(balance2).toFixed(2)).toLocaleString('ru')
    }

    function calculateAmountNew (amount:any, type:any) {
        if (amount === '') {
            setInputLiq1('')
            setInputLiq2('')
        } else {
            const amountN = Number(amount)
            if (type === 0) { // from
                const amountTo = liqprop2 * amountN

                setInputLiq2(parseFloat(amountTo.toFixed(10)).toFixed(9))
                setInputLiq1(amount)
            } else { // to
                const amountFrom = liqprop * amountN

                setInputLiq1(parseFloat(amountFrom.toFixed(10)).toFixed(9))
                setInputLiq2(amount)
            }
        }
    }

    function inputNumberSet (value:string) {
        if (value !== '') {
            const numValue = Number(value)
            const isN = Number.isNaN(numValue)
            if (isN === false) {
                if (numValue > 0) {
                    if (numValue < 10000) {
                        return value
                    }
                    return '10000'
                }
                return '0'
            }
            console.log('erro1')
            return ''
        }
        return ''
    }

    function filterArr (arr:any) {
        const result = arr.filter((jetton:any) => jetton.addressSwap !== '')
        // console.log(result)
        return result
    }

    function changeJetton (jetton:any, type:any) {
        // getPriceSwap()

        if (type === 0) { // from
            if (Number(jetton) === Number(toJetton)) {
                // если юзер выбрал 2 одинаковых жетона - меняем местами
                setToJetton(Number(fromJetton))
            } else if (Number(toJetton) === 0) {
                // если юзер хочет поменять тон на жетон - поставить тон в другой выбор
                setToJetton(0)
            } else if (Number(fromJetton) === 0) {
                setToJetton(0)
            }
            setFromJetton(Number(jetton))
        } else { // to
            if (Number(jetton) === Number(fromJetton)) {
                // если юзер выбрал 2 одинаковых жетона - меняем местами
                setFromJetton(Number(toJetton))
            } else if (Number(toJetton) === 0) {
                // если юзер хочет поменять тон на жетон - поставить тон в другой выбор
                setFromJetton(0)
            } else if (Number(fromJetton) === 0) {
                setFromJetton(0)
            }
            setToJetton(Number(jetton))
        }

        calculateAmountNew(btnSwap, 0)
        setModal(null)
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
                            : <Button size='l' stretched href={dexTypeGlobal ? 'ton://connect' : 'ton-test://connect'}>Confirm in TonHub</Button>
                        }
                    </Div>
                </Group>
            </ModalPage>

            {/* exit */}
            <ModalPage
                id={modals[8]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Exit</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2">Do you really want to logout?</Title>
                        <br />
                        <ButtonGroup mode="horizontal" gap="m" stretched>
                            <Button size="l" mode="secondary" stretched onClick={() => setModal('wallet')}>
                            Cancel
                            </Button>
                            <Button size="l" appearance="negative" stretched onClick={() => unlogin()}>
                            Logout
                            </Button>
                        </ButtonGroup>
                    </Div>
                </Group>
            </ModalPage>

            {/* select from jetton */}
            <ModalPage
                id={modals[13]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Select</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2">Select jetton from swap</Title>
                        <br />
                        {filterArr(listJettons).map(
                            (jetton:any, key:number) => (
                                <SimpleCell
                                    key={key}
                                    before={<Avatar size={48} src={jetton.img} />}
                                    // badge={<Icon20DiamondOutline />}
                                    after={key === fromJetton ? <Icon28DoneOutline /> : null}
                                    description={`${balanceString(jetton.balance)} ${jetton.symbl}`}
                                    onClick={ () => changeJetton(key, 0)}
                                >
                                    {jetton.name}
                                </SimpleCell>)
                        )}
                    </Div>
                </Group>
            </ModalPage>

            {/* select to jetton */}
            <ModalPage
                id={modals[14]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Select</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2">Select jetton to swap</Title>
                        <br />
                        {filterArr(listJettons).map(
                            (jetton:any, key:number) => (
                                <SimpleCell
                                    key={key}
                                    before={<Avatar size={48} src={jetton.img} />}
                                    // badge={<Icon20DiamondOutline />}
                                    after={key === toJetton ? <Icon28DoneOutline /> : null}
                                    description={`${balanceString(jetton.balance)} ${jetton.symbl}`}
                                    onClick={ () => changeJetton(key, 1)}
                                >
                                    {jetton.name}
                                </SimpleCell>)
                        )}
                    </Div>
                </Group>
            </ModalPage>

            {/* del jetton */}
            <ModalPage
                id={modals[10]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Remove jetton</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2">Do you really want to remove jetton?</Title>
                        <br />
                        <ButtonGroup mode="horizontal" gap="m" stretched>
                            <Button size="l" mode="secondary" stretched onClick={() => setModal('wallet')}>
                            Cancel
                            </Button>
                            <Button size="l" appearance="negative" stretched onClick={() => {
                                delJetton()
                                setModal('wallet')
                            }
                            }>
                            Remove
                            </Button>
                        </ButtonGroup>
                    </Div>
                </Group>
            </ModalPage>

            {/* wait */}
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
                        {isDesktop || isExtension ? null
                            : <Button size='l' stretched href={dexTypeGlobal ? 'ton://connect' : 'ton-test://connect'}>View in TonHub</Button>
                        }
                    </Div>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[9]}
                onClose={() => {
                    setAddressSend('')
                    setModal('wallet')
                }}
                header={<ModalPageHeader>Add jetton</ModalPageHeader>}
            >
                <Group>
                    <FormItem
                        top="Jetton"
                    >
                        <Input value={addressSend} onChange={(e) => { setAddressSend(e.target.value) }} placeholder="Enter address" />
                    </FormItem>

                    <Div>
                        <Button size={'l'} stretched before={<Icon28AddCircleOutline/>} onClick={() => {
                            addNewJetton(addressSend)
                            setModal('wallet')
                        }
                        } mode="secondary">Add jetton</Button>
                    </Div>

                </Group>
            </ModalPage>

            <ModalPage
                id={modals[12]}
                onClose={() => {
                    setInpBuy('')
                    setModal('wallet')
                }}
                header={<ModalPageHeader>Buy BTN</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2" style={{ margin: '0 12px' }}>Price: 10 BTN per 1 TON</Title>
                    </Div>
                    <FormItem
                        top="Amount TON"
                    >
                        <Input value={inpBuy} onChange={(e) => { setInpBuy(inputNumberSet(e.target.value)) }} placeholder="1 - 10000" />
                    </FormItem>

                    <Div>
                        <Button size={'l'} stretched before={<Icon28AddCircleOutline/>} onClick={() => {
                            buyBtn(Number(inpBuy))
                            // setModal('confirm')
                        }
                        } mode="secondary">Buy BTN</Button>
                    </Div>

                </Group>
            </ModalPage>

            <ModalPage
                id={modals[11]}
                onClose={() => {
                    setModal(null)
                }}
                header={<ModalPageHeader>Farms</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <div style={{ paddingBottom: 32 }}>
                            <Title weight="3" level="1">Liquidity</Title>
                            <small>Stake LP tokens to earn</small>
                        </div>
                        <CardGrid size="l">
                            {listJettons.length > 2
                                ? <Card>
                                    <SimpleCell
                                        disabled
                                        before={
                                            <Div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingLeft: 0 }}>
                                                <Avatar size={48} src={listJettons[0].img} />
                                                <Avatar size={48} src={listJettons[1].img} />
                                            </Div>
                                        }
                                        after={
                                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <span style={{ paddingRight: '12px' }}>
                                                    <b>
                                                        {listJettons[2].balance} BTN-LP
                                                    </b>
                                                </span>
                                                <IconButton onClick={() => setModal('liquidity')}>
                                                    <Icon28AddCircleOutline />
                                                </IconButton>
                                            </div>
                                        }
                                    // description="Бот"
                                    >
                                        <b>TON-BTN</b>
                                    </SimpleCell>
                                </Card>
                                : null }
                        </CardGrid>
                    </Div>

                </Group>
            </ModalPage>

            {/* confirm */}
            <ModalPage
                id={modals[6]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Confirm</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <Title weight="3" level="2" style={{ margin: '0 12px' }}>Info for swap</Title>
                        <br />
                        {swapConfirm !== null
                            ? <div>
                                <SimpleCell multiline>
                                    <InfoRow header={`Give amount ${listJettons[fromJetton].symbl}`}>{Number(swapConfirm.amountU).toFixed(2)}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={`Accept amount ${listJettons[toJetton].symbl}`}>{Number(swapConfirm.amount).toFixed(2)}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={'Market price'}>{swapConfirm.price}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={'Fee'}>{Number(swapConfirm.fee).toFixed(2)}</InfoRow>
                                </SimpleCell>
                                <SimpleCell multiline>
                                    <InfoRow header={'Price Impact'} style={swapConfirm.imact > 10 ? { color: 'var(--destructive)' } : {}}>
                                        {Number(swapConfirm.imact < 0 ? 0 : swapConfirm.imact)
                                            .toFixed(2)} %
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

            {/* send */}
            <ModalPage
                id={modals[1]}
                onClose={() => {
                    setModal('wallet')
                    setAddressSend('')
                }}
                header={<ModalPageHeader>Send</ModalPageHeader>}
            >
                {listJettons[selectType]
                    ? <Group>
                        <FormItem style={{ flexGrow: 1, flexShrink: 1 }} top="Jetton" bottom={`Balance: ${balanceString(listJettons[selectType].balance)}`} >

                            {listJettons.length > 0
                                ? <CustomSelect
                                    placeholder="BTN"
                                    options={
                                        listJettons.map(
                                            (jetton:any, key:number) => ({
                                                label: jetton.name,
                                                value: key,
                                                avatar: jetton.img,
                                                description: `${balanceString(jetton.balance)} ${jetton.symbl}`
                                            })
                                        )
                                    }
                                    renderOption={({ option, ...restProps }) => (
                                        <CustomSelectOption
                                            {...restProps}
                                            before={
                                                <Avatar size={20} src={option.avatar} />
                                            }
                                            description={option.description}
                                        />

                                    )}
                                    value={selectType}
                                    onChange={(e:any) => {
                                        setSelectType(e.target.value)
                                    }}
                                >
                                </CustomSelect>
                                : null}
                        </FormItem>

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
                                // sendBtionHub()
                                    sendJettonHub()
                                }
                            }} disabled={amountSend === '' || addressSend === '' || (addressSend.toLowerCase().substring(0, 2) !== 'kq' && addressSend.toLowerCase().substring(0, 2) !== 'eq')}>
                  Send
                            </Button>
                        </FormItem>
                    </Group>
                    : null }
            </ModalPage>

            <ModalPage
                id={modals[2]}
                onClose={() => setModal('wallet')}
                dynamicContentHeight
                settlingHeight={90}
                header={<ModalPageHeader>Receive</ModalPageHeader>}
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

                    <Div>
                        <CopyToClipboard text={address}
                            onCopy={() => {}}>
                            <Button size="l" mode="secondary" stretched>Copy address</Button>
                        </CopyToClipboard>
                    </Div>
                </Group>
            </ModalPage>

            {/* wallet */}
            <ModalPage
                id={modals[3]}
                onClose={() => setModal(null)}
                dynamicContentHeight
                settlingHeight={80}
                header={<ModalPageHeader left={
                    <PanelHeaderButton aria-label='1' onClick={() => {
                        if (typeWallet === 0) {
                            login()
                        } else {
                            // getBalanceTon()
                            loginCook()
                            // getBalanceBiton()
                        }
                    }}><Icon28RefreshOutline /></PanelHeaderButton>
                }
                right={
                    <PanelHeaderButton aria-label='1' onClick={() => {
                        setModal('conf_exit')
                        // unlogin()
                    }}><Icon28DoorArrowRightOutline /></PanelHeaderButton>
                }
                >
                    Wallet
                </ModalPageHeader>}

            >
                <Group>
                    <Div>
                        <div style={{ paddingBottom: 32 }}>
                            <Title weight="3" level="1">Account</Title>
                            <small>Connect with TonHub on BITON</small>
                        </div>
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
                    </Div>
                    {/* <Gradient
                        style={{
                            margin: '-7px -7px 0 -7px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '6px 32px 32px'
                        }}
                    >
                        <div style={{ paddingBottom: 8 }}>
                            <small>Connect with TonHub on BITON</small>
                        </div>
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
                    </Gradient> */}

                    { loadWallet === 1
                        ? <Div>

                            <CardGrid size="l">
                                <Card>
                                    <Div>
                                        {listJettons.length ? listJettons.map(
                                            (jetton:any, key:any) => <SimpleCell
                                                key={key}
                                                before={<Avatar size={48} src={jetton.img} />}
                                                // badge={<Icon20DiamondOutline />}
                                                after={
                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                        <b>
                                                            {balanceString(jetton.balance)}
                                                            {` ${jetton.symbl}`}
                                                        </b>
                                                        {key > 3
                                                            ? <IconButton
                                                                onClick={
                                                                    () => {
                                                                        setModal('remove_jetton')
                                                                        setIndexArrayDelJetton(key)
                                                                    }
                                                                }
                                                            >
                                                                <Icon24DeleteOutline/>
                                                            </IconButton>
                                                            : null
                                                        }
                                                    </div>
                                                }
                                                disabled
                                            >
                                                {jetton.name}
                                            </SimpleCell>
                                        ) : null}
                                        <SimpleCell
                                            onClick={() => setModal('add_jetton')}
                                            before={
                                                <Icon56AddCircleOutline width={48} height={48} />
                                            }
                                            // badge={<Icon20DiamondOutline />}
                                        >
                                            <b>Add jetton</b>
                                        </SimpleCell>
                                    </Div>
                                </Card>
                            </CardGrid>
                            <br />

                            {/* <div>
                                <Button size={'l'} stretched before={<Icon28AddCircleOutline/>} onClick={() => setModal('add_jetton')} mode="secondary">Add jetton</Button>
                            </div>
                            <br /> */}

                            {dexType === 1 ? null
                                : <div>
                                    <Button size='s' stretched onClick={() => setModal('ico')}>Buy BTN</Button>
                                </div>
                            }
                            <br />
                            {dexType === 1 ? null

                                : <div>
                                    <Button size='s' stretched mode="secondary" href="https://t.me/sandbox_faucet_bot" target='_blank'>Get TestNet Coins</Button>
                                </div>
                            }

                            <Button size='s' stretched onClick={() => clearcashe()}>Del cashe jettons</Button>
                        </Div>
                        : null
                    }

                </Group>
            </ModalPage>

            {/* Login */}
            <ModalPage
                id={modals[4]}
                onClose={() => setModal(null)}
                dynamicContentHeight
                settlingHeight={90}
                header={<ModalPageHeader left={
                    urlAuHub === null ? null
                        : <PanelHeaderButton onClick={() => {
                            setUrlAuHub(null)
                            setModal(null)
                        }}><Icon28ArrowLeftOutline /></PanelHeaderButton>
                }>Login</ModalPageHeader>}
            >
                <Group>
                    {urlAuHub === null && false
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
                                <Div style={{ background: '#fff', borderRadius: '32px', padding: '32px' }} className="div_qr">
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

            {/* liquidity */}
            <ModalPage
                id={modals[7]}
                onClose={() => {
                    setInputLiq1('')
                    setInputLiq2('')
                    setModal(null)
                }}
                header={<ModalPageHeader>Liquidity</ModalPageHeader>}
            >
                <Group>
                    <Div>
                        <div style={{ paddingBottom: 32 }}>
                            <Title weight="3" level="1">Add</Title>
                            <small>Give your jettons and get lp tokens</small>
                        </div>
                        {listJettons.length > 1

                            ? <CardGrid size="l">
                                <Card>
                                    {/* <div style={{ display: 'flex' }}>
                                    <FormItem top="Add Ton" style={{ width: '65%' }}>
                                        <Input placeholder="0.0" value={inputLiq1} onChange={(e) => { calculatePriceInput(e.target.value) }} type={'number'} />
                                    </FormItem>

                                    <FormItem top={`Balance: ${Number(balance).toFixed(2)}`} style={{ width: '20%' }}>
                                        <Cell
                                            disabled
                                            after={<Avatar src="https://ton.org/_next/static/media/apple-touch-icon.d723311b.png" size={24} />}
                                        >TON</Cell>
                                    </FormItem>

                                </div> */}

                                    <Div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <small>From</small>
                                            <small>{`Balance: ${balanceString(listJettons[0].balance)}`}</small>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>

                                            <Avatar
                                                src={listJettons[0].img}
                                                size={34}
                                            />
                                            <CustomSelect
                                                placeholder="TON"
                                                selectType="plain"
                                                className='fix_input'
                                                style={{ maxWidth: '32%' }}
                                                disabled
                                                options={
                                                    filterArr(listJettons).map(
                                                        (jetton:any, key:number) => ({
                                                            label: jetton.symbl,
                                                            value: key,
                                                            avatar: jetton.img,
                                                            description: `${balanceString(jetton.balance)} ${jetton.symbl}`
                                                        })
                                                    )
                                                }
                                                renderOption={({ option, ...restProps }) => (

                                                    <CustomSelectOption
                                                        {...restProps}
                                                        before={
                                                            <Avatar
                                                                size={20}
                                                                src={option.avatar}
                                                            />
                                                        }
                                                    // description={option.description}
                                                    />

                                                )}
                                                value={0}
                                                onChange={(e:any) => {
                                                }}
                                            >
                                            </CustomSelect>

                                            <Input
                                                placeholder="0.0"
                                                value={inputLiq1}
                                                onChange={(e) => {
                                                    calculateAmountNew(
                                                        inputNumberSet(e.target.value),
                                                        0
                                                    )
                                                }}
                                                align="right"
                                                className='fix_input'
                                                style={
                                                    { border: 'none' }
                                                }
                                            />

                                        </div>
                                    </Div>

                                </Card>

                                <Card>
                                    <Div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <small>From</small>
                                            <small>{`Balance: ${balanceString(listJettons[1].balance)}`}</small>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>

                                            <Avatar
                                                src={listJettons[1].img}
                                                size={34}
                                            />
                                            <CustomSelect
                                                placeholder="VNR"
                                                selectType="plain"
                                                className='fix_input'
                                                style={{ maxWidth: '32%' }}
                                                disabled
                                                options={
                                                    filterArr(listJettons).map(
                                                        (jetton:any, key:number) => ({
                                                            label: jetton.symbl,
                                                            value: key,
                                                            avatar: jetton.img,
                                                            description: `${balanceString(jetton.balance)} ${jetton.symbl}`
                                                        })
                                                    )
                                                }
                                                renderOption={({ option, ...restProps }) => (

                                                    <CustomSelectOption
                                                        {...restProps}
                                                        before={
                                                            <Avatar
                                                                size={20}
                                                                src={option.avatar}
                                                            />
                                                        }
                                                    // description={option.description}
                                                    />

                                                )}
                                                value={1}
                                                onChange={(e:any) => {
                                                }}
                                            >
                                            </CustomSelect>

                                            <Input
                                                placeholder="0.0"
                                                value={inputLiq2}
                                                onChange={(e) => {
                                                    calculateAmountNew(
                                                        inputNumberSet(e.target.value),
                                                        1
                                                    )
                                                }}
                                                align="right"
                                                className='fix_input'
                                                style={
                                                    { border: 'none' }
                                                }
                                            />

                                        </div>
                                    </Div>
                                </Card>
                            </CardGrid>
                            : null}
                        <br />

                        <Button size='l' stretched onClick={addLiq}>Add</Button>
                        <br />

                        <Button size='l' stretched onClick={removeLp} appearance={'negative'} disabled={balanceLp === 0}>Remove all LP</Button>
                    </Div>
                </Group>
            </ModalPage>
        </ModalRootFix>
    )

    function getWidthCol () {
        if (isDesktop) {
            if (activeStory === 'explorer') {
                return '700px'
            }
            if (activeStory === 'farms') {
                return '700px'
            }
            return '380px'
        }
        return '100%'
    }

    function getPaddingTop () {
        if (isDesktop) {
            return '10px'
        }
        if (isExtension) {
            return '0px'
        }
        return '40px'
    }

    return (

        <AppRoot>
            <SplitLayout
                style={{ justifyContent: 'center', paddingTop: getPaddingTop() }}
                header={hasHeader && !isExtension && <PanelHeader separator={false} className={'menu1'} left={
                    <img src={logoPNG} className="logo" style={{ cursor: 'pointer' }} />
                }
                right={ !isExtension && (
                    isDesktop
                        ? <div>
                            {loadWallet === 1
                                ? <CardGrid size="l">
                                    <Card>
                                        <SimpleCell
                                            before={<Avatar src={listJettons[0].img} size={28} />}
                                            onClick={() => setModal('wallet')}
                                            after={<Icon28WalletOutline/>}
                                        >
                                            {truncate(address, 13)}
                                        </SimpleCell>
                                    </Card>
                                </CardGrid>
                                : <Button
                                    size="l"
                                    onClick={() => {
                                        loginHub()
                                        setModal('login')
                                    }}
                                    data-story="swap"
                                    before={<Icon28DoorArrowLeftOutline/>}
                                >Connect wallet</Button>}
                        </div>
                        : <div>
                            {loadWallet === 1
                                ? <IconButton
                                    onClick={() => setModal('wallet')}
                                    data-story="swap"
                                ><Icon28WalletOutline/></IconButton>
                                : <IconButton
                                    onClick={() => {
                                        loginHub()
                                        setModal('login')
                                    }}
                                    data-story="swap"
                                ><Icon28WalletOutline/></IconButton>}
                        </div>
                )}
                >
                    {isDesktop && !isExtension && (<div className="logo-block">
                        <ButtonGroup
                            mode="horizontal"
                            gap="m"
                            stretched
                        >
                            <Button size="l" appearance="accent" mode="tertiary">
                                    Main
                            </Button>
                            <Button size="l" appearance="accent" mode="tertiary">
                                    Dex
                            </Button>
                            <Button size="l" appearance="accent" mode="tertiary">
                                    NFT Marketplace
                            </Button>
                            <Button size="l" appearance="accent" mode="tertiary">
                                    NFT Earn
                            </Button>
                        </ButtonGroup>
                    </div>)
                    }
                </PanelHeader>}
                popout={popout}
                modal={modalRoot}
            >
                {isDesktop && false && (
                    <SplitCol fixed width={300} maxWidth={300}>
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
                                {loadWallet === 1
                                    ? <Cell
                                        onClick={() => setModal('wallet')}
                                        data-story="swap"
                                        before={<Icon28WalletOutline/>}
                                        after={<IconButton onClick={() => {
                                            setModal('conf_exit')
                                        }}><Icon28DoorArrowRightOutline /></IconButton>}
                                    >{truncate(address, 12)}</Cell>
                                    : <Cell
                                        onClick={() => {
                                            loginHub()
                                            setModal('login')
                                        }}
                                        data-story="swap"
                                        before={<Icon28DoorArrowLeftOutline/>}
                                    >Login</Cell>
                                }
                                <Separator style={{ margin: '12px 0' }} />
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

                {isDesktop
                && false && <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '800px' : '100%'}
                    maxWidth={isDesktop ? '800px' : '100%'}
                >
                    <Panel>
                        {hasHeader && !isExtension && <PanelHeader left={
                            <img src={logoPNG} className="logo" />
                        }>
                            <div className="logo-block">
                                <ButtonGroup
                                    mode="horizontal"
                                    gap="m"
                                    stretched
                                >
                                    <Button size="l" appearance="accent" mode="tertiary">
                                        Main
                                    </Button>
                                    <Button size="l" appearance="accent" mode="tertiary">
                                        Dex
                                    </Button>
                                    <Button size="l" appearance="accent" mode="tertiary">
                                        NFT Marketplace
                                    </Button>
                                    <Button size="l" appearance="accent" mode="tertiary">
                                        NFT Earn
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </PanelHeader>}

                        {/* <Group>
                            <Div style={{ height: '40vh' }}>
                                <TradingViewWidget symbol="NASDAQ:AAPL" theme={Themes.DARK} autosize />
                            </Div>
                        </Group> */}

                    </Panel>
                </SplitCol>
                }

                {listJettons.length > 1 && loadPage === 1
                    ? <SplitCol
                        animate={!isDesktop}
                        spaced={isDesktop}
                        width={getWidthCol()}
                        maxWidth={getWidthCol()}
                    >
                        <Epic
                            activeStory={activeStory}
                            tabbar={
                                !isDesktop && !isExtension && (
                                    <Tabbar>
                                        <TabbarItem
                                        // onClick={null}
                                            selected={activeStory === 'main'}
                                            text="Main"
                                        >
                                            <Icon28HomeOutline />
                                        </TabbarItem>
                                        <TabbarItem
                                            onClick={onStoryChange}
                                            selected={activeStory === 'swap'}
                                            data-story="swap"
                                            text="Dex"
                                        >
                                            <Icon28StatisticsOutline />
                                        </TabbarItem>

                                        <TabbarItem
                                        // onClick={onStoryChange}
                                            selected={activeStory === 'nft'}
                                            data-story="nft"
                                            text="NFT"
                                        >
                                            <Icon28MarketOutline />
                                        </TabbarItem>

                                        <TabbarItem
                                        // onClick={onStoryChange}
                                            selected={activeStory === 'earn'}
                                            data-story="earn"
                                            text="Earn"
                                        >
                                            <Icon28CoinsOutline />
                                        </TabbarItem>
                                        {/* <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === 'explorer'}
                                        data-story="explorer"
                                        text="Explorer"
                                    >
                                        <Icon28ArticleOutline />
                                    </TabbarItem> */}
                                        {/* <TabbarItem
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
                                    </TabbarItem> */}
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
                                setActiveStory={setActiveStory}
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
                                isDesktop={isDesktop}
                                setActiveStory={setActiveStory}
                                listJettons={listJettons}
                                fromJetton={fromJetton}
                                setFromJetton={setFromJetton}
                                toJetton={toJetton}
                                setToJetton={setToJetton}
                                loginHub={loginHub}
                                dexType={dexType}
                                loginCook={loginCook}
                            />

                            <FarmsPanel
                                id={'farms'}
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
                                isDesktop={isDesktop}
                                setActiveStory={setActiveStory}
                                listJettons={listJettons}
                                fromJetton={fromJetton}
                                setFromJetton={setFromJetton}
                                toJetton={toJetton}
                                setToJetton={setToJetton}
                                loginHub={loginHub}
                                getPriceSwapNew={getPriceSwapNew}
                                balanceLp={balanceLp}
                                liqObj={liqObj}
                                removeLp={removeLp}
                            />
                        </Epic>
                    </SplitCol>
                    : <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <Spinner size="large" style={{ margin: isDesktop ? '50px 0' : '20px 0' }} />
                    </div>
                }
                {snackbar}
            </SplitLayout>
        </AppRoot>

    )
}
