import {
    Panel,
    PanelHeader,
    Group,
    Avatar,
    View
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'

interface IMyProps {
    id: string,
}

const Swap: React.FC<IMyProps> = (props: IMyProps) => {
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)

    async function login () {
        const windowTon:any = window
        if (windowTon.ton) {
            const balanceTon = await windowTon.ton.send('ton_getBalance')
            console.log(balanceTon)

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

                    {loadWallet}
                </Group>
            </Panel>
        </View>

    )
}

export { Swap }
