import {
    Icon28SyncOutline,
    Icon28WalletOutline
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
    Alert,
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    CellButton,
    Epic,
    Tabbar,
    TabbarItem
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

// import { Providers } from 'ton3'

import React, { useEffect } from 'react'

import { WalletPanel, SwapPanel } from './panels'

export const App: React.FC = () => {
    const platform = usePlatform()

    const modals = [ 'modal 1', 'modal 2', 'recive' ]

    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)

    const [ activeStory, setActiveStory ] = React.useState<any>('wallet')

    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
    }

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    useEffect(() => {
        const load = async () => {
            // const endpoint = 'https://testnet.toncenter.com/api/v2'
            // const provider = new Providers.ProviderRESTV2(endpoint)

            // const client = await provider.client()

            // console.log(client)
        }

        load()
    }, [])

    const ModalRootFix:any = ModalRoot
    const modalRoot = (
        <ModalRootFix activeModal={modal}>
            <ModalPage
                id={modals[0]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Modal 1</ModalPageHeader>}
            >
                <Group>
                    <CellButton onClick={() => setModal(modals[1])}>Modal 2</CellButton>
                </Group>
            </ModalPage>
            <ModalPage
                id={modals[1]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Modal 2</ModalPageHeader>}
            >
                <Group>
                    <CellButton onClick={() => setModal(modals[0])}>Modal 1</CellButton>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[2]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Recive TON</ModalPageHeader>}
            >
                <Group>
                </Group>
            </ModalPage>
        </ModalRootFix>
    )

    return (

        <AppRoot>
            <SplitLayout
                style={{ justifyContent: 'center' }}
                header={hasHeader && <PanelHeader separator={false} />}
                popout={popout}
                modal={modalRoot}
            >
                {isDesktop && (
                    <SplitCol fixed width={280} maxWidth={280}>
                        <Panel>
                            {hasHeader && <PanelHeader />}
                            <Group>
                                <Cell
                                    onClick={onStoryChange}
                                    data-story="wallet"
                                    style={
                                        activeStory === 'wallet'
                                            ? {
                                                backgroundColor: 'var(--button_secondary_background)',
                                                borderRadius: 8
                                            }
                                            : {}
                                    }
                                >Wallet</Cell>
                                <Cell
                                    onClick={onStoryChange}
                                    data-story="swap"
                                    style={
                                        activeStory === 'swap'
                                            ? {
                                                backgroundColor: 'var(--button_secondary_background)',
                                                borderRadius: 8
                                            }
                                            : {}
                                    }
                                >Swap</Cell>
                                <Separator />
                                <Cell onClick={() => setModal(modals[0])}>modal 1</Cell>
                                <Cell onClick={() => setModal(modals[1])}>modal 2</Cell>
                                <Cell
                                    onClick={() => setPopout(
                                        <Alert header="Alert!" onClose={() => setPopout(null)} />
                                    )
                                    }
                                >
                  alert
                                </Cell>
                            </Group>
                        </Panel>
                    </SplitCol>
                )}

                <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '560px' : '100%'}
                    maxWidth={isDesktop ? '560px' : '100%'}
                >
                    <Epic
                        activeStory={activeStory}
                        tabbar={
                            !isDesktop && (
                                <Tabbar>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === 'wallet'}
                                        data-story="wallet"
                                        text="Wallet"
                                    >
                                        <Icon28WalletOutline />
                                    </TabbarItem>
                                    <TabbarItem
                                        onClick={onStoryChange}
                                        selected={activeStory === 'swap'}
                                        data-story="swap"
                                        text="Swap"
                                    >
                                        <Icon28SyncOutline />
                                    </TabbarItem>
                                </Tabbar>
                            )
                        }
                    >
                        <WalletPanel id={'wallet'} />
                        <SwapPanel id={'swap'} />
                    </Epic>
                </SplitCol>
            </SplitLayout>
        </AppRoot>

    )
}
