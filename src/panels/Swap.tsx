import { Icon24ChevronDown, Icon28SyncOutline } from '@vkontakte/icons'
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
    Link
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'

interface IMyProps {
    id: string,
}

const Swap: React.FC<IMyProps> = (props: IMyProps) => {
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    const [ balance, setBalance ] = React.useState<any>(null)

    async function login () {
        const windowTon:any = window
        if (windowTon.ton) {
            const balanceTon = await windowTon.ton.send('ton_getBalance')
            console.log(balanceTon)
            setBalance((balanceTon / 10 ** 9).toFixed(4))

            const addressTon = await windowTon.ton.send('ton_requestAccounts')
            console.log(addressTon)
            setLoadWallet(1)

            // const singTon = await windowTon.ton.send('ton_rawSign', [ { data: 'boc' } ])
            // console.log(singTon)
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

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                <PanelHeader right={<Avatar size={36} />}>Swap</PanelHeader>
                <Group>
                    {loadWallet === 1
                        ? <Div>

                            <Div style={{ paddingBottom: 32 }}>
                                <Title weight="heavy" level="1">Exchange</Title>
                                <small>Trade tokens in an instant</small>
                            </Div>

                            <CardGrid size="l">
                                <Card>
                                    <div style={{ display: 'flex' }}>
                                        <FormItem top="From" style={{ width: '65%' }}>
                                            <Input placeholder="0.0"/>
                                        </FormItem>

                                        <FormItem top="Balance: 0" style={{ width: '20%' }}>
                                            <Cell
                                                disabled
                                                after={<Avatar src="https://biton.pw/static/biton/img/logo.png?1" size={24} />}
                                            >BTN</Cell>
                                        </FormItem>

                                    </div>
                                </Card>
                                <Div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '-8px',
                                    color: 'var(--accent)',
                                    width: '100%'
                                }}>
                                    <Icon24ChevronDown/>
                                </Div>
                                <Card>

                                    <div style={{ display: 'flex' }}>
                                        <FormItem top="To" style={{ width: '65%' }}>
                                            <Input placeholder="0.0"/>
                                        </FormItem>

                                        <FormItem top={`Balance: ${balance}`} style={{ width: '20%' }}>
                                            <Cell
                                                disabled
                                                after={<Avatar src="https://ton.org/_next/static/media/apple-touch-icon.d723311b.png" size={24} />}
                                            >TON</Cell>
                                        </FormItem>

                                    </div>

                                </Card>
                            </CardGrid>
                            <Div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <small>Price</small>
                                <small> 3.2 BTN per TON</small>
                            </Div>
                            <Div>
                                <Button size={'l'} stretched before={<Icon28SyncOutline/>}>Exchange</Button>
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
