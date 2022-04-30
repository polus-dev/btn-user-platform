import { Icon20DiamondOutline } from '@vkontakte/icons'
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
    Card
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'
import { FrontAddr } from '../types'

interface IMyProps {
    id: string,
}

const Wallet: React.FC<IMyProps> = (props: IMyProps) => {
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    const [ address, setAddress ] = React.useState<FrontAddr>(null)
    const [ balance, setBalance ] = React.useState<any>(null)

    async function login () {
        const windowTon:any = window
        if (windowTon.ton) {
            const balanceTon = await windowTon.ton.send('ton_getBalance')
            console.log(balanceTon)
            setBalance((balanceTon / 10 ** 9).toFixed(9))

            const addressTon = await windowTon.ton.send('ton_requestAccounts')
            setAddress(addressTon[0])
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
                <PanelHeader right={<Avatar size={36} />}>Wallet</PanelHeader>
                <Group>
                    <Div>

                        <Div style={{ paddingBottom: 32 }}>
                            <Title weight="heavy" level="1">Wallet</Title>
                            <small>List of tokens</small>
                        </Div>
                        { loadWallet === 1
                            ? <div>

                                <Headline weight="regular" style={{ marginBottom: 16, marginTop: 0, textAlign: 'center', opacity: '.6' }}>{address}</Headline>

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
                                </div>

                                <CardGrid size="l">
                                    <Card>
                                        <Div >
                                            <SimpleCell
                                                before={<Avatar size={48} src={''} />}
                                                badge={<Icon20DiamondOutline />}
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
                                                before={<Avatar size={48} src={''} />}
                                                // badge={<Icon20DiamondOutline />}
                                                // after={
                                                //     <IconButton>
                                                //         <Icon28MessageOutline />
                                                //     </IconButton>
                                                // }
                                                description={'EQCljFs9UqV-FuI4u9DD1vPT9NYNGiRZHRHcbT_dfQMHsCQO'}
                                            >
                                    0 BTN
                                            </SimpleCell>
                                        </Div>
                                    </Card>
                                </CardGrid>
                            </div>
                            : null
                        }

                        { loadWallet === 2
                            ? <p>Wallet is not installed. Install the wallet TON at the link <Link href="https://chrome.google.com/webstore/detail/ton-wallet/nphplpgoakhhjchkkhmiggakijnkhfnd">Install</Link>
                            </p> : null
                        }

                        { loadWallet === 0
                            ? <p>Load</p> : null
                        }
                    </Div>
                </Group>
            </Panel>
        </View>

    )
}

export { Wallet }
