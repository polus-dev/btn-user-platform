import { Icon12Verified, Icon28MessageOutline } from '@vkontakte/icons'
import {
    Panel,
    PanelHeader,
    Group,
    Avatar,
    SimpleCell,
    IconButton,
    View
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'
import { FrontAddr } from '../types'

interface IMyProps {
    id: string,
}

const Wallet: React.FC<IMyProps> = (props: IMyProps) => {
    const [ address, setAddress ] = React.useState<FrontAddr>(null)

    useEffect(() => {
        const load = async () => {
            setAddress('1')
        }
        load()
    }, [])

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                <PanelHeader right={<Avatar size={36} />}>Wallet</PanelHeader>
                <Group>
                    <SimpleCell
                        before={<Avatar size={48} src={''} />}
                        badge={<Icon12Verified />}
                        after={
                            <IconButton>
                                <Icon28MessageOutline />
                            </IconButton>
                        }
                        description="address"
                    >
                        {address}
                    </SimpleCell>
                </Group>
            </Panel>
        </View>

    )
}

export { Wallet }
