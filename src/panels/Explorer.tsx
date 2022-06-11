import { Icon16SearchOutline } from '@vkontakte/icons'
import {
    Panel,
    PanelHeader,
    Group,
    View,
    Div,
    FormItem,
    Input,
    IconButton,
    CardGrid,
    Card,
    SimpleCell,
    InfoRow,
    Title,
    ScreenSpinner,
    Header
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import moment from 'moment'
import { QRCodeSVG } from 'qrcode.react'

import React, { useEffect } from 'react'
import { ToncenterRPC } from '../logic/tonapi'

interface IMyProps {
    id: string,
    tonrpc: ToncenterRPC,
    setAddress: Function,
    setModal: Function,
    setAddressJopa: Function,
    ContrBTNAddress: string,
    loadWallet: number,
    address: string,
    getBalanceBiton: Function,
    getBalanceTon: Function,
    setPopout: Function,
    getTransAddress: Function
}

function truncate (fullStr:any, strLen:any) {
    if (fullStr.length <= strLen) return fullStr

    const separator = '...'

    const sepLen = separator.length
    const charsToShow = strLen - sepLen
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)

    return fullStr.substr(0, frontChars - 3)
           + separator
           + fullStr.substr(fullStr.length - backChars)
}

const Explorer: React.FC<IMyProps> = (props: IMyProps) => {

    const { tonrpc } = props
    const [ loadWallet, setLoadWallet ] = React.useState<number>(0)
    // const [ address, setAddress ] = React.useState<FrontAddr>(null)

    const [ addressEx, setAddressEx ] = React.useState<string>('')

    const [ dataWalletAddress, setDataWalletAddress ] = React.useState<any>(null)

    async function searchAddress (addressEx2:string = addressEx) {
        if (addressEx2 !== '') {
            console.log('addressEx2', addressEx2)
            props.setPopout(<ScreenSpinner />)
            const balanceBitonObj = await props.getBalanceBiton(addressEx2, false)
            const balanceTon = await props.getBalanceTon(addressEx2, false)
            const trans = await props.getTransAddress(addressEx2, false)

            const dataW = {
                biton: balanceBitonObj.balance,
                ton: balanceTon,
                address: addressEx2,
                addressBtn: balanceBitonObj.address,
                trans
            }

            setDataWalletAddress(dataW)
            props.setPopout(null)
        }
    }

    function keyEnter (e:any) {
        if (e.keyCode === 13) {
            // можете делать все что угодно со значением текстового поля
            console.log(e)
            searchAddress()
        }
    }

    useEffect(() => {
        const load = async () => {
            // setAddress('1')

        }
        load()
    }, [])

    return (
        <View activePanel={props.id} id={props.id}>
            <Panel id={props.id}>
                <PanelHeader
                // right={
                //     props.loadWallet === 1
                //         ? <React.Fragment>
                //             <PanelHeaderButton onClick={() => props.setModal('wallet')}>
                //                 <Icon28WalletOutline/>
                //                 {truncate(props.address, 12)}
                //             </PanelHeaderButton>
                //         </React.Fragment>
                //         : <PanelHeaderButton onClick={() => props.setModal('login')}>
                //             <Icon28DoorArrowLeftOutline/>
                //         </PanelHeaderButton>
                // }
                >Explorer</PanelHeader>
                <Group>
                    <Div>
                        <Div style={{ paddingBottom: 16 }}>
                            <Title weight="3" level="1">Explorer</Title>
                            <small>View Biton jetton</small>
                        </Div>

                        <FormItem
                            top="Lookup address"
                        >
                            <Input
                                value={addressEx}
                                onChange={(e) => { setAddressEx(e.target.value) }}
                                placeholder="Enter wallet address"
                                onKeyDown={(e:any) => keyEnter(e)}
                                after={
                                    <IconButton
                                        hoverMode="opacity"
                                        aria-label="Search"
                                        onClick={() => searchAddress()}
                                        disabled={addressEx === '' || (addressEx.toLowerCase().substring(0, 2) !== 'kq' && addressEx.toLowerCase().substring(0, 2) !== 'eq')}
                                    >
                                        <Icon16SearchOutline />
                                    </IconButton>
                                }
                            />
                        </FormItem>

                        {dataWalletAddress !== null
                            ? <CardGrid size="l">
                                <Card>
                                    <Div>
                                        <Header mode="tertiary">Info address</Header>

                                        <div style={
                                            {
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: '12px',
                                                marginBottom: '12px',
                                                padding: '26px'
                                            }}>
                                            <Div style={{ background: '#fff', borderRadius: '32px', padding: '32px' }}>
                                                <QRCodeSVG value={`ton://transfer/${dataWalletAddress.address}`} size={260} />
                                            </Div>
                                        </div>

                                        <SimpleCell multiline>
                                            <InfoRow header={'Address'}>{dataWalletAddress.address}</InfoRow>
                                        </SimpleCell>

                                        <SimpleCell multiline>
                                            <InfoRow header={'Address Jetton Wallet'}>{dataWalletAddress.addressBtn}</InfoRow>
                                        </SimpleCell>

                                        <SimpleCell multiline>
                                            <InfoRow header={'State Jetton Wallet'}>{dataWalletAddress.biton > 0 ? 'active' : dataWalletAddress.trans.length > 0 ? 'not active' : 'uninitialized'}</InfoRow>
                                        </SimpleCell>

                                        <SimpleCell multiline>
                                            <InfoRow header={'Balance Ton'}>{dataWalletAddress.ton}</InfoRow>
                                        </SimpleCell>

                                        <SimpleCell multiline>
                                            <InfoRow header={'Balance Biton'}>{dataWalletAddress.biton}</InfoRow>
                                        </SimpleCell>
                                    </Div>
                                </Card>
                                <Card>
                                    <Div>
                                        <Header mode="tertiary">History address</Header>
                                        {/* {dataWalletAddress.trans.map(
                                            (data:any, key:any) => <RichCell
                                                key={key}
                                                after={`fee: ${(data.fee / 10 ** 9).toFixed(9)}`}
                                                text={`in: ${truncate(data.in_msg.destination, 9)}`}
                                                caption={
                                                    <span>
                                                        {data.out_msgs.length > 0 ? `out: ${data.out_msgs[0].destination}` : 'No outgoing messages'}
                                                        <br />
                                                        {data.out_msgs.length > 0 ? data.out_msgs[0].msg_data.text ? `comment: ${(data.out_msgs[0].msg_data.text).toString('base64')}` : '' : ''}
                                                    </span>
                                                }
                                            >
                                                {data.out_msgs.length > 0 ? '-' : '+'} {(data.in_msg.value / 10 ** 9).toFixed(9)} Ton
                                            </RichCell>
                                        )} */}
                                    </Div>
                                </Card>
                            </CardGrid>
                            : null}

                        {dataWalletAddress !== null
                            ? <CardGrid size="l">
                                {dataWalletAddress.trans.map(
                                    (data:any, key:any) => <Card
                                        key={key}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Div>
                                                <Div>{moment(data.utime * 1000).format('ll, H:MM')}</Div>
                                                {/* {data.utime} */}
                                                <Header mode="tertiary" className={data.in_msg.source !== '' ? 'in_msg' : ''}>in msg</Header>
                                                <SimpleCell multiline>
                                                    <InfoRow header={'Value'}>
                                                        + {(data.in_msg.value / 10 ** 9).toFixed(9)} Ton
                                                    </InfoRow>
                                                </SimpleCell>
                                                {data.in_msg.source !== ''
                                                    ? <SimpleCell multiline onClick={() => searchAddress(data.in_msg.source)}>
                                                        <InfoRow header={'From'}>
                                                            {truncate(data.in_msg.source, 15)}
                                                        </InfoRow>
                                                    </SimpleCell>
                                                    : null}

                                                <SimpleCell multiline>
                                                    <InfoRow header={'Fee'}>
                                                        {
                                                            (data.fee / 10 ** 9)
                                                                .toFixed(9)
                                                        } Ton
                                                    </InfoRow>
                                                </SimpleCell>

                                                {data.in_msg.msg_data.text !== undefined
                                                    ? <SimpleCell multiline>
                                                        <InfoRow header={'Comment'}>
                                                            {atob(data.in_msg.msg_data.text)}
                                                        </InfoRow>
                                                    </SimpleCell>
                                                    : null
                                                }

                                            </Div>

                                            <Div>
                                                <Div style={{ marginTop: '22px' }}> </Div>
                                                <Header mode="tertiary" className={data.out_msgs.length > 0 ? 'out_msg' : ''}>out msgs</Header>
                                                {data.out_msgs.length > 0
                                                    ? data.out_msgs.map(
                                                        (data2:any, key2:any) => <div key={key2}>
                                                            <Header mode="tertiary">#{key2}</Header>

                                                            <SimpleCell multiline>
                                                                <InfoRow header={'Value'}>
                                                                    - {
                                                                        (data2.value / 10 ** 9)
                                                                            .toFixed(9)
                                                                    } Ton
                                                                </InfoRow>
                                                            </SimpleCell>

                                                            <SimpleCell multiline onClick={() => searchAddress(data2.destination)}>
                                                                <InfoRow header={'From'}>
                                                                    {truncate(data2.destination, 15)
                                                                    }
                                                                </InfoRow>
                                                            </SimpleCell>

                                                            {data2.msg_data.text !== undefined
                                                                ? <SimpleCell multiline>
                                                                    <InfoRow header={'Comment'}>
                                                                        {atob(data2.msg_data.text)}
                                                                    </InfoRow>
                                                                </SimpleCell>
                                                                : null
                                                            }
                                                        </div>
                                                    )
                                                    : <SimpleCell multiline>
                                                        <InfoRow header={undefined}>
                                                            No outgoing messages
                                                        </InfoRow>
                                                    </SimpleCell>
                                                }

                                            </Div>
                                        </div>
                                    </Card>
                                )}
                            </CardGrid>
                            : null}
                    </Div>
                </Group>
            </Panel>
        </View>

    )
}

export { Explorer }
