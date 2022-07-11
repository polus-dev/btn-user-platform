import { AdaptivityProvider, ConfigProvider, WebviewType, Platform } from '@vkontakte/vkui'
import eruda from 'eruda'
import React from 'react'
import ReactDOM from 'react-dom'
import { TonhubLocalConnector } from 'ton-x'
import { App } from './App'

// const root = ReactDOM.createRoot(
//     document.getElementById('root') as HTMLElement
// )

const ConfigProviderFix:any = ConfigProvider
const AdaptivityProviderFix:any = AdaptivityProvider

const isExtension: boolean = TonhubLocalConnector.isAvailable()

const el = document.createElement('div')
document.body.appendChild(el)

eruda.init({
    container: el,
    tool: [ 'console', 'elements' ]
})

ReactDOM.render(
    <React.StrictMode>
        <ConfigProviderFix appearance={isExtension ? 'light' : 'dark'} webviewType={WebviewType.INTERNAL} platform={Platform.IOS}>
            <AdaptivityProviderFix >
                <App />
            </AdaptivityProviderFix>
        </ConfigProviderFix>
    </React.StrictMode>,
    document.querySelector('#root')
)
