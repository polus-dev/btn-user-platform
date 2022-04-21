import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
)

const ConfigProviderFix:any = ConfigProvider
const AdaptivityProviderFix:any = AdaptivityProvider

root.render(
    <React.StrictMode>
        <ConfigProviderFix appearance={'dark'}>
            <AdaptivityProviderFix >
                <App />
            </AdaptivityProviderFix>
        </ConfigProviderFix>
    </React.StrictMode>
)
