import { Icon20DiamondOutline, Icon24ReplyOutline, Icon24ShareOutline, Icon28AddCircleOutline, Icon28ArticleOutline, Icon28DoorArrowLeftOutline, Icon28RefreshOutline } from '@vkontakte/icons'
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
    IconButton,
    SegmentedControl,
    MiniInfoCell,
    UsersStack,
    Spinner
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
    getPriceSwapNew: Function,
    balanceLp: any,
    liqObj: any,
    removeLp: Function,
    liqObjUser: any,
    loginCook: Function,
    setLiqSelectJetton: Function,
    loadPage2: any
}

const Farms: React.FC<IMyProps> = (props: IMyProps) => {
    const { tonrpc } = props
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)

    useEffect(() => {
        const load = async () => {
            // setAddress('1')
        }
        load()
    }, [])

    function balanceString (balance2:any) {
        return Number(Number(balance2).toFixed(2)).toLocaleString('ru')
    }

    function filterArr (arr:any) {
        const result = arr.filter((jetton:any) => jetton.lp !== null)
        // console.log(result)
        return result
    }

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                <PanelHeader right={<Avatar size={36} />}>Wallet</PanelHeader>
                <Group>
                    <Div>

                        <SegmentedControl
                            name="sex"
                            defaultValue="farms"
                            onChange={(value) => {
                                if (value === 'farms') {
                                    // props.setModal('farms')
                                    // setTypeDex('swap')
                                } else if (value === 'swap') {
                                    props.setActiveStory('swap')
                                } else {
                                    // setTypeDex(value)
                                    props.setActiveStory('explorer')
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

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                            <Div style={{ paddingBottom: 32 }}>
                                <Title weight="3" level="1">Farms</Title>
                                <small>Stake LP tokens to earn</small>
                            </Div>
                            <Div>
                                <IconButton onClick={() => {
                                    props.loginCook()
                                }}>
                                    <Icon28RefreshOutline />
                                </IconButton>
                            </Div>
                        </div>

                        {props.loadPage2 === 1
                            ? <CardGrid size={props.isDesktop ? 'm' : 'l'}>
                                {props.listJettons.length > 2
                                    ? filterArr(props.listJettons).map((jetton:any, key:any) => <Card key={key}>
                                        <Div>
                                            <SimpleCell
                                                disabled
                                                before={
                                                    <UsersStack
                                                        photos={[ props.listJettons[0].img, jetton.img ]}
                                                        size="m"
                                                        style={{ marginRight: '10px' }}
                                                    >
                                                    </UsersStack>
                                                }
                                                after={null
                                                }
                                                // description="Бот"
                                            >
                                                <b>TON-{jetton.symbl}</b>
                                            </SimpleCell>

                                            {/* <MiniInfoCell
                                        after={'33%'} before={null}>
                                        APR:
                                    </MiniInfoCell> */}

                                            <SimpleCell
                                                before={null}
                                                style={{ marginBottom: '12px' }}
                                                disabled
                                                after={
                                                    <b style={{ textAlign: 'right' }}>
                                                        {balanceString(jetton.lp.balanceTon)} TON <br/> {balanceString(jetton.lp.balanceJetton)} {jetton.symbl}
                                                    </b>}
                                            >
                                    Pool liquidity
                                            </SimpleCell>

                                            {jetton.lp2 && props.loadWallet === 1
                                                ? <SimpleCell
                                                    before={null}
                                                    style={{ marginBottom: '12px' }}
                                                    disabled
                                                    after={
                                                        <b style={{ textAlign: 'right' }}>
                                                            {balanceString(jetton.lp2.balanceTon)} TON <br/> {balanceString(jetton.lp2.balanceJetton)} {jetton.symbl}
                                                        </b>}
                                                >
                                    Your balance
                                                </SimpleCell>
                                                : null}

                                            {jetton.lp2 && props.loadWallet === 1
                                                ? <SimpleCell
                                                    before={null}
                                                    disabled
                                                    after={<Button
                                                        size='s'
                                                        appearance='negative'
                                                        mode='outline'
                                                        className='small1'
                                                        onClick={() => props.removeLp(jetton.id)}
                                                    >Harvest</Button>}
                                                >
                                        Your lp: <b>{balanceString(jetton.lp2.balanceBtnRespInt)} {jetton.symbl}-LP</b>
                                                </SimpleCell>
                                                : null }
                                        </Div>

                                        <Div>
                                            {props.loadWallet === 1
                                                ? <Button
                                                    size={'l'}
                                                    stretched
                                                    before={<Icon28AddCircleOutline />}
                                                    onClick={() => {
                                                        props.setModal('liquidity')
                                                        props.getPriceSwapNew(jetton.addressSwap)
                                                        props.setLiqSelectJetton(jetton.id)
                                                    }}
                                                >Add</Button>
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
                                    </Card>)
                                    : <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                        <Spinner size="large" style={{ margin: props.isDesktop ? '50px 0' : '20px 0' }} />
                                    </div> }
                            </CardGrid>
                            : <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <Spinner size="large" style={{ margin: props.isDesktop ? '50px 0' : '20px 0' }} />
                            </div>
                        }

                    </Div>
                </Group>
            </Panel>
        </View>

    )
}

export { Farms }
