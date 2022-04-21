import { Icon56MentionOutline, Icon56MessageReadOutline, Icon56UsersOutline } from '@vkontakte/icons'
import {
    useAdaptivity,
    usePlatform,
    VKCOM,
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    PanelHeader,
    Group,
    Cell,
    Separator,
    Alert,
    Avatar,
    Placeholder,
    Button,
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    CellButton
} from '@vkontakte/vkui'

import '@vkontakte/vkui/dist/vkui.css'
import React, { useEffect } from 'react'

export const App: React.FC = () => {
    const platform = usePlatform()
    const { viewWidth } = useAdaptivity()

    const panels = [ 'panel 1', 'panel 2', 'panel 3' ]
    const modals = [ 'modal 1', 'modal 2' ]

    const [ panel, setPanel ] = React.useState(panels[0])
    const [ modal, setModal ] = React.useState<any>(null)
    const [ popout, setPopout ] = React.useState<any>(null)

    const isDesktop = window.innerWidth >= 1000
    const hasHeader = platform !== VKCOM

    useEffect(() => {
        const load = async () => {
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
                                {panels.map(i => (
                                    <Cell
                                        key={i}
                                        disabled={i === panel}
                                        style={
                                            i === panel
                                                ? {
                                                    backgroundColor:
                              'var(--button_secondary_background)',
                                                    borderRadius: 8
                                                }
                                                : {}
                                        }
                                        onClick={() => setPanel(i)}
                                    >
                                        {i}
                                    </Cell>
                                ))}
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
                    <View activePanel={panel}>
                        <Panel id={panels[0]}>
                            <PanelHeader right={<Avatar size={36} />}>Panel 1</PanelHeader>
                            <Group>
                                <Placeholder
                                    icon={<Icon56UsersOutline />}
                                    header="Уведомления от сообществ"
                                    action={<Button size="m">Подключить сообщества</Button>}
                                >
                  Подключите сообщества, от которых Вы хотите получать
                  уведомления {viewWidth}
                                </Placeholder>
                                <Separator />
                                <Placeholder icon={<Icon56MentionOutline />}>
                  Введите адрес страницы в поле поиска
                                </Placeholder>
                            </Group>
                        </Panel>

                        <Panel id={panels[1]}>
                            <PanelHeader right={<Avatar size={36} />}>Panel 2</PanelHeader>
                            <Group>
                                <Placeholder>Доступ запрещён</Placeholder>
                                <Separator />
                                <Placeholder
                                    header="Находите друзей"
                                    action={<Button size="m">Найти друзей</Button>}
                                >
                  Здесь будут отображаться люди, которых вы добавите в друзья
                                </Placeholder>
                            </Group>
                        </Panel>

                        <Panel id={panels[2]}>
                            <PanelHeader right={<Avatar size={36} />}>Panel 3</PanelHeader>
                            <Group>
                                <Placeholder
                                    icon={<Icon56MessageReadOutline />}
                                    action={
                                        <Button size="m" mode="tertiary">
                      Показать все сообщения
                                        </Button>
                                    }
                                >
                  Нет непрочитанных
                                    <br />
                  сообщений
                                </Placeholder>
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>

    )
}
