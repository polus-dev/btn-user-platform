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
    TabbarItem,
    FormItem,
    Input,
    Button,
    Div,
    Checkbox
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import './style.css'

// import { Providers } from 'ton3'

import React, { useEffect } from 'react'

import { Address, BOC, Coins } from 'ton3-core'
import { WalletPanel, SwapPanel } from './panels'
import { ToncenterRPC } from './logic/tonapi'
import { TokenWallet } from './logic/contracts'

export const App: React.FC = () => {
    const platform = usePlatform()

    const modals = [ 'modal 1', 'send', 'recive' ]

    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)

    const [ activeStory, setActiveStory ] = React.useState<any>('wallet')

    const [ address, setAddress ] = React.useState<string>('')

    const [ addressJopa, setAddressJopa ] = React.useState<string>('')

    const [ addressSend, setAddressSend ] = React.useState<string>('')
    const [ amountSend, setAmountSend ] = React.useState<string>('')
    const [ forwardSend, setForwardSend ] = React.useState<boolean>(false)

    const onStoryChange = (e:any) => {
        setActiveStory(e.currentTarget.dataset.story)
    }

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    const tonrpc = new ToncenterRPC('https://testnet.toncenter.com/api/v2/jsonRPC')

    const ContrBTNAddress = 'EQBEqIYR5tfLsPax_60jbbIz8PISDaQ-oEj9u5J59sOX6VNY'
    const ContrBTNSwapAddress = 'kQB-a_wvWIhekZCtKnApleKtjt4Rar29Kw6fIzdB5fgESDhW'

    useEffect(() => {
        const load = async () => {
            // const endpoint = 'https://testnet.toncenter.com/api/v2'
            // const provider = new Providers.ProviderRESTV2(endpoint)

            // const client = await provider.client()

            // console.log(client)
        }

        load()
    }, [])

    async function sendBocT () {
        const msg = TokenWallet.transferMsg({
            queryId: BigInt(Date.now()),
            amount: new Coins(amountSend),
            destination: new Address(addressSend),
            responseDestination: new Address(address),
            forwardTonAmount: new Coins(forwardSend ? 0.05 : 0)
        })

        const boc = BOC.toBase64Standard(msg)
        const windowTon:any = window
        if (windowTon.ton) {
            const singTon = await windowTon.ton.send('ton_sendTransaction', [ { value: 100000000, to: addressJopa, dataType: 'boc', data: boc } ])
            console.log(singTon)
            setAddressSend('')
            setAmountSend('')
        } else {
            console.log('error')
        }
    }

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
                header={<ModalPageHeader>Send Biton</ModalPageHeader>}
            >
                <Group>
                    <FormItem
                        top="Recepient"
                    >
                        <Input value={addressSend} onChange={(e) => { setAddressSend(e.target.value) }} placeholder="Enter wallet address" />
                    </FormItem>

                    <FormItem
                        top="Amount"
                    >
                        <Input value={amountSend} onChange={(e) => { setAmountSend(e.target.value) }} placeholder="0.0" type="number" />
                    </FormItem>
                    <Checkbox onClick={() => {
                        setForwardSend(!forwardSend)
                    }}>
                    forwardTonAmount 0.05 TON
                    </Checkbox>
                    <FormItem>
                        <Button size="l" stretched onClick={sendBocT} disabled={amountSend === '' || addressSend === ''}>
                  Send
                        </Button>
                    </FormItem>
                </Group>
            </ModalPage>

            <ModalPage
                id={modals[2]}
                onClose={() => setModal(null)}
                header={<ModalPageHeader>Recive</ModalPageHeader>}
            >
                <Group>
                    <FormItem
                        top="Share this address to receive."
                    >
                        <Input value={address} onChange={() => {}}/>
                    </FormItem>
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
                                    before={<Icon28WalletOutline/>}
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
                                    before={<Icon28SyncOutline/>}
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
                                <Div>
                                    <small style={{ opacity: 0.6 }}>Biton 2022</small>
                                </Div>

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
                        <WalletPanel
                            id={'wallet'}
                            tonrpc={tonrpc}
                            setAddress={setAddress}
                            setModal={setModal}
                            setAddressJopa={setAddressJopa}
                            ContrBTNAddress={ContrBTNAddress}
                        />
                        <SwapPanel
                            id={'swap'}
                            tonrpc={tonrpc}
                            setAddress={setAddress}
                            setModal={setModal}
                            setAddressJopa={setAddressJopa}
                            ContrBTNAddress={ContrBTNAddress}
                            ContrBTNSwapAddress={ContrBTNSwapAddress}
                            addressJopa={addressJopa}
                            address={address}
                        />
                    </Epic>
                </SplitCol>
            </SplitLayout>
        </AppRoot>

    )
}
