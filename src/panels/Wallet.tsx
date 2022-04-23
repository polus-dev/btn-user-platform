import { Icon12Verified, Icon28MessageOutline } from '@vkontakte/icons'
import {
    View,
    Panel,
    PanelHeader,
    Group,
    Avatar,
    SimpleCell,
    IconButton
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'

const Wallet: React.FC = () => {
    const [ address, setAddress ] = React.useState<any>(null)

    useEffect(() => {
        const load = async () => {
            setAddress('1')
        }

        load()
    }, [])

    return (

        <View activePanel={'wallet'}>
            <Panel id={'wallet'}>
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
                        description="Команда ВКонтакте"
                    >
                        {address}
                    </SimpleCell>
                </Group>
            </Panel>
        </View>

    )
}

// eslint-disable-next-line import/no-default-export
export default Wallet
