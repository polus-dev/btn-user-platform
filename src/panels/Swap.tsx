import { Icon16CancelCircle, Icon24RefreshOutline, Icon28AddCircleOutline, Icon28DoorArrowLeftOutline, Icon28DoorArrowRightOutline, Icon28RefreshOutline, Icon28SnowflakeOutline, Icon28SortOutline, Icon28StatisticsOutline, Icon28SwitchOutline, Icon28SyncOutline, Icon28WalletOutline } from '@vkontakte/icons'
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
    IconButton,
    Slider,
    PanelHeaderButton,
    Snackbar,
    Tabs,
    TabsItem,
    CellButton,
    SegmentedControl,
    CustomSelect,
    CustomSelectOption,
    FormLayoutGroup
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'

import { Address, BOC, Coins } from 'ton3-core'
import { TonhubLocalConnector } from 'ton-x'
import { ToncenterRPC } from '../logic/tonapi'
import { TokenWallet } from '../logic/contracts'

import logoPNG from '../static/logo.png'

interface IMyProps {
    id: string,
    tonrpc: ToncenterRPC,
    setAddress: Function,
    setModal: Function,
    setAddressJopa: Function,
    ContrBTNAddress: string,
    ContrBTNSwapAddress: string,
    addressJopa: string,
    address: string,
    login: Function,
    loadWallet: Number,
    balance: any,
    balanceBTN: number,
    sendBocTHub: Function,
    setSnackbar: Function,
    setSwapConfirm: Function,
    swapConfirm: any,
    setBtnSwap: Function,
    btnSwap: string,
    setTorSwap: Function,
    torSwap: string,
    isDesktop: any,
    setActiveStory: Function,
    listJettons: any,
    fromJetton: any,
    setFromJetton: Function,
    toJetton: any,
    setToJetton: Function,
    loginHub: Function,
    dexType: any
}

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

