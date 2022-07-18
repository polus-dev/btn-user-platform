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
    loginCook: Function
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

                        <CardGrid size={props.isDesktop ? 'm' : 'l'}>
                            {props.listJettons.length > 2 && props.liqObj !== null
                                ? <Card>
                                    <Div>
                                        <SimpleCell
                                            disabled
                                            before={
                                                <UsersStack
                                                    photos={[ props.listJettons[0].img, props.listJettons[1].img ]}
                                                    size="m"
                                                    style={{ marginRight: '10px' }}
                                                >
                                                </UsersStack>
                                            }
                                            after={null
                                            }
                                        // description="Бот"
                                        >
                                            <b>TON-VNR</b>
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
                                                    {balanceString(props.liqObj.balanceTon)} TON <br/> {balanceString(props.liqObj.balanceJetton)} VNR
                                                </b>}
                                        >
                                    Pool liquidity
                                        </SimpleCell>

                                        {props.liqObjUser !== null
                                            ? <SimpleCell
                                                before={null}
                                                style={{ marginBottom: '12px' }}
                                                disabled
                                                after={
                                                    <b style={{ textAlign: 'right' }}>
                                                        {balanceString(props.liqObjUser.balanceTon)} TON <br/> {balanceString(props.liqObjUser.balanceJetton)} VNR
                                                    </b>}
                                            >
                                    Your balance
                                            </SimpleCell>
                                            : null}

                                        {props.address !== ''
                                            ? <SimpleCell
                                                before={null}
                                                disabled
                                                after={<Button
                                                    size='s'
                                                    appearance='negative'
                                                    mode='outline'
                                                    className='small1'
                                                    onClick={() => props.removeLp()}
                                                >Harvest</Button>}
                                            >
                                        Your lp: <b>{balanceString(props.balanceLp)} VNR-LP</b>
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
                                                    props.getPriceSwapNew()
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
                                </Card>
                                : <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <Spinner size="large" style={{ margin: props.isDesktop ? '50px 0' : '20px 0' }} />
                                </div> }
                        </CardGrid>

                    </Div>
                </Group>
            </Panel>
        </View>

    )
}

export { Farms }
