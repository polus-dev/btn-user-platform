import { Icon20DiamondOutline, Icon24ReplyOutline, Icon24ShareOutline, Icon28AddCircleOutline, Icon28RefreshOutline } from '@vkontakte/icons'
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
    SegmentedControl
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
    balanceLp: any
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
                        <Div style={{ paddingBottom: 16 }}>
                            <Title weight="3" level="1">Farms</Title>
                            <small>Stake LP tokens to earn</small>
                        </Div>

                        <CardGrid size="l">
                            {props.listJettons.length > 2
                                ? <Card>
                                    <SimpleCell
                                        disabled
                                        before={
                                            <Div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', paddingLeft: 0 }}>
                                                <Avatar size={48} src={props.listJettons[0].img} />
                                                <Avatar size={48} src={props.listJettons[1].img} />
                                            </Div>
                                        }
                                        after={
                                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                                <span style={{ paddingRight: '12px' }}>
                                                    <b>
                                                        {balanceString(props.balanceLp)} VNR-LP
                                                    </b>
                                                </span>
                                                <IconButton onClick={() => {
                                                    props.setModal('liquidity')
                                                    props.getPriceSwapNew()
                                                }}>
                                                    <Icon28AddCircleOutline />
                                                </IconButton>
                                            </div>
                                        }
                                    // description="Бот"
                                    >
                                        <b>TON-VNR</b>
                                    </SimpleCell>
                                </Card>
                                : null }
                        </CardGrid>

                    </Div>
                </Group>
            </Panel>
        </View>

    )
}

export { Farms }