const Swap: React.FC<IMyProps> = (props: IMyProps) => {
    const { tonrpc } = props
    // const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    // const [ balance, setBalance ] = React.useState<any>(null)

    // const [ balanceBTN, setBalanceBTN ] = React.useState<number>(0)

    const [ priceSwap, setPriceSwap ] = React.useState<string>('0')
    const [ priceSwapTon, setPriceSwapTon ] = React.useState<string>('0')

    const [ tonSwap, setTonSwap ] = React.useState<any>('')
    const [ btnSwap, setBtnSwap ] = React.useState<string>('')

    const [ typeSwap, setTypeSwap ] = React.useState<boolean>(true)

    const [ typeDex, setTypeDex ] = React.useState<any>('')

    function balanceString (balance2:any) {
        return Number(Number(balance2).toFixed(2)).toLocaleString('ru')
    }

    async function getPriceSwap () {
        const address2 = props.fromJetton === 0
            ? props.listJettons[props.toJetton].addressSwap
            : props.listJettons[props.fromJetton].addressSwap
        const jwallPriceResp = await tonrpc.request('runGetMethod', {
            address: address2,
            method: props.dexType === 1 ? 'get_linear_price' : 'get_price',
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

    async function connfirmSendTon () {
        const typeSwap2 = props.fromJetton === 0
        const priceData = await tonrpc.request('runGetMethod', {
            address: (props.fromJetton === 0
                ? props.listJettons[props.toJetton].addressSwap
                : props.listJettons[props.fromJetton].addressSwap),
            method: typeSwap2 ? 'get_price_biton' : 'get_price_ton',
            stack: [ [ 'num', `0x${(parseFloat(props.btnSwap) * (10 ** 9)).toString(16)}` ] ]
        })
        if (priceData.data.ok === true) {
            const amout1 = (Number(priceData.data.result.stack[0][1]) / 10 ** 9).toFixed(9)
            const price1 = (Number(priceData.data.result.stack[1][1]) / 10 ** 9).toFixed(9)
            let fee1 = '0.01'
            if (priceData.data.result.stack[2]) {
                fee1 = (Number(priceData.data.result.stack[2][1]) / 10 ** 9).toFixed(9)
            }

            console.log('price1', amout1)

            const imact = parseFloat(props.btnSwap)
            const imact2 = typeSwap2 ? parseFloat(priceSwap) : parseFloat(priceSwapTon)
            const imact3 = parseFloat(price1)
            console.log(imact3, imact2)
            const imactRes = (imact3 / imact2 - 1) * 100
            const obj1 = {
                amount: amout1,
                price: price1,
                fee: fee1,
                amountU: props.btnSwap,
                type: typeSwap2,
                imact: imactRes.toFixed(4)
            }
            props.setSwapConfirm(obj1)
            props.setModal('confirmSwap')
        }
        console.log('get_price_biton', priceData.data.result.stack)
    }

    async function swapGo () {
        if (typeSwap) {
            // ton to btn
            // sendTon()
            connfirmSendTon()
        } else {
            // btn to ton
            // sendBiton()
            connfirmSendTon()
        }
    }

    async function calculatePriceInput (price:string, type:boolean) {
        const prN = parseFloat(price)
        console.log('Price', price)

        if (price === '') {
            props.setBtnSwap('')
            setTonSwap('')
        } else if (type) {
            // ton to btn
            const btnN = typeSwap ? parseFloat(priceSwapTon) * prN : parseFloat(priceSwap) * prN
            setTonSwap(parseFloat(btnN.toFixed(10)).toFixed(9))
            props.setBtnSwap(price)
        } else {
            // btn to ton
            const btnN = typeSwap ? parseFloat(priceSwap) * prN : parseFloat(priceSwapTon) * prN
            props.setBtnSwap(parseFloat(btnN.toFixed(10)).toFixed(9))
            setTonSwap(price)
        }
    }
    async function changeTypeSwap () {
        if (typeSwap) {
            // ton to btn

        } else {
            // btn to ton
        }
        const btnSw = props.btnSwap
        props.setBtnSwap(tonSwap)
        setTonSwap(btnSw)
        setTypeSwap(!typeSwap)
    }

    useEffect(() => {
        const load = async () => {
            // setAddress('1')
            // login()
            getPriceSwap()
            setTypeDex('swap')
        }
        load()
    }, [])

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

    function sliceArr (arr:any, i:any) {
        const arr2 = JSON.stringify(arr)
        const arr3 = JSON.parse(arr2)
        arr3.splice(i, 1)
        return arr3
    }

    function calculateAmountNew (amount:any, type:any) {
        if (amount === '') {
            props.setBtnSwap('')
            setTonSwap('')
        } else {
            const amountN = Number(amount)
            if (type === 0) { // from
                let amountTo = 0
                if (props.fromJetton === 0) { // from ton to jetton
                    amountTo = parseFloat(priceSwapTon) * amountN
                } else { // from jetton to ton
                    amountTo = parseFloat(priceSwap) * amountN
                }

                setTonSwap(parseFloat(amountTo.toFixed(10)).toFixed(9))
                props.setBtnSwap(amount)
            } else { // to
                let amountFrom = 0
                if (props.fromJetton === 0) { // from ton to jetton
                    amountFrom = parseFloat(priceSwapTon) * amountN
                } else { // from jetton to ton
                    amountFrom = parseFloat(priceSwap) * amountN
                }

                props.setBtnSwap(parseFloat(amountFrom.toFixed(10)).toFixed(9))
                setTonSwap(amount)
            }
        }
    }

    function resyncInputAmount () {
        const tonSwapCopy = tonSwap
        setTonSwap(Number(props.btnSwap))
        props.setBtnSwap(Number(tonSwapCopy))
    }

    function changeJetton (jetton:any, type:any) {
        getPriceSwap()

        if (type === 0) { // from
            if (Number(jetton) === Number(props.toJetton)) {
                // если юзер выбрал 2 одинаковых жетона - меняем местами
                props.setToJetton(Number(props.fromJetton))
            } else if (Number(props.toJetton) === 0) {
                // если юзер хочет поменять тон на жетон - поставить тон в другой выбор
                props.setToJetton(0)
            } else if (Number(props.fromJetton) === 0) {
                props.setToJetton(0)
            }
            props.setFromJetton(Number(jetton))
        } else { // to
            if (Number(jetton) === Number(props.fromJetton)) {
                // если юзер выбрал 2 одинаковых жетона - меняем местами
                props.setFromJetton(Number(props.toJetton))
            } else if (Number(props.toJetton) === 0) {
                // если юзер хочет поменять тон на жетон - поставить тон в другой выбор
                props.setFromJetton(0)
            } else if (Number(props.fromJetton) === 0) {
                props.setFromJetton(0)
            }
            props.setToJetton(Number(jetton))
        }

        calculateAmountNew(props.btnSwap, 0)
    }

    function filterArr (arr:any) {
        const result = arr.filter((jetton:any) => jetton.addressSwap !== '')
        // console.log(result)
        return result
    }

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                {!isExtension && <PanelHeader></PanelHeader>}
                {/* <PanelHeader
                    left={props.isDesktop ? null : <img src={logoPNG} className="logo" style={{ marginLeft: '16px' }} />}
                    right={
                        props.isDesktop
                            ? <div>
                                {props.loadWallet === 1
                                    ? <Button
                                        size="l" appearance="accent" mode="tertiary"
                                        onClick={() => props.setModal('wallet')}
                                        data-story="swap"
                                        after={<Icon28WalletOutline/>}
                                    >{truncate(props.address, 13)}</Button>
                                    : <Button
                                        size="l"
                                        onClick={() => props.setModal('login')}
                                        data-story="swap"
                                        before={<Icon28DoorArrowLeftOutline/>}
                                    >Connect wallet</Button>}
                            </div>
                            : <div>
                                {props.loadWallet === 1
                                    ? <IconButton
                                        onClick={() => props.setModal('wallet')}
                                        data-story="swap"
                                    ><Icon28WalletOutline/></IconButton>
                                    : <IconButton
                                        onClick={() => props.setModal('login')}
                                        data-story="swap"
                                    ><Icon28WalletOutline/></IconButton>}
                            </div>
                    }
                ></PanelHeader> */}
                <Group>
                    <Div style={ isExtension ? { paddingTop: '0' } : {}}>
                        {!isExtension
                        && <SegmentedControl
                            name="sex"
                            defaultValue="swap"
                            onChange={(value) => {
                                if (value === 'farms') {
                                    // props.setModal('farms')
                                    setTypeDex('swap')
                                    props.setActiveStory('farms')
                                } else if (value === 'explorer') {
                                    props.setActiveStory('explorer')
                                } else {
                                    setTypeDex(value)
                                }
                            }}
                            // value={typeDex}
                            options={[
                                {
                                    label: 'Swap',
                                    value: 'swap'
                                },
                                {
                                    label: 'Farms',
                                    value: 'farms'
                                },
                                {
                                    label: 'Explorer',
                                    value: 'explorer'
                                }
                            ]}
                        />
                        }

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Div style={{ paddingBottom: 32 }}>
                                <Title weight="3" level="1">Swap</Title>
                                <small>Trade token in an instant</small>
                            </Div>
                            <Div>
                                <IconButton onClick={getPriceSwap}>
                                    <Icon28RefreshOutline />
                                </IconButton>
                            </Div>
                        </div>

                        <CardGrid size="l">
                            {true
                            && <div>
                                <Card>
                                    <Div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <small>From</small>
                                            <small>{`Balance: ${balanceString(props.listJettons[props.fromJetton].balance)}`}</small>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>

                                            <Avatar
                                                src={props.listJettons[props.fromJetton].img}
                                                size={34}
                                            />
                                            <CustomSelect
                                                placeholder={
                                                    props.listJettons[props.fromJetton].symbl
                                                }
                                                selectType="plain"
                                                className='fix_input'
                                                style={{ maxWidth: '38%', cursor: 'pointer' }}
                                                options={
                                                    filterArr(props.listJettons).map(
                                                        (jetton:any, key:number) => ({
                                                            label: jetton.symbl,
                                                            value: key,
                                                            avatar: jetton.img,
                                                            description: `${balanceString(jetton.balance)} ${jetton.symbl}`
                                                        })
                                                    )
                                                }
                                                disabled
                                                onClick={() => props.setModal('select')}
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
                                                value={props.fromJetton}
                                                onChange={(e:any) => {
                                                    changeJetton(e.target.value, 0)
                                                }}
                                            >
                                            </CustomSelect>

                                            <Input
                                                placeholder="0.0"
                                                value={props.btnSwap}
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

                                <Div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '-8px',
                                    color: 'var(--accent)',
                                    width: '100%'
                                }}>
                                    <IconButton onClick={() => {
                                        changeJetton(props.toJetton, 0)
                                        resyncInputAmount()
                                    }}>
                                        <Icon28SortOutline/>
                                    </IconButton>
                                </Div>

                                <Card>
                                    <Div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <small>To</small>
                                            <small>{`Balance: ${balanceString(props.listJettons[props.toJetton].balance)}`}</small>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>

                                            <Avatar
                                                src={props.listJettons[props.toJetton].img}
                                                size={34}
                                            />
                                            <CustomSelect
                                                placeholder={
                                                    props.listJettons[props.toJetton].symbl
                                                }
                                                selectType="plain"
                                                className='fix_input'
                                                style={{ maxWidth: '38%', cursor: 'pointer' }}
                                                options={
                                                    filterArr(props.listJettons).map(
                                                        (jetton:any, key:number) => (
                                                            {
                                                                label: jetton.symbl,
                                                                value: key,
                                                                avatar: jetton.img,
                                                                description: `${balanceString(jetton.balance)} ${jetton.symbl}`
                                                            }
                                                        )
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
                                                disabled
                                                onClick={() => props.setModal('select_to')}
                                                value={props.toJetton}
                                                onChange={(e:any) => {
                                                    changeJetton(e.target.value, 1)
                                                }}
                                            >
                                            </CustomSelect>

                                            <Input
                                                placeholder="0.0"
                                                value={tonSwap}
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
                            </div>
                            }

                            {/* {typeSwap
                                ? <Card>

                                    <div style={{ display: 'flex' }}>
                                        <FormItem top="From" style={{ width: '65%' }}>
                                            <Input placeholder="0.0" value={props.btnSwap} onChange={(e) => { calculatePriceInput(inputNumberSet(e.target.value), true) }} type={'number'} />
                                        </FormItem>

                                        <FormItem top={`${Number(props.balance).toFixed(2)}`} style={{ width: '20%' }}>
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
                                            <Input placeholder="0.0" value={props.btnSwap} onChange={(e) => { calculatePriceInput(inputNumberSet(e.target.value), true) }} type={'number'} />
                                        </FormItem>

                                        <FormItem top={`${Number(props.balanceBTN).toFixed(2)}`} style={{ width: '20%' }}>
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
                                            <Input placeholder="0.0" value={tonSwap} onChange={(e) => { calculatePriceInput(inputNumberSet(e.target.value), false) }} type={'number'} />
                                        </FormItem>

                                        <FormItem top={`${Number(props.balanceBTN).toFixed(2)}`} style={{ width: '20%' }}>
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
                                            <Input placeholder="0.0" value={tonSwap} onChange={(e) => { calculatePriceInput(inputNumberSet(e.target.value), false) }} type={'number'} />
                                        </FormItem>

                                        <FormItem top={`${Number(props.balance).toFixed(2)}`} style={{ width: '20%' }}>
                                            <Cell
                                                disabled
                                                after={<Avatar src="https://ton.org/_next/static/media/apple-touch-icon.d723311b.png" size={24} />}
                                            >TON</Cell>
                                        </FormItem>

                                    </div>

                                </Card>
                            } */}
                        </CardGrid>

                        <Div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                            <small>Price</small>
                            {Number(props.fromJetton) === 0
                                ? <small>
                                    {`${priceSwapTon} ${props.listJettons[props.toJetton].symbl} per 1 ${props.listJettons[props.fromJetton].symbl}`}
                                </small>
                                : <small>
                                    {`${priceSwap} ${props.listJettons[props.fromJetton].symbl} per 1 ${props.listJettons[props.toJetton].symbl}`}
                                </small>
                            }

                        </Div>

                        <FormItem top="Slippage Tolerance" bottom={`${props.torSwap} %`}>
                            <Slider
                                step={1}
                                min={1}
                                max={20}
                                value={Number(props.torSwap)}
                                onChange={value2 => props.setTorSwap(value2)}
                            />
                        </FormItem>
                        {/* <Cell after={'3 %'}>
                        Price Impact
                        </Cell> */}
                        <Div>
                            {props.loadWallet === 1
                                ? <Button
                                    size={'l'}
                                    stretched
                                    before={<Icon28SyncOutline/>}
                                    onClick={swapGo}
                                    disabled={priceSwap === '0' || props.loadWallet !== 1 || priceSwap === '' || props.btnSwap === '' || props.btnSwap === '0'}
                                >Exchange</Button>
                                : <Button
                                    size="l"
                                    stretched
                                    onClick={() => {
                                        props.loginHub()
                                        props.setModal('login')
                                    }}
                                    data-story="swap"
                                    before={<Icon28DoorArrowLeftOutline/>}
                                >Connect wallet</Button>
                            }
                        </Div>

                        {isExtension
                            ? <Div style={{ textAlign: 'center' }}>
                                <div style={{ textAlign: 'center' }}>Powered by <Link href="https://biton.pw" target='_blank'>BITON</Link></div>
                                {/* <img src={logoPNG} className="logo" /> */}
                            </Div>
                            : null}
                        {/* <Div>
                            <Button size={'l'} stretched before={<Icon28AddCircleOutline/>} onClick={() => props.setModal('liquidity')} mode="secondary">Add liquidity</Button>
                        </Div> */}

                    </Div>

                    {/* { props.loadWallet === 2
                        ? <Div><p>Wallet is not installed. Install the wallet TON at the link <Link target="_blank" href="https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd">Install</Link>
                        </p></Div> : null
                    } */}

                    {/* { props.loadWallet === 0
                        ? <p>Load</p> : null
                    } */}
                </Group>
            </Panel>
        </View>

    )
}

export { Swap }
